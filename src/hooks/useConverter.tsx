import { formatEther, parseEther } from "viem";
import { useEffect, useState } from "react";
import { useWatchContractEvent } from "wagmi";
import { TokenContracts, TokenType } from "../providers/contracts";

interface PriceEvent {
  time: bigint;
  price: bigint;
  volumeInSonic: bigint;
}

export default function useConverter(amount: bigint, tokenType: TokenType = 'eggs') {
  const [contractPrices, setContractPrices] = useState<{
    eggs?: string;
    yolk?: string;
    nest?: string;
  }>({});

  // Get the contract config for the specified token
  const tokenContract = TokenContracts[tokenType];

  // Listen for Price events from EGGS contract
  useWatchContractEvent({
    address: TokenContracts.eggs.address,
    abi: TokenContracts.eggs.abi,
    eventName: 'Price',
    onLogs(logs) {
      const latestLog = logs[logs.length - 1];
      if (latestLog && latestLog.args) {
        const { price } = latestLog.args as PriceEvent;
        if (price) {
          const priceStr = formatEther(price);
          setContractPrices(prev => ({ ...prev, eggs: priceStr }));
          localStorage.setItem('eggsLastConvertPrice', priceStr);
        }
      }
    },
  });

  // Listen for Price events from YOLK contract (if available)
  useWatchContractEvent({
    address: TokenContracts.yolk.address,
    abi: TokenContracts.yolk.abi,
    eventName: 'Price',
    enabled: TokenContracts.yolk.address !== "0x0000000000000000000000000000000000000000",
    onLogs(logs) {
      const latestLog = logs[logs.length - 1];
      if (latestLog && latestLog.args) {
        const { price } = latestLog.args as PriceEvent;
        if (price) {
          const priceStr = formatEther(price);
          setContractPrices(prev => ({ ...prev, yolk: priceStr }));
          localStorage.setItem('yolkLastConvertPrice', priceStr);
        }
      }
    },
  });

  // Listen for Price events from NEST contract (if available)
  useWatchContractEvent({
    address: TokenContracts.nest.address,
    abi: TokenContracts.nest.abi,
    eventName: 'Price',
    enabled: TokenContracts.nest.address !== "0x0000000000000000000000000000000000000000",
    onLogs(logs) {
      const latestLog = logs[logs.length - 1];
      if (latestLog && latestLog.args) {
        const { price } = latestLog.args as PriceEvent;
        if (price) {
          const priceStr = formatEther(price);
          setContractPrices(prev => ({ ...prev, nest: priceStr }));
          localStorage.setItem('nestLastConvertPrice', priceStr);
        }
      }
    },
  });

  // Load cached prices on mount
  useEffect(() => {
    const loadCachedPrices = () => {
      const eggsPrice = localStorage.getItem("eggsLastConvertPrice");
      const yolkPrice = localStorage.getItem("yolkLastConvertPrice");
      const nestPrice = localStorage.getItem("nestLastConvertPrice");
      
      setContractPrices({
        eggs: eggsPrice || undefined,
        yolk: yolkPrice || undefined,
        nest: nestPrice || undefined,
      });
    };

    loadCachedPrices();
  }, []);

  // Get the price for the current token type
  const currentPrice = contractPrices[tokenType] || 
    localStorage.getItem(`${tokenType}LastConvertPrice`) || 
    "1"; // Default to 1:1 ratio if no price available

  // Convert token amount to backing token amount
  const backingTokenAmount =
    currentPrice && amount
      ? (amount * parseEther(currentPrice)) / parseEther("1")
      : undefined;
       
  // Convert backing token amount to token amount
  const tokenAmount =
    currentPrice && amount
      ? (amount * parseEther("1")) / parseEther(Number(currentPrice) > 0 ? currentPrice : "1")
      : undefined;

  // Return appropriate conversions based on token type
  switch (tokenType) {
    case 'eggs':
      return {
        sonic: backingTokenAmount, // EGGS -> SONIC
        eggs: tokenAmount,         // SONIC -> EGGS
        isSuccess: !!contractPrices.eggs && Number(currentPrice) > 0,
      };
    case 'yolk':
      return {
        usdc: backingTokenAmount,  // YOLK -> USDC
        yolk: tokenAmount,         // USDC -> YOLK
        sonic: backingTokenAmount, // For compatibility (YOLK -> USDC, treated as SONIC)
        eggs: tokenAmount,         // For compatibility (USDC -> YOLK, treated as EGGS)
        isSuccess: !!contractPrices.yolk && Number(currentPrice) > 0,
      };
    case 'nest':
      return {
        eggs: backingTokenAmount,  // NEST -> EGGS
        nest: tokenAmount,         // EGGS -> NEST
        sonic: backingTokenAmount, // For compatibility (NEST -> EGGS, treated as SONIC)
        isSuccess: !!contractPrices.nest && Number(currentPrice) > 0,
      };
    default:
      return {
        sonic: backingTokenAmount,
        eggs: tokenAmount,
        isSuccess: !!contractPrices.eggs && Number(currentPrice) > 0,
      };
  }
}