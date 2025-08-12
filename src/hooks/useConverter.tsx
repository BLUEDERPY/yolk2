import { useVisibilityChange } from "@uidotdev/usehooks";
import useWebSocket from "react-use-websocket";
import { formatEther, parseEther } from "viem";
import { useEffect } from "react";

const WS_URL = "wss://eggs-64815067aa3c.herokuapp.com/"; //"ws://localhost:8000"; //"wss://eggs-64815067aa3c.herokuapp.com/"; //

export default function useConverter(eggAmount: bigint) {
  const documentVisible = useVisibilityChange();

  const wS_URL = !documentVisible || documentVisible ? WS_URL : "wss://";
  // ////// console.log((!documentVisible && ready === 1) || documentVisible);

  const { lastJsonMessage } = useWebSocket(wS_URL, {
    share: true,

    shouldReconnect: () => {
      return documentVisible;
    },

    heartbeat: true,
  });

  const price =
    lastJsonMessage &&
    lastJsonMessage !== "ping" &&
    lastJsonMessage.data &&
    lastJsonMessage.data !== "ping" &&
    lastJsonMessage.data.length == 1
      ? lastJsonMessage.data[lastJsonMessage.data.length - 1]?.high
      : undefined;

  useEffect(() => {
    if (price) {
      console.log("HEYYYY", lastJsonMessage.data);
      localStorage.setItem("eggsLastCovertPrice", price);
    }
  }, [price, lastJsonMessage.data]);

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
