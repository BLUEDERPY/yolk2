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
    heartbeat: true,
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

  // Load chart data from localStorage on mount
  useEffect(() => {
    const loadCachedChartData = async () => {
      setIsChartDataLoading(true);
      try {
        const cachedData = localStorage.getItem("egg00ChartData");
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData)) {
            setChartData(parsedData);
            setFormattedChartData(parsedData);
            setUpdateData(parsedData);
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
  }, []);

  // Memoize message handlers to prevent recreating functions
  const handleBulkData = useCallback((rawData: any[], _rawData: any) => {
    if (ready !== 1) return;
    
    setUpdateData((data) => {
      const __data = [...rawData, ...data];
      const _data = reformatData(__data, candleSize);
      setFormattedChartData(_data);
      
      if (_rawData.isFirst && fitCheck) {
        setFitCheck(false);
      }
      
      try {
        localStorage.setItem("egg00ChartData", JSON.stringify(_data));
        setChartData(_data);
      } catch (e) {
        console.warn("Failed to save chart data to localStorage:", e);
      }
      
      return __data;
    });
  }, [ready, candleSize, fitCheck]);

  const handleSingleUpdate = useCallback((rawData: any[]) => {
    if (updateData.length === 0) return;
    
    const lastUpdate = updateData[updateData.length - 1];
    if (rawData[0].high !== lastUpdate.high || rawData[0].time > lastUpdate.time) {
      try {
        const _newData = [...updateData];
        _newData[_newData.length - 1] = rawData[0];
        const __data = reformatData(_newData, candleSize);
        setFormattedChartData(__data);
        setUpdateData((s) => [...s, rawData[0]]);
      } catch (error) {
        console.warn("Chart update error:", error);
      }
    }
  }, [updateData, candleSize]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage || lastMessage.data === "ping") return;
    
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
          setChartData(parsedData);
          setFormattedChartData(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to refresh chart data:", error);
      setChartDataError("Failed to load chart data");
    } finally {
      setIsChartDataLoading(false);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    chartData,
    isChartDataLoading,
    chartDataError,
    refreshChartData,
    connectionStatus,
    lastMessage,
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
    lastMessage,
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
      try {
        const _rawData = JSON.parse(lastMessage.data);
        const rawData = _rawData?.data || [];
        
        if (rawData.length > 1) {
          ready === 1 && setUpdateData((data) => {
            const __data = [...rawData, ...data];
            const _data = reformatData(__data, candleSize);
            setFormattedChartData(_data);
            
            if (_rawData.isFirst && fitCheck) {
              setFitCheck(false);
            }
            
            try {
              localStorage.setItem("egg00ChartData", JSON.stringify(_data));
              setChartData(_data);
            } catch (e) {
              console.warn("Failed to save chart data to localStorage:", e);
            }
            
            return __data;
          });
        }
      } catch (error) {
        console.warn("Failed to parse WebSocket message:", error);
      }
    }
  }, [lastMessage, candleSize, ready, fitCheck]);
  
  // Handle WebSocket messages for single data updates
  useEffect(() => {
    if (lastMessage && lastMessage.data !== "ping") {
      try {
        const rawData = JSON.parse(lastMessage.data).data;
        
        if (rawData.length === 1 && updateData.length > 0) {
          if (
            rawData[0].high != updateData[updateData.length - 1].high ||
            rawData[0].time > updateData[updateData.length - 1].time
          ) {
            try {
              let _newData = [...updateData];
              _newData[_newData.length - 1] = rawData[0];
              const __data = reformatData(_newData, candleSize);
              setFormattedChartData(__data);
              setUpdateData((s) => [...s, rawData[0]]);
            } catch (error) {
              console.warn("Chart update error:", error);
            }
          }
        }
      } catch (error) {
        console.warn("Failed to parse WebSocket message:", error);
      }
    }
  }, [lastMessage, updateData, candleSize]);
  
  // Update formatted data when candle size changes
  useEffect(() => {
    if (updateData.length > 0) {
      const _data = reformatData(updateData, candleSize);
      setFormattedChartData(_data);
    }
  }, [candleSize, updateData]);

  // Function to refresh chart data
  const refreshChartData = React.useCallback(async () => {
    setIsChartDataLoading(true);
    setChartDataError(null);

    try {
      // Try to fetch fresh data from cache
      const cachedData = localStorage.getItem("egg00ChartData");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          setChartData(parsedData);
          setFormattedChartData(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to refresh chart data:", error);
      setChartDataError("Failed to load chart data");
    } finally {
      setIsChartDataLoading(false);
    }
  }, []);

  // Update chart data when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "egg00ChartData" && e.newValue) {
        try {
          const parsedData = JSON.parse(e.newValue);
          if (Array.isArray(parsedData)) {
            setChartData(parsedData);
            setFormattedChartData(parsedData);
          }
        } catch (error) {
          console.warn("Failed to parse updated chart data:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ChartDataContext.Provider
      value={{
        chartData,
        isChartDataLoading,
        chartDataError,
        refreshChartData,
        connectionStatus,
        lastMessage,
        candleSize,
        setCandleSize,
        formattedChartData,
        updateData,
      }}
    >
      {children}
    </ChartDataContext.Provider>
  );
};