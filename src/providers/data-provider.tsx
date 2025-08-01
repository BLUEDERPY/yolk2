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
import { EggsContract, Gauge } from "./contracts";
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

  // User data
  userLoan:
    | {
        collateral: bigint;
        borrowed: bigint;
        endDate: bigint;
      }
    | undefined;
  userEggsBalance: bigint | undefined;
  userSonicBalance: bigint | undefined;
  totalMinted: bigint | undefined;

  // Actions
  refetch: () => void;
  buy: (sonicAmount: string) => void;
  sell: (eggsAmount: string) => void;
  extendLoan: (eggsAmount: string, duration: number) => void;
  removeCollateral: (eggsAmount: string) => void;
  borrow: (eggsAmount: bigint, duration: number) => void;
  borrowMore: (eggsAmount: bigint) => void;
  leverage: () => void;
  estimatedGas: bigint | undefined;
  closePosition: () => void;
  repay: (sonic: bigint) => void;
  flashClosePosition: () => void;
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

  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address: userAddress,
    enabled: isConnected,
  });

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

  const buy = (sonicAmount: string) => {
    writeContract({
      abi,
      address: address as Address,
      functionName: "buy",
      args: [userAddress],
      value: parseEther(sonicAmount),
    });
  };
  const sell = (eggAmount: string) => {
    writeContract({
      abi,
      address: address as Address,
      functionName: "sell",
      args: [userEggsBalance < eggAmount ? userEggsBalance : eggAmount],
    });
  };

  const claim = () => {
    writeContract({
      abi,
      address: address as Address,
      functionName: "getReward",
      args: [userAddress, ["0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38"]],
    });
  };
  const borrow = (sonicAmount: bigint, days: number) => {
    writeContract({
      abi,
      address: address as Address,
      functionName: "borrow",
      args: [sonicAmount, days],
    });
  };
  const borrowMore = (sonicAmount: bigint) => {
    writeContract({
      abi,
      address: address as Address,
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

  const leverage = (sonic, days, _fee) => {
    //// // console.log(formatEther(sonic || "0"));
    //// // console.log(formatEther(_fee || "0"));
    console.log(days);
    writeContract({
      abi,
      address: address as Address,
      functionName: "leverage",
      args: [sonic, days],
      value: _fee,
    });
  };
  const closePosition = () => {
    writeContract({
      abi,
      address: address as Address,
      functionName: "closePosition",
      args: [],
      value: userLoan[1],
    });
  };
  const repay = (sonic: BigInt) => {
    writeContract({
      abi,
      address: address as Address,
      functionName: "repay",
      args: [],
      value: sonic,
    });
  };

  const flashClosePosition = () => {
    writeContract({
      abi,
      address: address as Address,
      functionName: "flashClosePosition",
      args: [],
    });
  };
  const removeCollateral = (amount: string) => {
    const collateral = parseEther(amount.toString());
    writeContract({
      abi,
      address: address as Address,
      functionName: "removeCollateral",
      args: [collateral],
    });
  };
  const extendLoan = (days: number, fee: string) => {
    writeContract({
      abi,
      address: address as Address,
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

    refetchUserLoan();
    refetchUserEggsBalance();
    refetchEthBalance();
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

        // User data
        userLoan: userLoan as
          | { collateral: bigint; borrowed: bigint; endDate: bigint }
          | undefined,
        userEggsBalance:
          userEggsBalance && userEggsBalance > BigInt(1000)
            ? userEggsBalance
            : undefined,
        userSonicBalance: ethBalance,

        // Actions
        refetch: refetchAll,
      }}
    >
      {children}
    </EggsContext.Provider>
  );
};
