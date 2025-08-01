import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Link,
  Stack,
  Tooltip,
  useTheme,
  Paper,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp,
  Timer,
  ArrowUpRight,
  Award,
  Wallet,
  ExternalLink,
  Clock,
  Info,
  DollarSign,
  LineChart,
} from "lucide-react";
import { useAccount } from "wagmi";
import { MerklApi } from "@merkl/api";
import { formatEther, formatUnits, parseEther } from "viem";
import { nFormatter } from "../utils/formatters";
import { motion } from "framer-motion";
import { useWSonicPrice } from "../hooks/useWSonicPrice";
import sonicIcon from "../assets/wS_token.svg";
import { useEggsData } from "../providers/data-provider";
const OverviewCard = ({ title, value, subValue, icon: Icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      height: "100%",
      background: (theme) =>
        `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
      minWidth: 200,
      justifySelf: "center",
      width: "calc(100% - 30px)",
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
      }}
    >
      <Icon size={24} color={color} />
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      {subValue && (
        <Typography variant="caption" color="text.secondary">
          {subValue}
        </Typography>
      )}
    </Box>
  </Paper>
);
const LiquidityStrategyInfo = () => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 4,
      background: (theme) =>
        `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
    }}
  >
    <Stack spacing={2}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Info size={20} />
        <Typography variant="h6">Liquidity Provider Strategy</Typography>
      </Box>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ lineHeight: 1.6 }}
      >
        Earn rewards by providing liquidity to the SwapX 0.3% EGGS/USDC.e pool.
        Your rewards are calculated based on your liquidity utilization over
        7-day epochs - the more your provided liquidity is traded through, the
        higher your rewards.
      </Typography>
      <Box sx={{ pl: 2, borderLeft: 2, borderColor: "primary.main" }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Key Strategy Points:</strong>
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            • Tight ranges typically earn more than wide ranges when managed
            effectively
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Active position management is crucial for maximizing returns
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Monitor market conditions to adjust your strategy accordingly
          </Typography>
        </Stack>
      </Box>
    </Stack>
  </Paper>
);
const StakingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { address } = useAccount();
  const [rewards, setRewards] = useState({});
  const [pools, setPools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const merkl = MerklApi("https://api.merkl.xyz").v4;
  const { price } = useWSonicPrice();
  const { nextReward } = useEggsData();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const poolsResponse = await merkl.opportunities.campaigns.get({
          query: {
            mainParameter: "0xEcb04e075503Bd678241f00155AbCB532c0a15Eb",
          },
        });
        setPools(poolsResponse.data);

        if (address) {
          const rewardsResponse = await merkl.users({ address }).rewards.get({
            query: { chainId: [146] },
          });
          const chainRewards = rewardsResponse.data.find(
            (r) => r.chain.id === 146
          );
          setRewards(chainRewards?.rewards[0] || {});
        }
      } catch (err) {
        setError("Failed to fetch staking data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const globalstats = {
    tvl: pools.reduce((acc, pool) => acc + pool.tvl, 0),
    averageAPR:
      pools.reduce((acc, pool) => acc + pool.apr, 0) / (pools.length || 1),
    totalDailyRewards: pools.reduce((acc, pool) => acc + pool.dailyRewards, 0),
    nextDistorTime: new Date("2/3/2025"),
    newTotalReward: nextReward,
  };

  const userRewards = {
    symbol: "Sonic",
    pendingClaim: rewards?.pending || 0,
  };
  console.log(rewards);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = globalstats.nextDistorTime.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [globalstats.nextDistorTime]);

  const cardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            STAKING
          </Typography>
        </Box>
      </motion.div>
      <LiquidityStrategyInfo />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={cardStyle}>
            <Stack spacing={3} sx={{ height: "100%" }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h5" textAlign="center" gutterBottom>
                  Next Reward Distribution
                </Typography>
              </motion.div>

              <Box sx={{ textAlign: "center", flex: "1 0 auto" }}>
                <Grid container spacing={2} justifyContent="center">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map((item, index) => (
                    <Grid item key={item.label}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            minWidth: 0,
                            background: theme.palette.background.default,
                            border: "1px solid",
                            borderColor: "primary.dark",
                            borderRadius: 2,
                          }}
                        >
                          <motion.div
                            key={item.value}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Typography variant="h3" color="primary">
                              {item.value}
                            </Typography>
                          </motion.div>
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Grid container sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} mb={"15px"}>
                  <OverviewCard
                    title="TVL"
                    value={`$${nFormatter(globalstats.tvl, 2)}`}
                    subValue="EGGS/USDC.e"
                    icon={Wallet}
                    color={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} mb={"15px"}>
                  <OverviewCard
                    title="Average APR"
                    value={`${globalstats.averageAPR.toFixed(2)}%`}
                    subValue="Current yield"
                    icon={TrendingUp}
                    color={theme.palette.success.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} mt={"15px"}>
                  <OverviewCard
                    title="Daily Rewards"
                    value={`${nFormatter(
                      globalstats.totalDailyRewards / price,
                      2
                    )} Sonic`}
                    subValue={
                      "$" + nFormatter(globalstats.totalDailyRewards, 2)
                    }
                    icon={Timer}
                    color={theme.palette.warning.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} mt={"15px"}>
                  <OverviewCard
                    title="Next rewards"
                    value={nFormatter(nextReward || 0, 2) + " S"}
                    subValue={"$" + nFormatter(nextReward * price, 2)}
                    icon={Award}
                    color={theme.palette.error.main}
                  />
                </Grid>
              </Grid>
              {/* <Grid container spacing={0} sx={{ mt: "auto" }}>
                <Grid item xs={12} sx={{ mt: "auto" }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Paper
                      sx={{
                        py: 1,
                        px: 3,
                        background: `linear-gradient(145deg, ${theme.palette.primary.dark}20 0%, ${theme.palette.primary.main}10 100%)`,
                        border: "1px solid",
                        borderColor: "primary.dark",
                        borderRadius: 2,
                      }}
                    >
                      <Stack spacing={0}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">Next Reward</Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            fontSize={"28px"}
                          >
                            {nFormatter(
                              Number(globalstats.newTotalReward || 0),
                              2
                            )}{" "}
                            <Typography
                              component="span"
                              variant="h6"
                              color="text.secondary"
                            >
                              SONIC
                            </Typography>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6">Current APR</Typography>
                          <Typography
                            variant="h6"
                            color="success.main"
                            fontSize={"24px"}
                          >
                            {globalstats.averageAPR.toFixed(2)}
                            <Typography
                              component="span"
                              variant="h6"
                              color="text.secondary"
                            >
                              %
                            </Typography>
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>

              <Grid container spacing={0} sx={{ mt: "auto" }}>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={DollarSign}
                    label="Total Value Locked"
                    value={`$${nFormatter(globalstats.tvl, 2)}`}
                    color={theme.palette.success.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: "auto" }}>
                  <Box textAlign="-webkit-right">
                    <StatCard
                      icon={LineChart}
                      label="Daily Rewards"
                      value={`${nFormatter(
                        globalstats.totalDailyRewards,
                        2
                      )} SONIC`}
                      color={theme.palette.primary.main}
                    />
                  </Box>
                </Grid>
              </Grid>*/}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={cardStyle}>
            <Stack spacing={2} p={2} sx={{ height: "100%" }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Typography textAlign="center" variant="h5">
                  MY REWARDS
                </Typography>
              </motion.div>

              <Box
                sx={{
                  textAlign: "center",
                  flex: "1 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "fit-content",
                }}
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0,
                    duration: 1.5,
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "24px",
                  }}
                >
                  <Box
                    component="img"
                    src={sonicIcon}
                    alt="Sonic Token"
                    sx={{
                      width: 175,
                      height: 175,
                      borderRadius: "50%",
                      border: `5px solid ${theme.palette.primary.main}`,
                    }}
                  />
                </motion.div>
              </Box>
              <Box height={"100px"}>
                <Typography textAlign="center" variant="h3" color="primary">
                  {nFormatter(
                    Number(formatUnits(userRewards.pendingClaim, 18)),
                    2
                  )}{" "}
                  Sonic
                </Typography>
              </Box>
              <Stack spacing={2} sx={{ mt: "auto" }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!userRewards.pendingClaim}
                  startIcon={<Wallet size={20} />}
                  sx={{
                    py: 1.5,
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                  }}
                >
                  Claim Rewards
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  endIcon={<ExternalLink size={20} />}
                  component={Link}
                  href="https://app.sushi.com/swap"
                  target="_blank"
                  rel="noopener"
                  sx={{
                    py: 1.5,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      borderColor: theme.palette.primary.dark,
                      background: `${theme.palette.primary.main}10`,
                    },
                  }}
                >
                  Add Liquidity
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StakingPage;
