import React from "react";
import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { Dashboard as DashboardComponent } from "../components/Dashboard/Dashboard";

const MainPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <>
      {/* CTA Banner */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Rest of the content remains unchanged */}
        <Grid
          container
          spacing={3}
          mt={1}
          sx={{ px: { xs: 2, sm: 4 }, mb: { xs: 8, sm: 12 } }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography
              variant="h2"
              component="h1"
              sx={{
                mb: 3,
                fontWeight: "bold",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.warning.light})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              }}
            >
              Are you ready to cook?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                maxWidth: "800px",
                mx: "auto",
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              Eggs Finance is a DeFi protocol that enables unique yield, lending and arbitrage mechanisms by issuing asset-backed tokens with stable and potentially increasing value mechanisms.
            </Typography>
            <Box
              sx={{
                width: "60px",
                height: "2px",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.warning.light})`,
                mx: "auto",
                my: 3,
                borderRadius: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                maxWidth: "800px",
                mx: "auto",
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              Yield has never been served this over-easy!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="https://eggs-finance.gitbook.io/docs/documentation"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.2rem",
              }}
            >
              Learn More
            </Button>
          </Grid>

          {/* Feature Sections */}
          <Grid item xs={12} sx={{ mt: 8 }}>
            <Container maxWidth="lg">
              <Grid container spacing={4}>
                {/* Trade Section */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      background: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: "primary.dark",
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Trade
                    </Typography>
                    <Typography sx={{ mb: 3, color: "text.secondary", flex: 1 }}>
                      Mint and redeem ecosystem tokens!
                    </Typography>
                    <Button
                      variant="contained"
                     onClick={() => navigate("/tokens")}
                      endIcon={<ArrowRight />}
                      fullWidth
                    >
                      Swap
                    </Button>
                  </Paper>
                </Grid>

                {/* Borrow Section */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      background: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: "primary.dark",
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Borrow
                    </Typography>
                    <Typography
                      sx={{ mb: 3, color: "text.secondary", flex: 1 }}
                    >
                      Borrow against ecosystem tokens with 99% LTV!
                    </Typography>
                    <Button
                      variant="contained"
                     onClick={() => navigate("/tokens")}
                      endIcon={<ArrowRight />}
                      fullWidth
                    >
                      Borrow
                    </Button>
                  </Paper>
                </Grid>

                {/* Leverage Section */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      background: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: "primary.dark",
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Leverage
                    </Typography>
                    <Typography sx={{ mb: 3, color: "text.secondary", flex: 1 }}>
                      Loop loans to create leverage positions!
                    </Typography>
                    <Button
                      variant="contained"
                     onClick={() => navigate("/tokens")}
                      endIcon={<ArrowRight />}
                      fullWidth
                    >
                      Explore
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>

        <Grid item xs={12} alignSelf="center" mb={"30px"}>
          <DashboardComponent />
        </Grid>
      </Container>
    </>
  );
};

export default MainPage;