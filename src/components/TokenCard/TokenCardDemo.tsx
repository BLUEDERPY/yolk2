import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TokenCard, TokenData } from "./TokenCard";

// Mock data generator
const generateMockData = (days: number = 30): TokenData => {
  const now = Date.now();
  const chartData = [];
  const basePrice = 1.25;
  let currentPrice = basePrice;

  for (let i = days; i >= 0; i--) {
    const timestamp = Math.floor((now - i * 24 * 60 * 60 * 1000) / 1000);

    // Generate realistic OHLC data
    const dailyVolatility = 0.05; // 5% daily volatility
    const trend = Math.sin(i / 10) * 0.02; // Small trend component

    const open = currentPrice;
    const changePercent = (Math.random() - 0.5) * dailyVolatility + trend;
    const close = Math.max(0.01, open * (1 + changePercent));

    // High and low should encompass open and close
    const maxPrice = Math.max(open, close);
    const minPrice = Math.min(open, close);
    const extraRange = Math.random() * 0.02; // Additional range for high/low

    const high = maxPrice * (1 + extraRange);
    const low = Math.max(0.01, minPrice * (1 - extraRange));

    const volume = Math.random() * 1000000 + 500000;

    chartData.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });

    currentPrice = close; // Update current price for next iteration
  }

  return {
    name: "Eggs",
    symbol: "s",
    tokenName: "EGGS",
    backingToken: "S",
    backingTitle: "Sonic",
    price: chartData[chartData.length - 1].close,
    priceChange24h: Math.random() * 20 - 10, // Random between -10% and +10%
    totalBorrowed: 2500000,
    circulatingSupply: 15000000,
    chartData,
    lastUpdated: new Date(),
  };
};

export const TokenCardDemo: React.FC = () => {
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const [tokenData, setTokenData] = useState<TokenData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [cardOrder, setCardOrder] = useState(["yolk", "nest", "eggs"]);
  const [cardTabs, setCardTabs] = useState<
    Record<string, "chart" | "trade" | "lend" | "leverage">
  >({
    yolk: "chart",
    nest: "chart",
    eggs: "chart",
  });

  const loadData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTokenData(generateMockData());
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle browser back button to collapse expanded cards
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (expandedCard) {
        event.preventDefault();
        setExpandedCard(null);
        // Push the current state back to prevent actual navigation
        window.history.pushState(null, '', location.pathname);
      }
    };

    // Add state to history when a card is expanded
    if (expandedCard) {
      window.history.pushState({ expandedCard }, '', location.pathname);
    }

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [expandedCard, location.pathname]);

  const handleExpandChange = (
    cardId: string,
    expanded: boolean,
    tab: "chart" | "trade" | "lend" | "leverage"
  ) => {
    window.scrollTo(0, 0);
    if (expanded) {
      // Move the expanded card to the first position

      setCardOrder((prev) => {
        const newOrder = prev.filter((id) => id !== cardId);
        return [cardId, ...newOrder];
      });

      setCardTabs((prev) => ({
        ...prev,
        [cardId]: tab,
      }));
      setExpandedCard(cardId);
    } else {
      setExpandedCard(null);
      // Remove the history state when collapsing
      if (window.history.state?.expandedCard) {
        window.history.back();
      }
    }
  };

  const handleTabChange = (
    cardId: string,
    tab: "chart" | "trade" | "lend" | "leverage"
  ) => {
    console.log("Tab change for card:", cardId, "to tab:", tab);
    setCardTabs((prev) => ({
      ...prev,
      [cardId]: tab,
    }));
  };
  const getCardData = (cardId: string) => {
    if (!tokenData) return undefined;

    switch (cardId) {
      case "yolk":
        return {
          ...tokenData,
          name: "Yolk",
          symbol: "usdc",
          tokenName: "YOLK",
          backingToken: "USDC",
          backingTitle: "USDC",
          price:
            tokenData.chartData[tokenData.chartData.length - 1].close * 0.8,
          priceChange24h: tokenData.priceChange24h * -1,
          chartData: tokenData.chartData.map((item) => ({
            ...item,
            open: item.open * 0.8,
            high: item.high * 0.8,
            low: item.low * 0.8,
            close: item.close * 0.8,
          })),
        };
      case "nest":
        return {
          ...tokenData,
          name: "Nest",
          symbol: "eggs",
          tokenName: "NEST",
          backingToken: "EGGS",
          backingTitle: "Eggs",
          price:
            tokenData.chartData[tokenData.chartData.length - 1].close * 1.2,
          priceChange24h: Math.abs(tokenData.priceChange24h),
          chartData: tokenData.chartData.map((item) => ({
            ...item,
            open: item.open * 1.2,
            high: item.high * 1.2,
            low: item.low * 1.2,
            close: item.close * 1.2,
          })),
        };
      case "eggs":
        return {
          ...tokenData,
          name: "Eggs",
          symbol: "sonic",
          tokenName: "EGGS",
          backingToken: "S",
          backingTitle: "Sonic",
          price:
            tokenData.chartData[tokenData.chartData.length - 1].close * 0.6,
          priceChange24h: tokenData.priceChange24h * 0.5,
          chartData: tokenData.chartData.map((item) => ({
            ...item,
            open: item.open * 0.6,
            high: item.high * 0.6,
            low: item.low * 0.6,
            close: item.close * 0.6,
          })),
        };
      default:
        return tokenData;
    }
  };
  return (
    <Container maxWidth={false} sx={{ py: 4, width: "100%" }}>
      <Grid container spacing={3}>
        {/* Main token card */}

        {/* Compact cards in a row */}
        <Grid item xs={12}>
          {expandedCard ? (
            // Two rows when expanded: expanded card on top, others below
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* First row: Expanded card */}
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "1200px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TokenCard
                  tokenData={getCardData(expandedCard)}
                  isLoading={isLoading}
                  showVolume={false}
                  defaultTimeframe={
                    expandedCard === "yolk"
                      ? "24h"
                      : expandedCard === "nest"
                      ? "30d"
                      : "7d"
                  }
                  compact={true}
                  isExpanded={true}
                  activeTab={cardTabs[expandedCard]}
                  onTabChange={(tab) => handleTabChange(expandedCard, tab)}
                  onExpandChange={(expanded, tab) =>
                    handleExpandChange(expandedCard, expanded, tab)
                  }
                  onTrade={() => console.log(`Trade ${expandedCard}`)}
                  onLend={() => console.log(`Lend ${expandedCard}`)}
                  onLeverage={() => console.log(`Leverage ${expandedCard}`)}
                />
              </Box>

              {/* Second row: Non-expanded cards */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {cardOrder
                  .filter((cardId) => cardId !== expandedCard)
                  .map((cardId) => (
                    <TokenCard
                      key={cardId}
                      tokenData={getCardData(cardId)}
                      isLoading={isLoading}
                      showVolume={false}
                      defaultTimeframe={
                        cardId === "yolk"
                          ? "24h"
                          : cardId === "nest"
                          ? "30d"
                          : "7d"
                      }
                      compact={true}
                      isExpanded={false}
                      onExpandChange={(expanded, tab) =>
                        handleExpandChange(cardId, expanded, tab)
                      }
                      onTrade={() => console.log(`Trade ${cardId}`)}
                      onLend={() => console.log(`Lend ${cardId}`)}
                      onLeverage={() => console.log(`Leverage ${cardId}`)}
                    />
                  ))}
              </Box>
            </Box>
          ) : (
            // Single row when no card is expanded
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {cardOrder.map((cardId) => (
                <TokenCard
                  key={cardId}
                  tokenData={getCardData(cardId)}
                  isLoading={isLoading}
                  showVolume={false}
                  defaultTimeframe={
                    cardId === "yolk" ? "24h" : cardId === "nest" ? "30d" : "7d"
                  }
                  compact={true}
                  isExpanded={false}
                  activeTab={cardTabs[cardId]}
                  onTabChange={(tab) => handleTabChange(cardId, tab)}
                  onExpandChange={(expanded, tab) =>
                    handleExpandChange(cardId, expanded, tab)
                  }
                  onTrade={() => console.log(`Trade ${cardId}`)}
                  onLend={() => console.log(`Lend ${cardId}`)}
                  onLeverage={() => console.log(`Leverage ${cardId}`)}
                />
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
