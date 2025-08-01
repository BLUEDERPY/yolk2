import { createTheme } from "@mui/material";
import { getAlertComponents } from "./utils/alert";

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fc9c04",
      dark: "#e8890a",
      light: "#fdb347",
    },
    secondary: {
      main: "#1a1a2e",
      dark: "#0f0f1a",
      light: "#2a2a3e",
    },
    background: {
      default: "#222237",
      paper: "#1a1a2e",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    divider: "#444",
    success: {
      main: "#00d4b5",
      dark: "#00b8a0",
      light: "#33dcc4",
    },
    error: {
      main: "#f44336",
      dark: "#d32f2f",
      light: "#f66659",
    },
    warning: {
      main: "#ffb74d",
      dark: "#f57c00",
      light: "#ffcc80",
    },
    info: {
      main: "#2196f3",
      dark: "#1976d2",
      light: "#64b5f6",
    },
  },
  typography: {
    h5: {
      fontFamily: "Doto",
      fontSize: "42px",
    },
    body1: {
      fontSize: "1rem",
      fontFamily: "DM Sans",
    },
    body2: {
      fontFamily: "DM Sans",
    },
    subtitle1: {
      fontFamily: "DM Sans",
    },
    subtitle2: {
      fontFamily: "DM Sans",
    },
    caption: {
      fontFamily: "DM Sans",
    },
    button: {
      fontFamily: "Dongle",
      fontWeight: "400",
      fontStyle: "normal",
      fontSize: "26px",
    },
    h6: {
      fontFamily: "DM Sans",
    },
    h4: {
      fontFamily: "DM Sans",
    },
    h3: {
      fontFamily: "DM Sans",
    },
    h2: {
      fontFamily: "DM Sans",
    },
    h1: {
      fontFamily: "DM Sans",
    },
    overline: {
      fontFamily: "DM Sans",
    },
    fontFamily: "DM Sans",
  },
});

theme = createTheme(theme, {
  palette: {
    action: {
      disabledBackground: "rgba(252,156,4,30%)",
      disabled: "rgba(221,221,221,30%)",
      disabledOpacity: "1",
    },
  },
  components: {
    MuiAlert: getAlertComponents(theme),
    MuiButtonGroup: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            textTransform: "none",

            "&& button": {
              paddingTop: "8px",
              height: "30px",
              background: "#212121",
              fontSize: "20px",
            },
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          marginTop: "10px",
        },
        notchedOutline: {
          borderColor: theme.palette.text.primary,
          color: theme.palette.text.secondary,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          color: theme.palette.text.primary,
          alignSelf: "center",
          opacity: 10,
          padding: 24,

          boxShadow: `inset 0 0 0.5px 1px hsla(0, 0%,  
              100%, 0.075),
              /* shadow ring 👇 */
              0 0 0 1px hsla(0, 0%, 0%, 0.05),
              /* multiple soft shadows 👇 */
              0 0.3px 0.4px hsla(0, 0%, 0%, 0.02),
              0 0.9px 1.5px hsla(0, 0%, 0%, 0.045),
              0 3.5px 6px hsla(0, 0%, 0%, 0.09)`,
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          paddingTop: "3px !important",
          textTransform: "none",
          paddingBottom: "0px !important",
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { size: "small" },
          style: {
            paddingTop: "3px !important",
            textTransform: "none",
            paddingBottom: "0px !important",
            fontSize: "24px",
            height: "32px",
          },
        },
      ],
      styleOverrides: {
        root: {
          paddingTop: "3px !important",
          textTransform: "none",
          paddingBottom: "0px !important",
        },
      },
    },
  },
});

export default theme;
