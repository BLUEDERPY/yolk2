import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  useReadContract,
  useAccount,
  useBalance,
  usePublicClient,
  usePrepareTransactionRequest,
  useSimulateContract,
} from "wagmi";
import { EggsContract, Gauge, TokenContracts, TokenType } from "./contracts";
import { Address, formatEther, parseEther } from "viem";
import useWriteContractAndWaitForConfirm from "../hooks/useWriteContractAndWaitForConfirm";
import { useEstimateGas } from "../hooks/useEstimateGas";
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

interface EggsContextType {
  // Protocol data
  totalSupply: bigint | undefined;
  isMintedOut: number | undefined;
  isStarted: boolean | undefined;
  maxSupply: bigint | undefined;
  totalBorrowed: bigint | undefined;
  totalCollateral: bigint | undefined;
  backing: bigint | undefined;
  lastPrice: bigint | undefined;
  loanByDay5: bigint | undefined;
  loanByDay4: bigint | undefined;
  loanByDay3: bigint | undefined;
  loanByDay2: bigint | undefined;
  loanByDay1: bigint | undefined;
  nextReward: bigint | undefined;

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

  // User data for multiple tokens
  userData: {
    eggs: {
      loan: { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined;
      balance: bigint | undefined;
      backingBalance: any | undefined;
    };
    yolk: {
      loan: { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined;
      balance: bigint | undefined;
      backingBalance: any | undefined;
    };
    nest: {
      loan: { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined;
      balance: bigint | undefined;
      backingBalance: any | undefined;
    };
  };
  
  // Legacy compatibility - will be deprecated
  userLoan: { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined;
  userEggsBalance: bigint | undefined;
  userSonicBalance: any | undefined;
  totalMinted: bigint | undefined;

  // Actions - now require token parameter
  refetch: (token?: TokenType) => void;
  buy: (sonicAmount: string, token?: TokenType) => void;
  sell: (eggsAmount: string, token?: TokenType) => void;
  extendLoan: (eggsAmount: string, duration: number, token?: TokenType) => void;
  removeCollateral: (eggsAmount: string, token?: TokenType) => void;
  borrow: (eggsAmount: bigint, duration: number, token?: TokenType) => void;
  borrowMore: (eggsAmount: bigint, token?: TokenType) => void;
  leverage: (sonic: any, days: any, fee: any, token?: TokenType) => void;
  estimatedGas: bigint | undefined;
  closePosition: (token?: TokenType) => void;
  repay: (sonic: bigint, token?: TokenType) => void;
  flashClosePosition: (token?: TokenType) => void;
  isSuccess: boolean | undefined;
  isConfirming: boolean | undefined;
  isPending: boolean | undefined;
  isUserError: boolean | undefined;
  isError: boolean | undefined;
}

const EggsContext = createContext<EggsContextType>({
  totalSupply: undefined,
  isMintedOut: undefined,
  isStarted: undefined,
  maxSupply: undefined,
  totalBorrowed: undefined,
  totalCollateral: undefined,
  backing: undefined,
  lastPrice: undefined,
  chartData: [],
  isChartDataLoading: false,
  chartDataError: null,
  refreshChartData: () => {},
  connectionStatus: 'Disconnected',
  lastMessage: null,
  candleSize: 60,
  setCandleSize: () => {},
  formattedChartData: [],
  userData: {
    eggs: {
      loan: undefined,
      balance: undefined,
      backingBalance: undefined,
    },
    yolk: {
      loan: undefined,
      balance: undefined,
      backingBalance: undefined,
    },
    nest: {
      loan: undefined,
      balance: undefined,
      backingBalance: undefined,
    },
  },
  userLoan: undefined,
  userEggsBalance: undefined,
  userSonicBalance: undefined,
  loanByDay5: undefined,
  loanByDay4: undefined,
  loanByDay3: undefined,
  loanByDay2: undefined,
  loanByDay1: undefined,
  refetch: () => {},
  buy: () => {},
  sell: () => {},
  borrow: () => {},
  borrowMore: () => {},
  leverage: () => {},
  estimatedGas: undefined,
  closePosition: () => {},
  repay: () => {},
  flashClosePosition: () => {},
  removeCollateral: () => {},
  extendLoan: () => {},
  isSuccess: undefined,
  isConfirming: undefined,
  isPending: undefined,
  isUserError: undefined,
  isError: undefined,
  nextReward: undefined,
  totalMinted: undefined,
});

export const useEggsData = () => useContext(EggsContext);

export const EggsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address: userAddress, isConnected } = useAccount();
  const documentVisible = useVisibilityChange();

  // Chart data state
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isChartDataLoading, setIsChartDataLoading] = useState(false);
  const [chartDataError, setChartDataError] = useState<string | null>(null);
  const [candleSize, setCandleSize] = useState(60);
  const [updatedata, setUpdateData] = useState<any[]>([]);
  const [formattedChartData, setFormattedChartData] = useState<any[]>([]);
  const [ready, setReady] = useState(0);
  const [fitCheck, setFitCheck] = useState(true);
  
  // WebSocket connection
  const wS_URL = (!documentVisible && ready === 1) || documentVisible ? WS_URL : "wss://";
  
  const { lastMessage, readyState } = useWebSocket(wS_URL, {
    share: true,
    shouldReconnect: () => {
      return documentVisible;
    },
    heartbeat: true,
  });
  
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
  
  // Handle WebSocket messages for bulk data
  useEffect(() => {
    if (lastMessage && lastMessage.data !== "ping") {
      try {
        const _rawData = JSON.parse(lastMessage.data);
        const rawData = _rawData?.data || [];
        
        if (rawData.length > 1) {
          ready === 1 && setUpdateData((data) => {
            const __data = [...rawData, ...data.slice(0, 10000)]; // Limit data size
            const _data = reformatData(__data, candleSize);
            setFormattedChartData(_data);
            
            if (_rawData.isFirst && fitCheck) {
              setFitCheck(false);
            }
            
            try {
              localStorage.setItem("egg00ChartData", JSON.stringify(_data.slice(-1000)));
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
        
        if (rawData.length === 1 && updatedata.length > 0) {
          if (
            rawData[0].high != updatedata[updatedata.length - 1].high ||
            rawData[0].time > updatedata[updatedata.length - 1].time
          ) {
            try {
              let _newData = [...updatedata];
              _newData[_newData.length - 1] = rawData[0];
              const __data = reformatData(_newData, candleSize);
              setFormattedChartData(__data);
              setUpdateData((s) => [...s.slice(-10000), rawData[0]]);
            } catch (error) {
              console.warn("Chart update error:", error);
            }
          }
        }
      } catch (error) {
        console.warn("Failed to parse WebSocket message:", error);
      }
    }
  }, [lastMessage, updatedata, candleSize]);
  
  // Update formatted data when candle size changes
  useEffect(() => {
    if (updatedata.length > 0) {
      const _data = reformatData(updatedata, candleSize);
      setFormattedChartData(_data);
    }
  }, [candleSize, updatedata]);

  // Load chart data from localStorage on mount
  useEffect(() => {
    const loadCachedChartData = () => {
      try {
        const cachedData = localStorage.getItem("egg00ChartData");
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setFormattedChartData(parsedData);
            setUpdateData(parsedData);
            console.log("Loaded cached chart data");
          }
        }
      } catch (error) {
        console.warn("Failed to load cached chart data:", error);
        localStorage.removeItem("egg00ChartData");
      }
    };

    loadCachedChartData();
  }, []);

  // Function to refresh chart data
  const refreshChartData = useCallback(async () => {
    setIsChartDataLoading(true);
    setChartDataError(null);

    try {
      // Try to fetch fresh data from API or WebSocket
      const cachedData = localStorage.getItem("egg00ChartData");
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          setChartData(parsedData);
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
          }
        } catch (error) {
          console.warn("Failed to parse updated chart data:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Helper function to get contract config for a token
  const getTokenContract = (token: TokenType = 'eggs') => TokenContracts[token];

  // Protocol data reads
  const { data: totalMinted, refetch: refetchTotalMinted } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "totalMinted",
  });
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "totalSupply",
  });
  const { data: isStarted } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "start",
  });
  console.log(isStarted);

  const { data: maxSupply, refetch: refetchMaxSupply } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "maxSupply",
  });

  const { data: totalBorrowed, refetch: refetchTotalBorrowed } =
    useReadContract({
      abi: EggsContract.abi,
      address: EggsContract.address as Address,
      functionName: "getTotalBorrowed",
    });

  const { data: totalCollateral, refetch: refetchTotalCollateral } =
    useReadContract({
      abi: EggsContract.abi,
      address: EggsContract.address as Address,
      functionName: "getTotalCollateral",
    });

  const { data: backing, refetch: refetchBacking } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "getBacking",
  });
  const { data: loanByDay1 } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "getLoansExpiringByDate",
    args: [Math.floor(new Date().getTime() / 1000)],
  });
  const { data: loanByDay2 } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "getLoansExpiringByDate",
    args: [Math.floor(new Date().getTime() / 1000 + 1 * 24 * 60 * 60)],
  });
  const { data: loanByDay3 } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "getLoansExpiringByDate",
    args: [Math.floor(new Date().getTime() / 1000 + 2 * 24 * 60 * 60)],
  });

  const { data: loanByDay4 } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "getLoansExpiringByDate",
    args: [Math.floor(new Date().getTime() / 1000 + 3 * 24 * 60 * 60)],
  });
  const { data: loanByDay5 } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "getLoansExpiringByDate",
    args: [Math.floor(new Date().getTime() / 1000 + 4 * 24 * 60 * 60)],
  });

  const { data: lastPrice, refetch: refetchLastPrice } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "lastPrice",
  });

  // User data reads
  const { data: userLoan, refetch: refetchUserLoan } = useReadContract({
    abi: EggsContract.abi,
    address: EggsContract.address as Address,
    functionName: "getLoanByAddress",
    args: [userAddress],
    enabled: isConnected,
  });

  const { data: nextReward } = useReadContract({
    abi: Gauge.abi,
    address: Gauge.address as Address,
    functionName: "earned",
    args: ["0x5050bc082FF4A74Fb6B0B04385dEfdDB114b2424", userAddress],
    enabled: isConnected,
  });

  const { data: userEggsBalance, refetch: refetchUserEggsBalance } =
    useReadContract({
      abi: EggsContract.abi,
      address: EggsContract.address as Address,
      functionName: "balanceOf",
      args: [userAddress],
      enabled: isConnected,
    });

  // YOLK contract reads
  const { data: yolkUserLoan, refetch: refetchYolkUserLoan } = useReadContract({
    abi: TokenContracts.yolk.abi,
    address: TokenContracts.yolk.address as Address,
    functionName: "getLoanByAddress",
    args: [userAddress],
    enabled: isConnected && TokenContracts.yolk.address !== "0x0000000000000000000000000000000000000000",
  });

  const { data: yolkUserBalance, refetch: refetchYolkUserBalance } = useReadContract({
    abi: TokenContracts.yolk.abi,
    address: TokenContracts.yolk.address as Address,
    functionName: "balanceOf",
    args: [userAddress],
    enabled: isConnected && TokenContracts.yolk.address !== "0x0000000000000000000000000000000000000000",
  });

  // USDC balance for YOLK backing token (placeholder - update with actual USDC contract)
  const { data: usdcBalance, refetch: refetchUsdcBalance } = useBalance({
    address: userAddress,
    token: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894" as Address, // Placeholder USDC address
    enabled: isConnected,
  });

  // NEST contract reads
  const { data: nestUserLoan, refetch: refetchNestUserLoan } = useReadContract({
    abi: TokenContracts.nest.abi,
    address: TokenContracts.nest.address as Address,
    functionName: "getLoanByAddress",
    args: [userAddress],
    enabled: isConnected && TokenContracts.nest.address !== "0x0000000000000000000000000000000000000000",
  });

  const { data: nestUserBalance, refetch: refetchNestUserBalance } = useReadContract({
    abi: TokenContracts.nest.abi,
    address: TokenContracts.nest.address as Address,
    functionName: "balanceOf",
    args: [userAddress],
    enabled: isConnected && TokenContracts.nest.address !== "0x0000000000000000000000000000000000000000",
  });

  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address: userAddress,
    enabled: isConnected,
  });

  // Create userData structure
  const userData = {
    eggs: {
      loan: userLoan ? {
        collateral: userLoan[0] as bigint,
        borrowed: userLoan[1] as bigint,
        endDate: userLoan[2] as bigint
      } : undefined,
      balance: userEggsBalance && userEggsBalance > BigInt(1000) ? userEggsBalance : undefined,
      backingBalance: ethBalance,
    },
    yolk: {
      loan: yolkUserLoan ? {
        collateral: yolkUserLoan[0] as bigint,
        borrowed: yolkUserLoan[1] as bigint,
        endDate: yolkUserLoan[2] as bigint
      } : undefined,
      balance: yolkUserBalance && yolkUserBalance > BigInt(1000) ? yolkUserBalance : undefined,
      backingBalance: usdcBalance,
    },
    nest: {
      loan: nestUserLoan ? {
        collateral: nestUserLoan[0] as bigint,
        borrowed: nestUserLoan[1] as bigint,
        endDate: nestUserLoan[2] as bigint
      } : undefined,
      balance: nestUserBalance && nestUserBalance > BigInt(1000) ? nestUserBalance : undefined,
      backingBalance: { 
        ...ethBalance, 
        value: userEggsBalance || BigInt(0),
        formatted: userEggsBalance ? formatEther(userEggsBalance) : "0"
      },
    },
  };

  const {
    writeContract,
    isError,
    isSuccess,
    isConfirming,
    isPending,
    isUserError,
    reset,
  } = useWriteContractAndWaitForConfirm("");
  const { abi, address } = EggsContract;

  const buy = (sonicAmount: string, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    
    if (token === 'eggs') {
      // EGGS contract: buy(address receiver) payable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "buy",
        args: [userAddress],
        value: parseEther(sonicAmount),
      });
    } else {
      // YOLK/NEST contracts: buy(address receiver, uint256 amount) nonpayable
      // First need to approve the backing token
      const backingTokenBalance = userData[token].backingBalance;
      const amountToBuy = parseEther(sonicAmount);
      
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "buy",
        args: [userAddress, amountToBuy],
      });
    }
  };
  
  const sell = (eggAmount: string, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    const tokenBalance = userData[token].balance;
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "sell",
      args: [tokenBalance && tokenBalance < parseEther(eggAmount) ? tokenBalance : parseEther(eggAmount)],
    });
  };

  const claim = (token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "getReward",
      args: [userAddress, ["0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38"]],
    });
  };
  
  const borrow = (sonicAmount: bigint, days: number, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    
    if (token === 'eggs') {
      // EGGS contract: borrow(uint256 sonic, uint256 numberOfDays) nonpayable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "borrow",
        args: [sonicAmount, days],
      });
    } else {
      // YOLK/NEST contracts: borrow(uint256 sonic, uint256 numberOfDays) nonpayable
      // Same signature, but different backing token handling
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "borrow",
        args: [sonicAmount, days],
      });
    }
  };
  
  const borrowMore = (sonicAmount: bigint, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    
    if (token === 'eggs') {
      // EGGS contract: borrowMore(uint256 sonic) nonpayable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "borrowMore",
        args: [sonicAmount],
      });
    } else {
      // YOLK/NEST contracts: borrowMore(uint256 sonic) nonpayable
      // Same signature for all tokens
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "borrowMore",
        args: [sonicAmount],
      });
    }
  };
  const publicClient = usePublicClient();

  const estimatedGas = 0; /* useEstimateGas({
    abi,
    address: address,
    functionName: "leverage",
    args: [parseEther("1"), 1],
    value: "0.01",
  });*/

  const leverage = (sonic, days, _fee, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    
    if (token === 'eggs') {
      // EGGS contract: leverage(uint256 sonic, uint256 numberOfDays) payable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "leverage",
        args: [sonic, days],
        value: _fee,
      });
    } else {
      // YOLK/NEST contracts: leverage(uint256 sonic, uint256 numberOfDays) nonpayable
      // No value parameter needed for YOLK/NEST
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "leverage",
        args: [sonic, days],
      });
    }
  };
  
  const closePosition = (token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    
    if (token === 'eggs') {
      // EGGS contract: closePosition() payable
      const loan = userData[token].loan;
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "closePosition",
        args: [],
        value: loan ? loan.borrowed : 0,
      });
    } else {
      // YOLK/NEST contracts: closePosition() nonpayable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "closePosition",
        args: [],
      });
    }
  };
  
  const repay = (sonic: BigInt, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    
    if (token === 'eggs') {
      // EGGS contract: repay() payable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "repay",
        args: [],
        value: sonic,
      });
    } else {
      // YOLK/NEST contracts: repay(uint256 amount) nonpayable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "repay",
        args: [sonic],
      });
    }
  };

  const flashClosePosition = (token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "flashClosePosition",
      args: [],
    });
  };
  
  const removeCollateral = (amount: string, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    const collateral = parseEther(amount.toString());
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "removeCollateral",
      args: [collateral],
    });
  };
  
  const extendLoan = (days: number, fee: string, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    
    if (token === 'eggs') {
      // EGGS contract: extendLoan(uint256 numberOfDays) payable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "extendLoan",
        args: [days],
        value: parseEther(fee),
      });
    } else {
      // YOLK/NEST contracts: extendLoan(uint256 numberOfDays) nonpayable
      writeContract({
        abi: contract.abi,
        address: contract.address as Address,
        functionName: "extendLoan",
        args: [days],
      });
    }
  };
  const isMintedOut =
    totalMinted && maxSupply
      ? Number(formatEther(maxSupply - totalMinted))
      : undefined;
  // Set up websocket listener for price events

  const refetchAll = () => {
    // Protocol data
    refetchTotalSupply();
    refetchTotalMinted();
    refetchMaxSupply();
    refetchTotalBorrowed();
    refetchTotalCollateral();
    refetchBacking();
    refetchLastPrice();

    // EGGS data
    refetchUserLoan();
    refetchUserEggsBalance();
    refetchEthBalance();

    // YOLK data (only if contract is available)
    if (TokenContracts.yolk.address !== "0x0000000000000000000000000000000000000000") {
      refetchYolkUserLoan();
      refetchYolkUserBalance();
      refetchUsdcBalance();
    }

    // NEST data (only if contract is available)
    if (TokenContracts.nest.address !== "0x0000000000000000000000000000000000000000") {
      refetchNestUserLoan();
      refetchNestUserBalance();
      // NEST uses EGGS as backing, so refetchUserEggsBalance is already called above
    }
  };
  // console.log(isSuccess);
  useEffect(() => {
    if (isSuccess) {
      // console.log(1);
      refetchAll();
    }
  }, [isSuccess]);
  return (
    <EggsContext.Provider
      value={{
        // Protocol data
        isMintedOut,
        totalSupply,
        isStarted,
        maxSupply,
        totalBorrowed,
        totalCollateral,
        backing,
        lastPrice,
        loanByDay5,
        loanByDay4,
        loanByDay3,
        loanByDay2,
        loanByDay1,
        chartData,
        isChartDataLoading,
        chartDataError,
        refreshChartData,
        connectionStatus,
        lastMessage,
        candleSize,
        setCandleSize,
        formattedChartData,
        buy,
        sell,
        borrow,
        leverage,
        estimatedGas,
        extendLoan,
        borrowMore,
        closePosition,
        repay,
        flashClosePosition,
        removeCollateral,
        isSuccess,
        isConfirming,
        isPending,
        isUserError,
        isError,
        nextReward,
        totalMinted,

        // Multi-token user data
        userData,
        
        // Legacy compatibility
        userLoan: userLoan as { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined,
        userEggsBalance: userEggsBalance && userEggsBalance > BigInt(1000) ? userEggsBalance : undefined,
        userSonicBalance: ethBalance,

        // Actions
        refetch: (token?: TokenType) => refetchAll(), // Token parameter for future use
      }}
    >
      {children}
    </EggsContext.Provider>
  );
};