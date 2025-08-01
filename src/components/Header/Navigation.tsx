import { Box, Container } from "@mui/material";
import { NavLink } from "./NavLink";
import { useEggsData } from "../../providers/data-provider";

const Navigation = () => {
  const { isMintedOut } = useEggsData();
  return (
    <Box component="nav">
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/tokens">Tokens</NavLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navigation;