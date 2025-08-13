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
import { useWatchContractEvent } from "wagmi";

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

  // User data for multiple tokens
  userData: {
    eggs: {
      loan: { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined;
      balance: bigint | undefined;
      backingBalance: any | undefined;
      price: bigint | undefined;
    };
    yolk: {
      loan: { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined;
      balance: bigint | undefined;
      backingBalance: any | undefined;
      price: bigint | undefined;
    };
    nest: {
      loan: { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined;
      balance: bigint | undefined;
      backingBalance: any | undefined;
      price: bigint | undefined;
    };
  };
  
  // Contract prices for conversions
  contractPrices: {
    eggs?: bigint;
    yolk?: bigint;
    nest?: bigint;
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
  userData: {
    eggs: {
      loan: undefined,
      balance: undefined,
      backingBalance: undefined,
      price: undefined,
    },
    yolk: {
      loan: undefined,
      balance: undefined,
      backingBalance: undefined,
      price: undefined,
    },
    nest: {
      loan: undefined,
      balance: undefined,
      backingBalance: undefined,
      price: undefined,
    },
  },
  contractPrices: {},
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
  
  // Contract prices state
  const [contractPrices, setContractPrices] = useState<{
    eggs?: bigint;
    yolk?: bigint;
    nest?: bigint;
  }>({});
  
  // Memoize event handlers to prevent recreating functions
  const handleEggsPrice = useCallback((logs: any[]) => {
    const latestLog = logs[logs.length - 1];
    if (latestLog && latestLog.args) {
      const { price } = latestLog.args as { time: bigint; price: bigint; volumeInSonic: bigint };
      if (price) {
        setContractPrices(prev => ({ ...prev, eggs: price }));
        localStorage.setItem('eggsLastConvertPrice', formatEther(price));
      }
    }
  }, []);

  const handleYolkPrice = useCallback((logs: any[]) => {
    const latestLog = logs[logs.length - 1];
    if (latestLog && latestLog.args) {
      const { price } = latestLog.args as { time: bigint; price: bigint; volumeInSonic: bigint };
      if (price) {
        setContractPrices(prev => ({ ...prev, yolk: price }));
        localStorage.setItem('yolkLastConvertPrice', formatEther(price));
      }
    }
  }, []);

  const handleNestPrice = useCallback((logs: any[]) => {
    const latestLog = logs[logs.length - 1];
    if (latestLog && latestLog.args) {
      const { price } = latestLog.args as { time: bigint; price: bigint; volumeInSonic: bigint };
      if (price) {
        setContractPrices(prev => ({ ...prev, nest: price }));
        localStorage.setItem('nestLastConvertPrice', formatEther(price));
      }
    }
  }, []);

  // Price event listeners for real-time updates
  useWatchContractEvent({
    address: EggsContract.address as Address,
    abi: EggsContract.abi,
    eventName: 'Price',
    onLogs: handleEggsPrice,
  });

  useWatchContractEvent({
    address: TokenContracts.yolk.address as Address,
    abi: TokenContracts.yolk.abi,
    eventName: 'Price',
    enabled: TokenContracts.yolk.address !== "0x0000000000000000000000000000000000000000",
    onLogs: handleYolkPrice,
  });

  useWatchContractEvent({
    address: TokenContracts.nest.address as Address,
    abi: TokenContracts.nest.abi,
    eventName: 'Price',
    enabled: TokenContracts.nest.address !== "0x0000000000000000000000000000000000000000",
    onLogs: handleNestPrice,
  });

  // Load cached prices on mount
  useEffect(() => {
    const loadCachedPrices = async () => {
      const eggsPrice = localStorage.getItem("eggsLastConvertPrice");
      const yolkPrice = localStorage.getItem("yolkLastConvertPrice");
      const nestPrice = localStorage.getItem("nestLastConvertPrice");
      
      setContractPrices(prev => ({
        ...prev,
        eggs: eggsPrice ? parseEther(eggsPrice) : prev.eggs,
        yolk: yolkPrice ? parseEther(yolkPrice) : prev.yolk,
        nest: nestPrice ? parseEther(nestPrice) : prev.nest,
      }));
    };

    loadCachedPrices();
  }, []);

  // Helper function to get contract config for a token
  const getTokenContract = useCallback((token: TokenType = 'eggs') => TokenContracts[token], []);

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

  // YOLK price read
  const { data: yolkPrice, refetch: refetchYolkPrice } = useReadContract({
    abi: TokenContracts.yolk.abi,
    address: TokenContracts.yolk.address as Address,
    functionName: "lastPrice",
    enabled: TokenContracts.yolk.address !== "0x0000000000000000000000000000000000000000",
  });

  // NEST price read
  const { data: nestPrice, refetch: refetchNestPrice } = useReadContract({
    abi: TokenContracts.nest.abi,
    address: TokenContracts.nest.address as Address,
    functionName: "lastPrice",
    enabled: TokenContracts.nest.address !== "0x0000000000000000000000000000000000000000",
  });

  // Update contract prices when price data changes
  useEffect(() => {
    // Only update if we don't have real-time prices from events
    setContractPrices(prev => ({
      eggs: prev.eggs || lastPrice,
      yolk: prev.yolk || yolkPrice,
      nest: prev.nest || nestPrice,
    }));
  }, [lastPrice, yolkPrice, nestPrice]);

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
    token: "0x25e6af9b06BeB81709B361ACd1962AdE8bF0819A" as Address, // Placeholder USDC address
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
  const userData = useMemo(() => ({
    eggs: {
      loan: userLoan ? {
        collateral: userLoan[0] as bigint,
        borrowed: userLoan[1] as bigint,
        endDate: userLoan[2] as bigint
      } : undefined,
      balance: userEggsBalance && userEggsBalance > BigInt(1000) ? userEggsBalance : undefined,
      backingBalance: ethBalance,
      price: contractPrices.eggs || lastPrice,
    },
    yolk: {
      loan: yolkUserLoan ? {
        collateral: yolkUserLoan[0] as bigint,
        borrowed: yolkUserLoan[1] as bigint,
        endDate: yolkUserLoan[2] as bigint
      } : undefined,
      balance: yolkUserBalance && yolkUserBalance > BigInt(1000) ? yolkUserBalance : undefined,
      backingBalance: usdcBalance,
      price: contractPrices.yolk || yolkPrice,
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
      price: contractPrices.nest || nestPrice,
    },
  }), [
    userLoan, userEggsBalance, ethBalance, contractPrices.eggs, lastPrice,
    yolkUserLoan, yolkUserBalance, usdcBalance, contractPrices.yolk, yolkPrice,
    nestUserLoan, nestUserBalance, contractPrices.nest, nestPrice
  ]);

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

  const buy = useCallback((sonicAmount: string, token: TokenType = 'eggs') => {
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
  }, [getTokenContract, writeContract, userAddress, userData]);
  
  const sell = useCallback((eggAmount: string, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    const tokenBalance = userData[token].balance;
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "sell",
      args: [tokenBalance && tokenBalance < parseEther(eggAmount) ? tokenBalance : parseEther(eggAmount)],
    });
  }, [getTokenContract, userData, writeContract]);

  const claim = useCallback((token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "getReward",
      args: [userAddress, ["0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38"]],
    });
  }, [getTokenContract, writeContract, userAddress]);
  
  const borrow = useCallback((sonicAmount: bigint, days: number, token: TokenType = 'eggs') => {
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
  }, [getTokenContract, writeContract]);
  
  const borrowMore = useCallback((sonicAmount: bigint, token: TokenType = 'eggs') => {
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
  }, [getTokenContract, writeContract]);
  const publicClient = usePublicClient();

  const estimatedGas = 0; /* useEstimateGas({
    abi,
    address: address,
    functionName: "leverage",
    args: [parseEther("1"), 1],
    value: "0.01",
  });*/

  const leverage = useCallback((sonic, days, _fee, token: TokenType = 'eggs') => {
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
  }, [getTokenContract, writeContract]);
  
  const closePosition = useCallback((token: TokenType = 'eggs') => {
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
  }, [getTokenContract, userData, writeContract]);
  
  const repay = useCallback((sonic: BigInt, token: TokenType = 'eggs') => {
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
  }, [getTokenContract, writeContract]);

  const flashClosePosition = useCallback((token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "flashClosePosition",
      args: [],
    });
  }, [getTokenContract, writeContract]);
  
  const removeCollateral = useCallback((amount: string, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    const collateral = parseEther(amount.toString());
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "removeCollateral",
      args: [collateral],
    });
  }, [getTokenContract, writeContract]);
  
  const extendLoan = useCallback((days: number, fee: string, token: TokenType = 'eggs') => {
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
  }, [getTokenContract, writeContract]);
  
  const isMintedOut = useMemo(() =>
    totalMinted && maxSupply
      ? Number(formatEther(maxSupply - totalMinted))
      : undefined, [totalMinted, maxSupply]);
  // Set up websocket listener for price events

  const refetchAll = useCallback(() => {
    // Protocol data
    refetchTotalSupply();
    refetchTotalMinted();
    refetchMaxSupply();
    refetchTotalBorrowed();
    refetchTotalCollateral();
    refetchBacking();
    refetchLastPrice();
    refetchYolkPrice();
    refetchNestPrice();

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
  }, [
    refetchTotalSupply, refetchTotalMinted, refetchMaxSupply, refetchTotalBorrowed,
    refetchTotalCollateral, refetchBacking, refetchLastPrice, refetchYolkPrice,
    refetchNestPrice, refetchUserLoan, refetchUserEggsBalance, refetchEthBalance,
    refetchYolkUserLoan, refetchYolkUserBalance, refetchUsdcBalance,
    refetchNestUserLoan, refetchNestUserBalance
  ]);
  // console.log(isSuccess);
  useEffect(() => {
    if (isSuccess) {
      // console.log(1);
      refetchAll();
    }
  }, [isSuccess]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
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
    
    // Contract prices for conversions
    contractPrices,
    
    // Legacy compatibility
    userLoan: userLoan as { collateral: bigint; borrowed: bigint; endDate: bigint } | undefined,
    userEggsBalance: userEggsBalance && userEggsBalance > BigInt(1000) ? userEggsBalance : undefined,
    userSonicBalance: ethBalance,

    // Actions
    refetch: refetchAll,
  }), [
    isMintedOut, totalSupply, isStarted, maxSupply, totalBorrowed, totalCollateral,
    backing, lastPrice, loanByDay5, loanByDay4, loanByDay3, loanByDay2, loanByDay1,
    buy, sell, borrow, leverage, estimatedGas, extendLoan, borrowMore, closePosition,
    repay, flashClosePosition, removeCollateral, isSuccess, isConfirming, isPending,
    isUserError, isError, nextReward, totalMinted, userData, contractPrices,
    userLoan, userEggsBalance, ethBalance, refetchAll
  ]);

  return (
    <EggsContext.Provider value={contextValue}>
      {children}
    </EggsContext.Provider>
  );
};