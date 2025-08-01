import { Components, Theme } from "@mui/material/styles";

export const getAlertComponents = (theme: Theme): Components["MuiAlert"] => ({
  styleOverrides: {
    root: {
      borderRadius: "8px",
      border: "1px solid",
    },
    standardSuccess: {
      color: theme.palette.primary.main,
      backgroundColor: `${theme.palette.background.paper}dd`,
      borderColor: theme.palette.primary.main,
      "& .MuiAlert-icon": {
        color: theme.palette.primary.main,
      },
    },
    standardError: {
      color: theme.palette.primary.main,
      backgroundColor: `${theme.palette.background.paper}dd`,
      borderColor: theme.palette.primary.main,
      "& .MuiAlert-icon": {
        color: theme.palette.primary.main,
      },
    },
    standardWarning: {
      color: theme.palette.primary.main,
      backgroundColor: `${theme.palette.background.paper}dd`,
      borderColor: theme.palette.primary.main,
      "& .MuiAlert-icon": {
        color: theme.palette.primary.main,
      },
    },
    standardInfo: {
      color: theme.palette.primary.main,
      backgroundColor: `${theme.palette.background.paper}dd`,
      borderColor: theme.palette.primary.main,
      "& .MuiAlert-icon": {
        color: theme.palette.primary.main,
      },
    },
    icon: {
      opacity: 0.9,
      padding: "2px",
      alignItems: "center",
    },
    message: {
      padding: "8px 0",
      fontFamily: theme.typography.fontFamily,
    },
    action: {
      paddingTop: 0,
      alignItems: "center",
    },
  },
});
