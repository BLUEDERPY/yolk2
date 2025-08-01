import React, { useState } from "react";
import {
  Card,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Skeleton,
  useTheme,
  alpha,
  Collapse,
  Divider,
  Stack,
  TextField,
  InputAdornment,
  Alert,
  Slider,
  Grid,
  Paper,
  Link
} from "@mui/material";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Coins,
  ArrowDownUp,
} from "lucide-react";
import { TokenChart } from "./TokenChart";
import { nFormatter } from "../../utils/formatters";
import { formatDate } from "../../utils/formatters";
import { auroraBorderRadius } from "../../themes/aurora";
import { useEggsData } from "../../providers/data-provider";
import useConverter from "../../hooks/useConverter";
import { formatEther, parseEther } from "viem";
import { SwapInput } from "../Swap/SwapInput";
import LoadingScreen from "../LoadingScreen";
import { LeverageCalculator } from "../Leverage/LeverageCalculator";
import { BorrowInputs } from "../Lending/BorrowInputs";
import { CollateralDisplay } from "../Lending/CollateralDisplay";
import { FeesDisplay } from "../Lending/FeesDisplay";
import { BorrowActions } from "../Lending/BorrowActions";
import { useLendingState } from "../Lending/hooks/useLendingState";
import { BalancesWidget } from "../Lending/BalancesWidget";

export interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface TokenData {
  name: string;
  symbol: string;
  tokenName: string;
  backingToken: string;
  backingTitle: string;
  price: number;
  priceChange24h: number;
  totalBorrowed: number;
  circulatingSupply: number;
  chartData: ChartDataPoint[];
  lastUpdated: Date;
}

export interface TokenCardProps {
  tokenData?: TokenData;
  isLoading?: boolean;
  onRefresh?: () => void;
  showVolume?: boolean;
  defaultTimeframe?: "24h" | "7d" | "30d" | "1y";
  compact?: boolean;
  onTrade?: () => void;
  onLend?: () => void;
  onLeverage?: () => void;
  isExpanded?: boolean;
  onExpandChange?: (
    expanded: boolean,
    tab: "chart" | "trade" | "lend" | "leverage"
  ) => void;
  activeTab?: "overview" | "trade" | "lend" | "leverage";
  onTabChange?: (tab: "overview" | "trade" | "lend" | "leverage") => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  tokenData,
  isLoading = false,
  showVolume = true,
  defaultTimeframe = "7d",
  compact = false,
  isExpanded = false,
  onExpandChange,
  activeTab = "overview",
  onTabChange,
}) => {
  const theme = useTheme();
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeDirection, setTradeDirection] = useState<"buy" | "sell">("buy");

  // Get real trading data
  const {
    userEggsBalance,
    userSonicBalance,
    buy,
    sell,
    userLoan: loan,
    isPending: isTrading,
    isConfirming: isConfirmingTrade,
  } = useEggsData();

  // Get lending state for the lending tab
  const {
    borrowAmount,
    setBorrowAmount,
    duration,
    setDuration,
    collateralRequired,
    fees,
    isValid,
    errorMessage,
    handleMaxBorrow,
    handleBorrow,
    isTransactionOccuring,
    balance,
    max,
  } = useLendingState();
  const { sonic: conversionRateToSonic, eggs: conversionRateToEggs } =
    useConverter(parseEther(tradeAmount || "0"));

  const eggsBalance = userEggsBalance
    ? Number(formatEther(userEggsBalance))
    : 0;
  const sonicBalance = userSonicBalance
    ? Number(userSonicBalance.formatted)
    : 0;

  // Calculate conversion amounts
  const convertedAmount =
    tradeDirection === "buy"
      ? conversionRateToEggs
        ? Number(formatEther(conversionRateToEggs)) * 0.99
        : 0
      : conversionRateToSonic
      ? Number(formatEther(conversionRateToSonic)) * 0.99
      : 0;

  const priceChangeColor =
    tokenData && tokenData.priceChange24h >= 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  const handleTradeSubmit = () => {
    if (tradeDirection === "buy") {
      buy(tradeAmount);
    } else {
      sell(parseEther(tradeAmount));
    }
  };

  const handleActionClick = (tab: "trade" | "lend" | "leverage" | "chart") => {
    if (onTabChange) {
      onTabChange(tab);
    }
    // Then expand
    if (onExpandChange) {
      onExpandChange(true, tab);
    }
  };

  const handleTabClick = (tab: "overview" | "trade" | "lend" | "leverage") => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Get token configuration
  const tokenConfig = tokenData ? {
    tokenName: tokenData.tokenName,
    backingToken: tokenData.backingToken,
    backingTitle: tokenData.backingTitle
  } : {
    tokenName: "EGGS",
    backingToken: "S", 
    backingTitle: "Sonic"
  };

  const renderExpandedContent = () => {
    switch (activeTab) {
      case "trade":
        return (
          <Box sx={{ p: 2, pt: 1, height: "100%", display: "flex", alignItems: "flex-start" }}>
            <Stack spacing={3} sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
              {isTrading || isConfirmingTrade ? (
                <LoadingScreen />
              ) : (
                <>
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Swap Tokens
                    </Typography>
                  </Box>
                  
                  <SwapInput
                    label={tradeDirection === "buy" ? tokenConfig.backingTitle : tokenConfig.tokenName}
                    value={tradeAmount}
                    onChange={setTradeAmount}
                    balance={
                      tradeDirection === "buy"
                        ? sonicBalance.toString()
                        : eggsBalance.toString()
                    }
                    onMax={() =>
                      setTradeAmount(
                        tradeDirection === "buy"
                          ? sonicBalance.toString()
                          : eggsBalance.toString()
                      )
                    }
                  />
                  <Button
                    onClick={() =>
                      setTradeDirection(
                        tradeDirection === "buy" ? "sell" : "buy"
                      )
                    }
                    sx={{
                      width: "40px",
                      minWidth: "40px",
                      height: "40px",
                      p: 0,
                      alignSelf: "center",
                      borderRadius: "50%",
                    }}
                  >
                    <ArrowUpDown size={20} />
                  </Button>
                  <SwapInput
                    label={tradeDirection === "buy" ? tokenConfig.tokenName : tokenConfig.backingTitle}
                    value={convertedAmount.toFixed(6)}
                    onChange={() => {}}
                    balance={
                      tradeDirection === "buy"
                        ? eggsBalance.toString()
                        : sonicBalance.toString()
                    }
                    disabled
                  />
                  <Button
                    variant="contained"
                    onClick={handleTradeSubmit}
                    disabled={
                      !tradeAmount ||
                      Number(tradeAmount) <= 0 ||
                      Number(tradeAmount) >
                        (tradeDirection === "buy"
                          ? Number(sonicBalance)
                          : Number(eggsBalance))
                    }
                    startIcon={<ArrowDownUp size={16} />}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  >
                    Swap
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        );

      case "lend":
        return (
          <Box sx={{ p: 2, pt: 1, height: "100%", display: "flex", alignItems: "flex-start" }}>
            <Stack spacing={3} sx={{ width: "100%", maxWidth: 400, mx: "auto" }} position={"relative"}>
              {isTransactionOccuring ? (
                <LoadingScreen />
              ) : (
                <>
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Borrow {tokenConfig.backingTitle}
                    </Typography>
                  </Box>
                  
                  <BorrowInputs
                    max={max}
                    setBorrowAmount={setBorrowAmount}
                    duration={duration}
                    setDuration={setDuration}
                    onMaxClick={handleMaxBorrow}
                    balance={balance}
                  />
                  <Box sx={{ my: 2 }}>
                    <CollateralDisplay
                      collateralRequired={collateralRequired || 0}
                      borrowAmount={borrowAmount}
                      tokenConfig={tokenConfig}
                    />
                    <FeesDisplay fees={fees} duration={duration} />
                  </Box>
                  <BorrowActions
                    isValid={isValid}
                    errorMessage={errorMessage}
                    onBorrow={handleBorrow}
                    tokenConfig={tokenConfig}
                  />
                </>
              )}
            </Stack>
          </Box>
        );

      case "leverage":
        return <LeverageCalculator />;

      default:
        return (
          <TokenChart
            data={tokenData?.chartData}
            timeframe={selectedTimeframe}
            showVolume={true}
            priceChangeColor={priceChangeColor}
            compact={false}
          />
        );
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card
        sx={{
          width: compact && !isExpanded ? 320 : "100%",
          maxWidth: "1200px",
          height: compact ? 200 : {xs: 'auto', md: 500},
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={16} />
            </Box>
          </Box>
          {!compact && (
            <Skeleton variant="rectangular" sx={{ flex: 1, borderRadius: 1 }} />
          )}
        </Box>
      </Card>
    );
  }

  // Compact card

    return (
      <Card
        sx={{
          width: isExpanded ? "100%" : compact && !isExpanded ? 320 : "100%",
          borderRadius: 2,
          maxWidth: "1200px",
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
            maxWidth: "1200px",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                {tokenData.symbol.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {tokenData.name}
                </Typography>
                <Chip
                  label={tokenData.symbol.toUpperCase()}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>
            </Box>

            <IconButton
              onClick={() =>
                onExpandChange && onExpandChange(!isExpanded, "chart")
              }
              size="large"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                width: 32,
                height: 32,
              }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </IconButton>
                     {/* Balances Widget in header for full view */}
            {isExpanded && (
              <BalancesWidget sonic={userSonicBalance} eggs={userEggsBalance} />
            )}
          </Box>

          {/* Price Section */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 1 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatPrice(tokenData.price)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {tokenData.priceChange24h >= 0 ? (
                  <TrendingUp size={14} color={priceChangeColor} />
                ) : (
                  <TrendingDown size={14} color={priceChangeColor} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: priceChangeColor,
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {formatChange(tokenData.priceChange24h)}
                </Typography>
              </Box>
            </Box>

            {/* Simple chart for compact view */}
            {!isExpanded && (
              <Box sx={{ 
                width: "100%", 
                height: 60, 
                mt: 1,
                background: `linear-gradient(90deg, ${priceChangeColor}20 0%, ${priceChangeColor}10 50%, ${priceChangeColor}20 100%)`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="caption" color="text.secondary">
                  Chart Preview
                </Typography>
              </Box>
            )}
          </Box>

          {/* Expandable content */}
          <Collapse in={isExpanded}>
            {/* Desktop view - 50/50 layout */}
            <Box>
              {/* Action buttons */}
              <Paper
                elevation={0}
                sx={{
                  mx: 2,
                  mb: 2,
                  p: 1,
                  borderRadius: auroraBorderRadius.xl,
                  background:
                    theme.palette.mode === "light"
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(17, 17, 17, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" spacing={0}>
                  <Link
                    component="button"
                    onClick={() => {
                      console.log("Full Trade button clicked");
                      handleActionClick("trade");
                    }}
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      py: 1.5,
                      px: 2,
                      borderRadius: auroraBorderRadius.lg,
                      textDecoration: "none",
                      color: theme.palette.text.primary,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease-in-out",
                     backgroundColor: activeTab === "trade" ? `${theme.palette.primary.main}15` : "transparent",
                     color: activeTab === "trade" ? theme.palette.primary.main : theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <ArrowUpDown size={16} />
                    Trade
                  </Link>
                  {loan && loan[1] > 0 ? (
                    <Link
                      component="button"
                      onClick={() => {
                        console.log("Full Lend button clicked");
                        handleActionClick("leverage");
                      }}
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        py: 1.5,
                        px: 2,
                        borderRadius: auroraBorderRadius.lg,
                        textDecoration: "none",
                        color: theme.palette.text.primary,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: `${theme.palette.primary.main}15`,
                          color: theme.palette.primary.main,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Coins size={16} />
                      My Position
                    </Link>
                  ) : (
                    <>
                      <Link
                        component="button"
                        onClick={() => {
                          console.log("Full Lend button clicked");
                          handleActionClick("lend");
                        }}
                        sx={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          py: 1.5,
                          px: 2,
                          borderRadius: auroraBorderRadius.lg,
                          textDecoration: "none",
                          color: theme.palette.text.primary,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          transition: "all 0.2s ease-in-out",
                         backgroundColor: activeTab === "lend" ? `${theme.palette.primary.main}15` : "transparent",
                         color: activeTab === "lend" ? theme.palette.primary.main : theme.palette.text.primary,
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <Coins size={16} />
                        Borrow
                      </Link>
                      <Link
                        component="button"
                        onClick={() => {
                          console.log("Full Leverage button clicked");
                          handleActionClick("leverage");
                        }}
                        sx={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          py: 1.5,
                          px: 2,
                          borderRadius: auroraBorderRadius.lg,
                          textDecoration: "none",
                          color: theme.palette.text.primary,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          transition: "all 0.2s ease-in-out",
                         backgroundColor: activeTab === "leverage" ? `${theme.palette.primary.main}15` : "transparent",
                         color: activeTab === "leverage" ? theme.palette.primary.main : theme.palette.text.primary,
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <TrendingUp size={16} />
                        Leverage
                      </Link>
                    </>
                  )}
                  <Link
                    component="button"
                    onClick={() => {
                      console.log("Full Chart button clicked");
                      handleActionClick("chart");
                    }}
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      py: 1.5,
                      px: 2,
                      borderRadius: auroraBorderRadius.lg,
                      textDecoration: "none",
                      color: theme.palette.text.primary,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      transition: "all 0.2s ease-in-out",
                     backgroundColor: activeTab === "chart" ? `${theme.palette.primary.main}15` : "transparent",
                     color: activeTab === "chart" ? theme.palette.primary.main : theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}15`,
                        color: theme.palette.primary.main,
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <TrendingUp size={16} />
                    Chart
                  </Link>
                </Stack>
              </Paper>

              {activeTab === "leverage" || activeTab === "chart" ? (
                /* Full width leverage content with optional chart toggle */
                activeTab === "chart" ? (
                  <Box sx={{ height: {xs: 'auto', md: 575}, mb: 2 }}>
                    <TokenChart
                      data={tokenData?.chartData}
                      timeframe="7d"
                      showVolume={true}
                      priceChangeColor={priceChangeColor}
                      compact={false}
                    />
                  </Box>
                ) : (
                  <Box sx={{ p: 0, m: 0, height: {xs: 'auto', md: 575}}}>
                    <LeverageCalculator />
                  </Box>
                )
              ) : (
                /* 50/50 Chart and Content Layout for other tabs */
                <Box sx={{ display: "flex", gap: 2, height: {xs: 'auto', md: 575} }}>
                  {/* Chart - 50% */}

                  <Box sx={{ flex: 1, display: { xs: "none", md: "block" }, pt: 3 }}>
                    <TokenChart
                      data={tokenData?.chartData}
                      timeframe="7d"
                      showVolume={true}
                      priceChangeColor={priceChangeColor}
                      compact={false}
                    />
                  </Box>

                  {/* Content - 50% */}
                  <Box sx={{ flex: 1, height: "100%", pt: 3 }}>{renderExpandedContent()}</Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>

        {/* Token Info Section - Only show in compact view */}
        {!isExpanded && (
          <Box sx={{ mt: 4, mb: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    TVL
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    ${nFormatter(tokenData.totalBorrowed * tokenData.price, 2)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    Total Burned
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    {nFormatter(tokenData.totalBorrowed * 0.1, 2)} {tokenConfig.tokenName}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    Total Borrowed
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    {nFormatter(tokenData.totalBorrowed, 2)} {tokenConfig.backingToken}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                    Circulating Supply
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    {nFormatter(tokenData.circulatingSupply, 2)} {tokenConfig.tokenName}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Action buttons below chart - only show in compact view */}
        {!isExpanded && (
          <Box sx={{ px: 2, pb: 2, mt: 3 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ArrowUpDown size={16} />}
                onClick={() => {
                  console.log("Compact Trade button clicked");
                  handleActionClick("trade");
                }}
                sx={{ flex: 1, minWidth: 0, fontSize: "0.75rem" }}
                size="small"
              >
                Trade
              </Button>
              {loan && loan[1] > 0 ? (
                <Button
                  variant="outlined"
                  startIcon={<TrendingUp size={16} />}
                  onClick={() => {
                    console.log("Compact Leverage button clicked");
                    handleActionClick("leverage");
                  }}
                  sx={{ flex: 1, minWidth: 0, fontSize: "0.75rem" }}
                  size="small"
                >
                  My Position
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Coins size={16} />}
                    onClick={() => {
                      console.log("Compact Lend button clicked");
                      handleActionClick("lend");
                    }}
                    sx={{ flex: 1, minWidth: 0, fontSize: "0.75rem" }}
                    size="small"
                  >
                    Borrow
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<TrendingUp size={16} />}
                    onClick={() => {
                      console.log("Compact Leverage button clicked");
                      handleActionClick("leverage");
                    }}
                    sx={{ flex: 1, minWidth: 0, fontSize: "0.75rem" }}
                    size="small"
                  >
                    Leverage
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}
      </Card>
    );
 

};