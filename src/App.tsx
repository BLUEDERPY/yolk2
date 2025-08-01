import { Grid, Box, Divider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoopPage from "./pages/Loop";
import BorrowPage from "./pages/Borrow";

import HomePage from "./pages/Home";
import { Header } from "./components/Header/Header";

import Navigation from "./components/Header/Navigation";
import { Footer } from "./components/Footer/Footer";
import { BackgroundOverlay } from "./ui/BackgroundOverlay";
import MainPage from "./pages/Main";

import { ConsentDialog } from "./components/ConsentDialog";
import StakingPage from "./pages/Staking";
import TokenDemoPage from "./pages/TokenDemo";

export const dynamic = "force-dynamic";

//need to add mainnet vs blast for wrap/bridge
//need to implement approve wsonic button into loop (reapprove if amount is increased)

function App() {
  return (
    <>
      <Router>
        <Box
          sx={{
            minHeight: {
              xs: "calc(100dvh - 156px)",
              sm: "calc(100dvh - 58px)",
            },
            bgcolor: "background.default",
          }}
        >
          <BackgroundOverlay />
          <Header />

          <Box
            sx={{
              bgcolor: "background.paper",
              position: "fixed",
              width: "100%",
              top: { xs: 56, sm: 64 },
              zIndex: 40,
            }}
          ></Box>
          <Grid
            container
            spacing={1}
            pt={"88px"}
            px={0}
            direction="column"
            alignContent={"center"}
            sx={{
              minHeight: {
                xs: "calc(100dvh - 156px)",
                sm: "calc(100dvh - 68px)",
              },
              minWidth: "100dvw",
            }}
          >
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/tokens" element={<TokenDemoPage />} />

              <Route path="/trade" element={<HomePage />} />
              <Route path="/lending" element={<BorrowPage />} />
              <Route path="/leverage" element={<LoopPage />} />
              <Route path="/staking" element={<StakingPage />} />
            </Routes>
          </Grid>
        </Box>
        <Box px={0} alignContent={"center"} style={{ minWidth: "100dvw" }}>
          <Footer />
        </Box>
        <ConsentDialog />
      </Router>
    </>
  );
}
export default App;
