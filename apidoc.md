
# React Implementation Guide for Candle Data API

This guide provides comprehensive examples for implementing the candle data API in React applications.

## Table of Contents
1. [Setup and Configuration](#setup-and-configuration)
2. [Basic Data Fetching](#basic-data-fetching)
3. [Custom Hooks](#custom-hooks)
4. [Real-time Updates with WebSocket](#real-time-updates-with-websocket)
5. [Chart Components](#chart-components)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)

## Setup and Configuration

### API Configuration
```javascript
// config/api.js
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  wsURL: process.env.REACT_APP_WS_URL || 'ws://localhost:8000',
  defaultTimeframe: '1h',
  defaultLimit: 1000
};

export const TIMEFRAMES = {
  '1m': { label: '1 Minute', minutes: 1 },
  '5m': { label: '5 Minutes', minutes: 5 },
  '30m': { label: '30 Minutes', minutes: 30 },
  '1h': { label: '1 Hour', minutes: 60 },
  '4h': { label: '4 Hours', minutes: 240 },
  '1D': { label: '1 Day', minutes: 1440 },
  '1W': { label: '1 Week', minutes: 10080 },
  '1M': { label: '1 Month', minutes: 43200 }
};
```

### API Service
```javascript
// services/apiService.js
import { API_CONFIG } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get candles for specific timeframe
  async getCandles(timeframe, options = {}) {
    const { limit, startTime, endTime } = options;
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit);
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/candles/${timeframe}${query}`);
  }

  // Get latest candle
  async getLatestCandle(timeframe) {
    return this.request(`/candles/${timeframe}/latest`);
  }

  // Get all prices
  async getPrices(options = {}) {
    const { limit, sortOrder, startTime, endTime } = options;
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/prices${query}`);
  }

  // Get latest price
  async getLatestPrice() {
    return this.request('/prices/latest');
  }

  // Get available timeframes
  async getTimeframes() {
    return this.request('/timeframes');
  }

  // Get total volume
  async getTotalVolume() {
    return this.request('/volume');
  }

  // Get contract info
  async getContractInfo() {
    return this.request('/contract');
  }

  // Get server stats
  async getStats() {
    return this.request('/stats');
  }
}

export default new ApiService();
```

## Basic Data Fetching

### Simple Candle Data Component
```javascript
// components/CandleData.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { TIMEFRAMES } from '../config/api';

const CandleData = () => {
  const [candles, setCandles] = useState([]);
  const [timeframe, setTimeframe] = useState('1h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandles();
  }, [timeframe]);

  const fetchCandles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getCandles(timeframe, { limit: 100 });
      setCandles(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading candles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <label>Timeframe: </label>
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          {Object.entries(TIMEFRAMES).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <h3>Candles ({timeframe})</h3>
        <p>Total candles: {candles.length}</p>
        
        {candles.slice(-10).map((candle, index) => (
          <div key={candle.time} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            <div>Time: {new Date(candle.time * 1000).toLocaleString()}</div>
            <div>Open: {candle.open?.toFixed(6)}</div>
            <div>High: {candle.high?.toFixed(6)}</div>
            <div>Low: {candle.low?.toFixed(6)}</div>
            <div>Close: {candle.close?.toFixed(6)}</div>
            <div>Volume: {candle.volume?.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandleData;
```

## Custom Hooks

### useCandles Hook
```javascript
// hooks/useCandles.js
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useCandles = (timeframe, options = {}) => {
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCandles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getCandles(timeframe, options);
      setCandles(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [timeframe, JSON.stringify(options)]);

  useEffect(() => {
    fetchCandles();
  }, [fetchCandles]);

  const refetch = useCallback(() => {
    fetchCandles();
  }, [fetchCandles]);

  return {
    candles,
    loading,
    error,
    lastUpdated,
    refetch
  };
};

// Usage example:
// const { candles, loading, error, refetch } = useCandles('1h', { limit: 100 });
```

### useLatestPrice Hook
```javascript
// hooks/useLatestPrice.js
import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useLatestPrice = (autoRefresh = false, interval = 30000) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestPrice = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getLatestPrice();
      setPrice(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPrice();
    
    if (autoRefresh) {
      const intervalId = setInterval(fetchLatestPrice, interval);
      return () => clearInterval(intervalId);
    }
  }, [fetchLatestPrice, autoRefresh, interval]);

  return {
    price,
    loading,
    error,
    refetch: fetchLatestPrice
  };
};
```

## Real-time Updates with WebSocket

### WebSocket Hook
```javascript
// hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { API_CONFIG } from '../config/api';

export const useWebSocket = (onMessage, options = {}) => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const { 
    maxReconnectAttempts = 5, 
    reconnectInterval = 3000,
    autoConnect = true 
  } = options;

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(API_CONFIG.wsURL);
      
      ws.current.onopen = () => {
        setConnectionStatus('Connected');
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          if (onMessage) {
            onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        setConnectionStatus('Disconnected');
        console.log('WebSocket disconnected');
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setConnectionStatus(`Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setConnectionStatus('Error');
    }
  }, [onMessage, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close();
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, autoConnect]);

  return {
    connectionStatus,
    lastMessage,
    connect,
    disconnect,
    sendMessage
  };
};
```

### Real-time Price Component
```javascript
// components/RealTimePrice.jsx
import React, { useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useLatestPrice } from '../hooks/useLatestPrice';

const RealTimePrice = () => {
  const [realtimeData, setRealtimeData] = useState(null);
  const { price: latestPrice, loading } = useLatestPrice();

  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === 'price_update') {
      setRealtimeData(data.data);
    }
  }, []);

  const { connectionStatus } = useWebSocket(handleWebSocketMessage);

  const currentPrice = realtimeData || latestPrice;

  if (loading) return <div>Loading price...</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Real-time Price</h3>
      <div>Connection: {connectionStatus}</div>
      
      {currentPrice && (
        <div>
          <div>Price: {currentPrice.close?.toFixed(6)}</div>
          <div>High: {currentPrice.high?.toFixed(6)}</div>
          <div>Low: {currentPrice.low?.toFixed(6)}</div>
          <div>Volume: {currentPrice.volume?.toFixed(2)}</div>
          <div>Time: {new Date(currentPrice.time * 1000).toLocaleString()}</div>
          {realtimeData && (
            <div style={{ color: 'green' }}>● Live</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealTimePrice;
```

## Chart Components

### Simple Candlestick Chart (using Chart.js)
```javascript
// components/CandlestickChart.jsx
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const CandlestickChart = ({ candles, timeframe }) => {
  const chartData = useMemo(() => {
    if (!candles || candles.length === 0) return null;

    return {
      labels: candles.map(candle => new Date(candle.time * 1000)),
      datasets: [
        {
          label: 'Price',
          data: candles.map(candle => ({
            x: new Date(candle.time * 1000),
            y: candle.close
          })),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };
  }, [candles]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Price Chart (${timeframe})`
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy'
          }
        }
      },
      y: {
        beginAtZero: false
      }
    }
  };

  if (!chartData) return <div>No data available</div>;

  return <Chart type="line" data={chartData} options={options} />;
};

export default CandlestickChart;
```

### Advanced Chart with Multiple Timeframes
```javascript
// components/AdvancedChart.jsx
import React, { useState } from 'react';
import { useCandles } from '../hooks/useCandles';
import { TIMEFRAMES } from '../config/api';
import CandlestickChart from './CandlestickChart';

const AdvancedChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [limit, setLimit] = useState(100);
  
  const { candles, loading, error, refetch } = useCandles(selectedTimeframe, { limit });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>
          Timeframe:
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            style={{ marginLeft: '5px' }}
          >
            {Object.entries(TIMEFRAMES).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </label>
        
        <label>
          Limit:
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 100)}
            min="10"
            max="1000"
            style={{ marginLeft: '5px', width: '80px' }}
          />
        </label>
        
        <button onClick={refetch} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <div>Loading chart...</div>
      ) : (
        <CandlestickChart candles={candles} timeframe={selectedTimeframe} />
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h4>Chart Statistics</h4>
        <p>Total candles: {candles.length}</p>
        {candles.length > 0 && (
          <>
            <p>Latest price: {candles[candles.length - 1]?.close?.toFixed(6)}</p>
            <p>Highest: {Math.max(...candles.map(c => c.high)).toFixed(6)}</p>
            <p>Lowest: {Math.min(...candles.map(c => c.low)).toFixed(6)}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedChart;
```

## Error Handling

### Error Boundary Component
```javascript
// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '1px solid red', borderRadius: '4px' }}>
          <h3>Something went wrong with the chart</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Error Handling Hook
```javascript
// hooks/useErrorHandler.js
import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    console.error('Error occurred:', error);
    setError(error.message || 'An unknown error occurred');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
};
```

## Performance Optimization

### Memoized Chart Component
```javascript
// components/OptimizedChart.jsx
import React, { memo, useMemo } from 'react';
import { useCandles } from '../hooks/useCandles';

const OptimizedChart = memo(({ timeframe, limit }) => {
  const { candles, loading, error } = useCandles(timeframe, { limit });

  const chartData = useMemo(() => {
    if (!candles || candles.length === 0) return null;
    
    // Process data for chart
    return candles.map(candle => ({
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume
    }));
  }, [candles]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chartData) return <div>No data</div>;

  return (
    <div>
      {/* Your chart implementation */}
      <div>Chart with {chartData.length} candles</div>
    </div>
  );
});

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;
```

### Data Caching Hook
```javascript
// hooks/useDataCache.js
import { useState, useEffect, useRef } from 'react';

export const useDataCache = (key, fetchFunction, ttl = 60000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(new Map());

  useEffect(() => {
    const fetchData = async () => {
      const cached = cache.current.get(key);
      const now = Date.now();

      if (cached && (now - cached.timestamp) < ttl) {
        setData(cached.data);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchFunction();
        cache.current.set(key, {
          data: result,
          timestamp: now
        });
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFunction, ttl]);

  return { data, loading, error };
};
```

## Complete Example App

```javascript
// App.jsx
import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import AdvancedChart from './components/AdvancedChart';
import RealTimePrice from './components/RealTimePrice';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Candle Data Dashboard</h1>
      </header>
      
      <main style={{ padding: '20px' }}>
        <ErrorBoundary>
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 300px' }}>
            <div>
              <AdvancedChart />
            </div>
            <div>
              <RealTimePrice />
            </div>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
```

This documentation provides a complete guide for implementing the candle data API in React applications, including data fetching, real-time updates, charting, error handling, and performance optimization.