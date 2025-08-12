import { useState, useMemo, useContext, useEffect, useCallback } from "react";
import useEggsToSonic from "../../hooks/useEggsToSonic";
import useBorrow from "../../hooks/useBorrow";
import { GlobalContext } from "../../../providers/global-provider";

import { formatEther, parseEther } from "viem";
import { nFormatter } from "../../../utils/formatters";
import { getInterestFeeInEggs } from "../../../utils/leverageCalculations";
import { useEggsData } from "../../../providers/data-provider";
import useConverter from "../../../hooks/useConverter";

export const useLendingState = (
  tokenType: "eggs" | "yolk" | "nest" = "eggs"
) => {
  const { status, setStatus } = useContext(GlobalContext);

  const {
    userData,
    borrow,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    isUserError,
    borrowMore,
  } = useEggsData();

  // Use specified token data
  const loan = userData[tokenType].loan;
  const balance = userData[tokenType].balance;

  const borrowed = loan ? loan.borrowed : BigInt(0);
  const collateral = loan ? loan.collateral : BigInt(0);
  const minDuration = useMemo(() => {
    if (borrowed)
      return dateDiff(new Date(Number(loan.endDate) * 1000), new Date());
  }, [borrowed, loan]);
  const { eggs: borrowedInEggs } = useConverter(borrowed);
  const { sonic: collateralInSonic } = useConverter(collateral);

  const [duration, _setDuration] = useState(minDuration || 0);

  const { sonic: maxEggs } = useConverter(balance);

  const max = useMemo(() => {
    const _collateralInSonic = collateralInSonic
      ? collateralInSonic
      : BigInt(0);
    const _maxEggs = maxEggs || BigInt(0);
    const extraEggs =
      (_collateralInSonic * BigInt(99)) / BigInt(100) - (borrowed || BigInt(0));
    return _maxEggs + extraEggs;
  }, [maxEggs, duration, collateralInSonic, borrowed]);
  // console.log(max);

  useEffect(() => {
    if (isSuccess) {
    }
    setStatus(
      isError
        ? "ERROR"
        : isUserError
        ? "ERROR"
        : isSuccess
        ? "SUCCESS"
        : isConfirming
        ? "CONFIRMING"
        : isPending
        ? "PENDING"
        : "NONE",
      isError
        ? `There was an error with your transaction on the blockchain`
        : isUserError
        ? "There was an error with your transaction. "
        : isSuccess
        ? `Success`
        : isConfirming
        ? `Blockchain transaction is confirming`
        : isPending
        ? `Your transaction is pending`
        : ""
    );
  }, [isError, isUserError, isSuccess, isConfirming, isPending]);

  function dateDiff(date1, date2) {
    const msDiff = date1.getTime() - date2.getTime();
    const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    return days;
  }

  const [borrowAmount, _setBorrowAmount] = useState(undefined);
  const setBorrowAmount = (value: bigint) => {
    // console.log(max, _val);
    if (max && max > value) _setBorrowAmount(value);
    else _setBorrowAmount(max);
  };

  const { eggs: conversionRate } = useConverter(
    borrowAmount && max ? (borrowAmount > max ? max : borrowAmount) : BigInt(0), 
    tokenType
  );

  const fee = getInterestFeeInEggs(
    borrowAmount && max ? (borrowAmount > max ? max : borrowAmount) : BigInt(0),
    duration
  );
  const additonalFee = getInterestFeeInEggs(
    borrowed || parseEther("0"),
    borrowed
      ? dateDiff(new Date(Number(loan.endDate) * 1000), new Date()) -
          duration -
          1
      : 0
  );
  const isTransactionOccuring = useMemo(() => {
    return isConfirming || isPending; // 120% collateral ratio required
  }, [isConfirming, isPending]);

  const collateralRequired = useMemo(() => {
    const _borrowedInEggs = borrowedInEggs ? borrowedInEggs : BigInt(0);
    if (conversionRate) {
      const extraEggs =
        (collateral * BigInt(99)) / BigInt(100) - _borrowedInEggs;
      const rate = Number(formatEther(conversionRate - extraEggs));
      const c = extraEggs >= conversionRate ? 0 : rate;
      return nFormatter(c, 2); // 120% collateral ratio required
    }
  }, [conversionRate, collateral, borrowedInEggs]);
  1;
  const fees = useMemo(() => {
    if (!borrowAmount || !conversionRate || !fee)
      return {
        borrowingFee: 0,
        protocolFee: 0,
        total: 0,
      };

    const borrowingFee = fee; // 10% APR
    const protocolFee = conversionRate / BigInt(100); // 0.1% protocol fee
    const sonicFee = borrowAmount / BigInt(100); // 0.1% protocol fee
    return {
      borrowingFee: Number(formatEther(borrowingFee + sonicFee)),
      protocolFee: Number(formatEther(protocolFee)),
      total: Number(formatEther(borrowAmount - sonicFee - borrowingFee)),
      borrowingFeeRaw: borrowingFee + sonicFee,
      protocolFeeRaw: protocolFee,
      totalRaw: borrowAmount - sonicFee - borrowingFee,
      conversionRate: conversionRate,
    };
  }, [borrowAmount, fee, conversionRate, additonalFee, borrowed]);
  const { sonic: totalConverted } = useConverter(fees.totalRaw);
  const maxBorrowAmount = useMemo(() => {
    if (borrowed && borrowed < max) return Number(max - borrowed).toString();
    else if (borrowed && borrowed > max) return "0";
    return Number(max).toString();
  }, [max, borrowed]);

  const isValid = useMemo(() => {
    return Number(borrowAmount) > 0 && duration >= 0 && duration <= 365;
  }, [borrowAmount, max, duration]);

  const errorMessage = useMemo(() => {
    if (Number(borrowAmount) <= 0 && borrowAmount)
      return "Enter a borrow amount";

    if (duration < 0 || duration > 365) {
      return "Duration must be between 0 and 365 days";
    }
    return "";
  }, [borrowAmount, maxBorrowAmount, duration]);

  const handleMaxBorrow = async () => {
    //// // console.log(max);
    //// // console.log(additonalFee);
    if (max) _setBorrowAmount(max);
    else if (additonalFee && additonalFee > max) setBorrowAmount("0");
    else _setBorrowAmount(max);
  };

  const setDuration = (_durattion) => {
    _setDuration(_durattion);
  };

  const handleBorrow = async () => {
    // console.log(formatEther(totalConverted), duration);
    if (borrowed && borrowed > BigInt(0)) borrowMore(borrowAmount, tokenType);
    else borrow(borrowAmount, duration, tokenType);
  };
  const onRepay = async () => {
    borrow(borrowAmount, duration);
  };
  const onExtend = async () => {
    borrow(borrowAmount, duration);
  };
  const onClose = async () => {
    borrow(borrowAmount, duration);
  };
  return {
    minDuration,
    borrowAmount: borrowAmount > max ? max : borrowAmount,
    setBorrowAmount,
    duration,
    setDuration,
    collateralRequired,
    fees,
    isValid,
    errorMessage,
    handleMaxBorrow,
    handleBorrow,
    isTransactionOccuring,
    balance,
    onRepay,
    onExtend,
    onClose,
    max,
  };
};
