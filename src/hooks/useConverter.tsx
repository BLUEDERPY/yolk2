import { formatEther, parseEther } from "viem";
import { useEffect } from "react";
import { useEggsData } from "../providers/data-provider";
import { TokenType } from "../providers/contracts";

export default function useConverter(eggAmount: bigint, tokenType: TokenType = 'eggs') {
  const { lastMessage, userData } = useEggsData();

  // Get price from the specific token's contract data
  const contractPrice = userData[tokenType].price;
  
  // Use contract price first, then fallback to WebSocket data for EGGS only
  const price = contractPrice 
    ? formatEther(contractPrice)
    : (tokenType === 'eggs' && lastMessage &&
       lastMessage !== "ping" &&
       lastMessage?.data &&
       lastMessage?.data !== "ping" &&
       Array.isArray(lastMessage?.data) &&
       lastMessage?.data.length === 1
         ? lastMessage?.data[lastMessage?.data.length - 1]?.high
         : undefined);

  useEffect(() => {
    if (contractPrice) {
      localStorage.setItem(`${tokenType}LastConvertPrice`, formatEther(contractPrice));
    } else if (price) {
      console.log("Price update:", lastMessage?.data);
      localStorage.setItem("eggsLastCovertPrice", price);
    }
  }, [contractPrice, price, lastMessage?.data, tokenType]);

  const _lastPrice = contractPrice 
    ? formatEther(contractPrice)
    : localStorage.getItem(`${tokenType}LastConvertPrice`) || 
      localStorage.getItem("eggsLastCovertPrice") || 
      ".00114025";

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
    isSuccess: price && Number(_lastPrice) > 0,
  };
}
