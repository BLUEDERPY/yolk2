import React from "react";
import { Box, Typography } from "@mui/material";
import logo from "../../assets/logo.png";

export const FooterLogo: React.FC = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box component={"img"} src={logo} height={42} width={42} />

      <Typography
        variant="subtitle1"
        sx={{ 
          ml: 1, 
          fontWeight: "bold", 
          color: (theme) => theme.palette.mode === 'light' ? theme.palette.text.primary : 'white'
        }}
      >
        Eggs Finance
      </Typography>
    </Box>
  );
};
