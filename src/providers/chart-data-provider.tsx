import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useVisibilityChange } from "@uidotdev/usehooks";
import { reformatData } from "../components/Chart/FormatData";

const WS_URL = "wss://eggs-64815067aa3c.herokuapp.com/";
const MAX_DATA_POINTS = 10000; // Limit data points to prevent memory leak
const CLEANUP_THRESHOLD = 15000; // Clean up when we exceed this

interface ChartDataPoint {
  timestamp: number;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartDataContextType {
  // Chart data
  chartData: ChartDataPoint[];
  isChartDataLoading: boolean;
  chartDataError: string | null;
  refreshChartData: () => void;
  
  // WebSocket data
  connectionStatus: string;
  lastMessage: any;
  candleSize: number;
  setCandleSize: (size: number) => void;
  formattedChartData: any[];
  
  // Raw data for other components
  updateData: any[];
}

const ChartDataContext = createContext<ChartDataContextType>({
  chartData: [],
  isChartDataLoading: false,
  chartDataError: null,
  refreshChartData: () => {},
  connectionStatus: 'Disconnected',
  lastMessage: null,
  candleSize: 60,
  setCandleSize: () => {},
  formattedChartData: [],
  updateData: [],
});

export const useChartData = () => useContext(ChartDataContext);

export const ChartDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const documentVisible = useVisibilityChange();

  // Chart data state
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isChartDataLoading, setIsChartDataLoading] = useState(false);
  const [chartDataError, setChartDataError] = useState<string | null>(null);
  const [candleSize, setCandleSize] = useState(60);
  const [updateData, setUpdateData] = useState<any[]>([]);
  const [formattedChartData, setFormattedChartData] = useState<any[]>([]);
  const [ready, setReady] = useState(0);
  const [fitCheck, setFitCheck] = useState(true);
  
  // Refs to prevent memory leaks
  const lastMessageRef = useRef<any>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Memoize WebSocket URL to prevent reconnections
  const wS_URL = useMemo(() => {
    return (!documentVisible && ready === 1) || documentVisible ? WS_URL : "wss://";
  }, [documentVisible, ready]);
  
  // WebSocket connection with proper reconnection logic
  const { lastMessage, readyState } = useWebSocket(wS_URL, {
    share: true,
    shouldReconnect: useCallback(() => {
      return documentVisible;
    }, [documentVisible]),
    heartbeat: {
      message: 'ping',
      returnMessage: 'pong',
      timeout: 60000,
      interval: 25000,
    },
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  });
  
  // Track ready state
  useEffect(() => {
    setReady(readyState);
  }, [readyState]);
  
  // Connection status
  const connectionStatus = useMemo(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return 'Connecting';
      case ReadyState.OPEN:
        return 'Connected';
      case ReadyState.CLOSING:
        return 'Disconnecting';
      case ReadyState.CLOSED:
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  }, [readyState]);

  // Clean up old data to prevent memory leak
  const cleanupOldData = useCallback((data: any[]) => {
    if (data.length > CLEANUP_THRESHOLD) {
      // Keep only the most recent MAX_DATA_POINTS
      return data.slice(-MAX_DATA_POINTS);
    }
    return data;
  }, []);

  // Load chart data from localStorage on mount
  useEffect(() => {
    const loadCachedChartData = async () => {
      setIsChartDataLoading(true);
      try {
        const cachedData = localStorage.getItem("egg00ChartData");
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData)) {
            const cleanedData = cleanupOldData(parsedData);
            setChartData(cleanedData);
            setFormattedChartData(cleanedData);
            setUpdateData(cleanedData);
            console.log("Chart data loaded from cache");
          }
        }
      } catch (error) {
        console.error("Failed to load cached chart data:", error);
        setChartDataError("Failed to load cached chart data");
      } finally {
        setIsChartDataLoading(false);
      }
    };

    loadCachedChartData();
  }, [cleanupOldData]);

  // Memoize message handlers to prevent recreating functions
  const handleBulkData = useCallback((rawData: any[], _rawData: any) => {
    if (ready !== 1) return;
    
    setUpdateData((data) => {
      let __data = [...rawData, ...data];
      
      // Clean up data to prevent memory leak
      __data = cleanupOldData(__data);
      
      const _data = reformatData(__data, candleSize);
      setFormattedChartData(_data);
      
      if (_rawData.isFirst && fitCheck) {
        setFitCheck(false);
      }
      
      try {
        // Only save a limited amount to localStorage
        const dataToSave = _data.slice(-MAX_DATA_POINTS);
        localStorage.setItem("egg00ChartData", JSON.stringify(dataToSave));
        setChartData(_data);
      } catch (e) {
        console.warn("Failed to save chart data to localStorage:", e);
      }
      
      return __data;
    });
  }, [ready, candleSize, fitCheck, cleanupOldData]);

  const handleSingleUpdate = useCallback((rawData: any[]) => {
    if (updateData.length === 0) return;
    
    const lastUpdate = updateData[updateData.length - 1];
    if (rawData[0].high !== lastUpdate.high || rawData[0].time > lastUpdate.time) {
      try {
        setUpdateData((prevData) => {
          const _newData = [...prevData];
          _newData[_newData.length - 1] = rawData[0];
          
          // Clean up data periodically
          const cleanedData = cleanupOldData(_newData);
          
          return cleanedData;
        });
        
        const __data = reformatData(_newData, candleSize);
        setFormattedChartData(__data);
      } catch (error) {
        console.warn("Chart update error:", error);
      }
    }
  }, [updateData, candleSize, cleanupOldData]);

  // Handle WebSocket messages
  useEffect(() => {
    // Prevent processing the same message multiple times
    if (!lastMessage || lastMessage === lastMessageRef.current || lastMessage.data === "ping") return;
    
    lastMessageRef.current = lastMessage;
    
    try {
      const _rawData = JSON.parse(lastMessage.data);
      const rawData = _rawData?.data || [];
      
      if (rawData.length > 1) {
        handleBulkData(rawData, _rawData);
      } else if (rawData.length === 1) {
        handleSingleUpdate(rawData);
      }
    } catch (error) {
      console.warn("Failed to parse WebSocket message:", error);
    }
  }, [lastMessage, handleBulkData, handleSingleUpdate]);
  
  // Periodic cleanup to prevent memory leaks
  useEffect(() => {
    const cleanup = () => {
      setUpdateData(prevData => cleanupOldData(prevData));
      setFormattedChartData(prevData => cleanupOldData(prevData));
      setChartData(prevData => cleanupOldData(prevData));
    };

    // Clean up every 5 minutes
    const interval = setInterval(cleanup, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, [cleanupOldData]);

  // Update formatted data when candle size changes
  const updateFormattedData = useCallback(() => {
    if (updateData.length > 0) {
      const _data = reformatData(updateData, candleSize);
      setFormattedChartData(_data);
    }
  }, [updateData, candleSize]);

  useEffect(() => {
    updateFormattedData();
  }, [updateFormattedData]);

  // Function to refresh chart data
  const refreshChartData = useCallback(async () => {
    setIsChartDataLoading(true);
    setChartDataError(null);

    try {
      const cachedData = localStorage.getItem("egg00ChartData");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          const cleanedData = cleanupOldData(parsedData);
          setChartData(cleanedData);
          setFormattedChartData(cleanedData);
        }
      }
    } catch (error) {
      console.error("Failed to refresh chart data:", error);
      setChartDataError("Failed to load chart data");
    } finally {
      setIsChartDataLoading(false);
    }
  }, [cleanupOldData]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    chartData,
    isChartDataLoading,
    chartDataError,
    refreshChartData,
    connectionStatus,
    lastMessage: null, // Don't expose lastMessage to prevent re-renders
    candleSize,
    setCandleSize,
    formattedChartData,
    updateData,
  }), [
    chartData,
    isChartDataLoading,
    chartDataError,
    refreshChartData,
    connectionStatus,
    candleSize,
    formattedChartData,
    updateData,
  ]);

  return (
    <ChartDataContext.Provider value={contextValue}>
      {children}
    </ChartDataContext.Provider>
  );
};