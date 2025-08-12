import { formatEther, parseEther } from "viem";
import { useEffect } from "react";
import { useEggsData } from "../providers/data-provider";
import { TokenType } from "../providers/contracts";

export default function useConverter(amount: bigint, tokenType: TokenType = 'eggs') {
  const { lastMessage, userData, lastPrice } = useEggsData();

  // Get price from the specific token's contract data
  const contractPrice = userData[tokenType].price;
  
  // Use contract price for conversion calculations
  let conversionPrice: string | undefined;
  
  if (contractPrice) {
    // Use contract price (1 token = X backing token)
    conversionPrice = formatEther(contractPrice);
  } else if (tokenType === 'eggs' && lastPrice) {
    // Fallback to lastPrice for EGGS
    conversionPrice = formatEther(lastPrice);
  } else if (tokenType === 'eggs' && lastMessage &&
             lastMessage !== "ping" &&
             lastMessage?.data &&
             lastMessage?.data !== "ping" &&
             Array.isArray(lastMessage?.data) &&
             lastMessage?.data.length === 1) {
    // Fallback to WebSocket data for EGGS only
    conversionPrice = lastMessage?.data[lastMessage?.data.length - 1]?.high;
  }

  useEffect(() => {
    if (contractPrice) {
      localStorage.setItem(`${tokenType}LastConvertPrice`, formatEther(contractPrice));
    } else if (conversionPrice && tokenType === 'eggs') {
      localStorage.setItem("eggsLastCovertPrice", conversionPrice);
    }
  }, [contractPrice, conversionPrice, lastMessage?.data, tokenType]);

  // Get the final price for calculations
  const _lastPrice = conversionPrice || 
    localStorage.getItem(`${tokenType}LastConvertPrice`) || 
    (tokenType === 'eggs' ? localStorage.getItem("eggsLastCovertPrice") : null) ||
    "1"; // Default to 1:1 ratio if no price available

  // For EGGS: 1 EGGS = X SONIC (price is in SONIC)
  // For YOLK: 1 YOLK = X USDC (price is in USDC) 
  // For NEST: 1 NEST = X EGGS (price is in EGGS)
  
  // Convert token amount to backing token amount
  const backingTokenAmount =
    _lastPrice && amount
      ? (amount * parseEther(_lastPrice || "1")) / parseEther("1")
      : undefined;
       
  // Convert backing token amount to token amount
  const tokenAmount =
    _lastPrice && amount
      ? (amount * parseEther("1")) /
        parseEther(Number(_lastPrice) > 0 ? _lastPrice : "1")
      : undefined;

  // Return appropriate conversions based on token type
  switch (tokenType) {
    case 'eggs':
      return {
        sonic: backingTokenAmount, // EGGS -> SONIC
        eggs: tokenAmount,         // SONIC -> EGGS
        isSuccess: conversionPrice && Number(_lastPrice) > 0,
      };
    case 'yolk':
      return {
        usdc: backingTokenAmount,  // YOLK -> USDC
        yolk: tokenAmount,         // USDC -> YOLK
        sonic: backingTokenAmount, // For compatibility (YOLK -> USDC, treated as SONIC)
        eggs: tokenAmount,         // For compatibility (USDC -> YOLK, treated as EGGS)
        isSuccess: conversionPrice && Number(_lastPrice) > 0,
      };
    case 'nest':
      return {
        eggs: backingTokenAmount,  // NEST -> EGGS
        nest: tokenAmount,         // EGGS -> NEST
        sonic: backingTokenAmount, // For compatibility (NEST -> EGGS, treated as SONIC)
        isSuccess: conversionPrice && Number(_lastPrice) > 0,
      };
    default:
      return {
        sonic: backingTokenAmount,
        eggs: tokenAmount,
        isSuccess: conversionPrice && Number(_lastPrice) > 0,
      };
  }
}