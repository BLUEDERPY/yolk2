import { Typography, Button, Stack, Box } from "@mui/material";
import { GlobalContext } from "../providers/global-provider";
import { useContext, useState, useEffect } from "react";
import { useWriteContract } from "wagmi";
import loader from "../assets/eggs-loader.png";

const LoadingScreen = () => {
  const { status, message, setStatus } = useContext(GlobalContext);
  const { reset } = useWriteContract();

  const click = () => {
    setStatus("NONE", "");
    reset;
  };

  const [isErrorOrSuccess, setIsErrorOrSuccess] = useState(false);

  useEffect(() => {
    if (status == "ERROR" || status == "SUCCESS") {
      setIsErrorOrSuccess(true);
    } else {
      setIsErrorOrSuccess(false);
    }
  }, [status]);

  return (
    <>
      <Stack alignItems="center">
        <Box
          component="img"
          src={loader}
          sx={{
            height: 350,
            width: 350,
          }}
        />
      </Stack>
    </>
  );
};

export default LoadingScreen;
