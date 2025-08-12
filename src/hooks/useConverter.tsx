import { formatEther, parseEther } from "viem";
import { useEffect } from "react";
import { useEggsData } from "../providers/data-provider";
import { TokenType } from "../providers/contracts";

export default function useConverter(eggAmount: bigint, tokenType: TokenType = 'eggs') {
  const { lastMessage, userData, lastPrice } = useEggsData();

  // Get price from the specific token's contract data
  const contractPrice = userData[tokenType].price;
  
  // Use contract price for conversion calculations
  let conversionPrice: string | undefined;
  
  if (contractPrice) {
    // Use contract price (1 token = X SONIC)
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
      console.log("Price update:", lastMessage?.data);
      localStorage.setItem("eggsLastCovertPrice", conversionPrice);
    }
  }, [contractPrice, conversionPrice, lastMessage?.data, tokenType]);

  // Get the final price for calculations
  const _lastPrice = conversionPrice || 
    localStorage.getItem(`${tokenType}LastConvertPrice`) || 
    (tokenType === 'eggs' ? localStorage.getItem("eggsLastCovertPrice") : null) ||
    "1"; // Default to 1:1 ratio if no price available

  // Calculate conversions based on the token's price
  const sonic =
    _lastPrice && eggAmount
      ? (eggAmount * parseEther(_lastPrice || "1")) / parseEther("1")
      : undefined;
       
  const eggs =
    _lastPrice && eggAmount
      ? (eggAmount * parseEther("1")) /
        parseEther(Number(_lastPrice) > 0 ? _lastPrice : "1")
      : undefined;

  return {
    sonic,
    eggs,
    isSuccess: conversionPrice && Number(_lastPrice) > 0,
  };
}
