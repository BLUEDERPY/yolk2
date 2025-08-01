import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export default function useWriteContractAndWaitForConfirm() {
  //// // console.log(gasMult);
  const {
    writeContract: _write,
    data: hash,
    isPending,
    isError: isUserError,
    error: error2,
    reset,
  } = useWriteContract();

  const writeContract = (params) => {
    _write({ ...params });
  };

  const {
    isSuccess,
    isLoading: isConfirming,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    hash,
  });

  //// // console.log(error2);
  return {
    writeContract,
    hash,
    isUserError,
    isSuccess,
    isPending,
    isConfirming,
    isError,
    error,
    reset,
  };
}
