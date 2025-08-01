import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  styled,
  Icon,
} from "@mui/material";
import Logo from "../../assets/logo.png";
import { ConnectWallet } from "./ConnectWallet";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { NavLink } from "./NavLink";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,

  left: "10px",
  top: "10px",
  width: "calc(100% - 20px)",
  boxSizing: "border-box",
}));

export function Header() {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box component={"img"} src={Logo} height={50} width={50} />
            <Typography
              variant="h6"
              sx={{
                ml: 1,
                fontWeight: "bold",
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.text.primary
                    : "white",
              }}
            >
              Eggs Finance
            </Typography>
          </Box>
          
          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: 1,
            }}
          >
            <NavLink href="/">Home</NavLink>
            <NavLink href="/tokens">Tokens</NavLink>
            <Button
              component="a"
              href="https://shop.eggs.finance/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "grey.300",
                px: { xs: 1, sm: 2 },
                py: 1,
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "rgba(252, 156, 4, 0.08)",
                },
                borderRadius: 1,
              }}
            >
              Swag
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <ThemeToggle size="small" />
          <Button
            sx={{
              marginY: "10px",
              height: "35px",
              display: { xs: "none", sm: "flex" },
            }}
            variant="outlined"
            color="primary"
            target="_blank"
            href="https://eggs-finance.gitbook.io/docs/documentation"
          >
            Documentation
          </Button>
          <ConnectWallet />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
