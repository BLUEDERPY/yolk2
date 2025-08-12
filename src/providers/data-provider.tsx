import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
        value: eggsUserBalance || BigInt(0),
        formatted: eggsUserBalance ? formatEther(eggsUserBalance) : "0"
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
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "buy",
      args: [userAddress],
      value: parseEther(sonicAmount),
    });
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
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "borrow",
      args: [sonicAmount, days],
    });
  };
  
  const borrowMore = (sonicAmount: bigint, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "borrowMore",
      args: [sonicAmount],
    });
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
    //// // console.log(formatEther(sonic || "0"));
    //// // console.log(formatEther(_fee || "0"));
    console.log(days);
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "leverage",
      args: [sonic, days],
      value: _fee,
    });
  };
  
  const closePosition = (token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    const loan = userData[token].loan;
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "closePosition",
      args: [],
      value: loan ? loan.borrowed : 0,
    });
  };
  
  const repay = (sonic: BigInt, token: TokenType = 'eggs') => {
    const contract = getTokenContract(token);
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "repay",
      args: [],
      value: sonic,
    });
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
    writeContract({
      abi: contract.abi,
      address: contract.address as Address,
      functionName: "extendLoan",
      args: [days],
      value: parseEther(fee),
    });
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