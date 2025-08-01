import React, { createContext, useState } from "react";
import { useEggsData } from "./data-provider";

interface GlobalContextProps {
  width: number;
  balance: any;
  status: string;
  message: string;
  setStatus: (status: string, message: string) => void;
}

interface Props {
  children: React.ReactNode;
}

export const WidthDefaults = { xs: 200, sm: 300, md: 500, lg: 700 };

export const GlobalContext = createContext<GlobalContextProps>({
  width: 0,
  balance: {},
  status: "NONE",
  message: "",
  //@ts-expect-error

  setStatus: (status: string, message: string) => {},
});

export const GlobalProvider = (props: Props) => {
  const { userEggsBalance: balance } = useEggsData();

  const [globalContext, setGlobalContext] = useState({
    width: 0,
    message: "",
    status: "NONE",
  });

  /*
  useEffect(() => {
    if(globalContext.status === "COMPLETED"){
      balance.refetch();
    }
  }, [globalContext.status]) */

  const setStatus = (status: string, message: string) => {
    setGlobalContext((s) => ({
      ...s,
      message,
      status,
    }));
  };

  return (
    <GlobalContext.Provider value={{ ...globalContext, balance, setStatus }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
