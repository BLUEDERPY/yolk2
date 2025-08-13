import React from "react";
import { Box, Container, Stack, Tab, Tabs } from "@mui/material";
import { BorrowMoreTab } from "./Tabs/BorrowMoreTab";
import { RemoveCollateralTab } from "./Tabs/RemoveCollateralTab";
import { ExtendLoanTab } from "./Tabs/ExtendLoanTab";
import { ClosePositionTab } from "./Tabs/ClosePositionTab";
import { useTheme } from "@mui/material/styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lending-tabpanel-${index}`}
      aria-labelledby={`lending-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const LendingTabs = ({ tokenType = 'eggs' }: { tokenType?: 'eggs' | 'yolk' | 'nest' }) => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  // Get token configuration
  const tokenConfig = {
    eggs: { tokenName: "EGGS", backingToken: "S", backingTitle: "Sonic" },
    yolk: { tokenName: "YOLK", backingToken: "USDC", backingTitle: "USDC" },
    nest: { tokenName: "NEST", backingToken: "EGGS", backingTitle: "Eggs" },
  }[tokenType];

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack
      spacing={3}
      px={"1px"}
      sx={{
        maxWidth: {
          xs: "calc(100dvw - 30px)",
          sm: "450px",
          md: "900px",
        },
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        aria-label="lending options"
        scrollButtons="auto"
        sx={{borderWidth: 0, background: "none"}}
      >
        <Tab label="Borrow" />
        <Tab label="Remove" />
        <Tab label="Extend" />
        <Tab label="Close" />
      </Tabs>

      <Box
        sx={{
          py: { xs: 0 },
          px: { xs: 2, sm: 6, md: 8 },
          mt: "0 !important",
        }}
      >
        <TabPanel value={value} index={0}>
          <BorrowMoreTab tokenType={tokenType} tokenConfig={tokenConfig} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RemoveCollateralTab tokenType={tokenType} tokenConfig={tokenConfig} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ExtendLoanTab tokenType={tokenType} tokenConfig={tokenConfig} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ClosePositionTab tokenType={tokenType} tokenConfig={tokenConfig} />
        </TabPanel>
      </Box>
    </Stack>
  );
};
