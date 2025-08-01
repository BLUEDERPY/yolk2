import { parseEther, parseUnits } from "viem";

export const FEE_BASE_1000 = 1000;
export const BUY_FEE_REVERSE = 10;
/**
 * Calculates the interest fee in EGGS for a given amount and duration
 * @param amount Amount in EGGS
 * @param numberOfDays Loan duration in days
 * @returns Interest fee in EGGS
 */
export function getInterestFeeInEggs(
  amount: bigint,
  numberOfDays: number
): bigint {
  const interest =
    (BigInt(0.039e18) * BigInt(numberOfDays)) / BigInt(365) + BigInt(0.001e18);
  return (BigInt(amount) * interest) / BigInt(1e18);
}

/**
 * Calculates the maximum EGGS amount that can be borrowed for a given fee
 * @param targetFee Target fee amount in EGGS
 * @param numberOfDays Loan duration in days
 * @param estimatedGas Estimated gas fee for the transaction
 * @returns Maximum EGGS amount that can be borrowed
 */
export function getMaxEggsFromFee(
  leverageFee: bigint,
  numberOfDays: number,
  estimatedGas: bigint
): bigint {
  // Rearranging the formula from getInterestFeeInEggs:
  // fee = (amount * interest) / 100 / FEE_BASE_1000
  // amount = (fee * 100 * FEE_BASE_1000) / interest
  // Solving for eggs where:
  // leverageFee = mintFee + interest
  // leverageFee = (eggs * BUY_FEE_REVERSE / FEE_BASE_1000) + (eggs * interest / 100 / FEE_BASE_1000)

  const interest =
    (BigInt(0.039e18) * BigInt(numberOfDays)) / BigInt(365) + BigInt(0.001e18);
  // Combine terms:
  // leverageFee = eggs * (BUY_FEE_REVERSE + interest) / (100 * FEE_BASE_1000)
  // eggs = leverageFee * (100 * FEE_BASE_1000) / (BUY_FEE_REVERSE + interest)

  const denominator =
    (BigInt(2 * BUY_FEE_REVERSE) * BigInt(1e18)) / BigInt(FEE_BASE_1000) +
    interest;
  return (
    ((leverageFee - estimatedGas) * BigInt(1e18)) /
    denominator
  );
}

/**
 * Calculates the leverage amount in EGGS
 * @param eggs Amount of EGGS
 * @param numberOfDays Loan duration in days
 * @returns Leverage amount in EGGS
 */
export function getleverageFee(eggs: bigint, numberOfDays: number) {
  const mintFee = BigInt(eggs) / BigInt(100);
  const interest = getInterestFeeInEggs(eggs, numberOfDays);
  const levFee = mintFee + interest;

  const userSonic = BigInt(eggs) - levFee;
  const userBorrow = (userSonic * BigInt(99)) / BigInt(100);
  const overCollateralizationAmount = userSonic - userBorrow;
  return {
    fee: levFee,
    feeWithOverCol: overCollateralizationAmount + levFee,
  };
}
