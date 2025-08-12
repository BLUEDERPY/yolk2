import { formatEther, parseEther } from "viem";
import { TokenType } from "../providers/contracts";
import { useEggsData } from "../providers/data-provider";

export default function useConverter(amount: bigint, tokenType: TokenType = 'eggs') {
  const { contractPrices } = useEggsData();

  // Get the price for the current token type (in wei)
  const currentPriceBigInt = contractPrices[tokenType];
  
  // Convert to string for calculations, fallback to cached or default
  const currentPrice = currentPriceBigInt 
    ? formatEther(currentPriceBigInt)
    : localStorage.getItem(`${tokenType}LastConvertPrice`) || "1";

  // Convert token amount to backing token amount
  const backingTokenAmount =
    currentPrice && amount && Number(currentPrice) > 0
      ? (amount * parseEther(currentPrice)) / parseEther("1")
      : undefined;
       
  // Convert backing token amount to token amount
  const tokenAmount =
    currentPrice && amount && Number(currentPrice) > 0
      ? (amount * parseEther("1")) / parseEther(currentPrice)
      : undefined;

  // Return appropriate conversions based on token type
  switch (tokenType) {
    case 'eggs':
      return {
        sonic: backingTokenAmount, // EGGS -> SONIC
        eggs: tokenAmount,         // SONIC -> EGGS
        isSuccess: !!currentPriceBigInt && Number(currentPrice) > 0,
      };
    case 'yolk':
      return {
        usdc: backingTokenAmount,  // YOLK -> USDC
        yolk: tokenAmount,         // USDC -> YOLK
        sonic: backingTokenAmount, // For compatibility (YOLK -> USDC, treated as SONIC)
        eggs: tokenAmount,         // For compatibility (USDC -> YOLK, treated as EGGS)
        isSuccess: !!currentPriceBigInt && Number(currentPrice) > 0,
      };
    case 'nest':
      return {
        eggs: backingTokenAmount,  // NEST -> EGGS
        nest: tokenAmount,         // EGGS -> NEST
        sonic: backingTokenAmount, // For compatibility (NEST -> EGGS, treated as SONIC)
        isSuccess: !!currentPriceBigInt && Number(currentPrice) > 0,
      };
    default:
      return {
        sonic: backingTokenAmount,
        eggs: tokenAmount,
        isSuccess: !!currentPriceBigInt && Number(currentPrice) > 0,
      };
  }
}