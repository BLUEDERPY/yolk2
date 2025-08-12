import { formatEther, parseEther } from "viem";
import { useEffect } from "react";
import { useEggsData } from "../providers/data-provider";

export default function useConverter(eggAmount: bigint) {
  const { lastMessage } = useEggsData();

  const price =
    lastMessage &&
    lastMessage !== "ping" &&
    lastMessage?.data &&
    lastMessage?.data !== "ping" &&
    Array.isArray(lastMessage?.data) &&
    lastMessage?.data.length === 1
      ? lastMessage?.data[lastMessage?.data.length - 1]?.high
      : undefined;

  useEffect(() => {
    if (price) {
      console.log("Price update:", lastMessage?.data);
      localStorage.setItem("eggsLastCovertPrice", price);
    }
  }, [price, lastMessage?.data]);

  const _lastPrice = localStorage.getItem("eggsLastCovertPrice") || ".00114025";

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
