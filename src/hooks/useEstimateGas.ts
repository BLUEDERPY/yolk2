import { Address, parseEther } from "viem";
import { useState, useCallback, useEffect } from "react";
import { usePublicClient } from "wagmi";

interface EstimateGasParams {
  abi: any[]; // Replace 'any[]' with your actual ABI type
  address: string;
  functionName: string;
  args: any[];
  value?: string;
}

export const useEstimateGas = ({
  abi,
  address,
  functionName,
  args,
  value = "0.01",
}: EstimateGasParams) => {
  const [estimatedGas, setEstimatedGas] = useState<bigint | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient || !address) return;

    setIsEstimating(true);
    setError(null);

    try {
      publicClient
        .estimateContractGas({
          abi,
          address: address as Address,
          functionName,
          args,
          value: parseEther(value),
        })
        .then((gas) => {
          setEstimatedGas(gas);
          setIsEstimating(false);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err : new Error("Failed to estimate gas")
          );
          setEstimatedGas(null);
          setIsEstimating(false);
        });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to estimate gas")
      );
      setEstimatedGas(null);
      setIsEstimating(false);
    }
  }, [publicClient, abi, address, functionName, args, value]);

  return { estimatedGas, isEstimating, error };
};
