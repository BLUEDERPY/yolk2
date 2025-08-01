import React from "react";
import { Grid } from "@mui/material";
import { StatCard } from "./StatCard";
import { Wallet, Coins, TrendingUp, PieChart } from "lucide-react";
import { formatEther } from "viem";
import { useEggsData } from "../../providers/data-provider";

export const ProtocolMetrics = () => {
  const {
    totalBorrowed,
    totalCollateral,
    isMintedOut,
    backing,
    maxSupply,
    totalSupply,
  } = useEggsData();

  const metrics = [
    {
      title: "Total Borrowed",
      value: totalBorrowed ? Number(formatEther(totalBorrowed)) : 0,
      icon: Wallet,
      color: "#00d4b5",
      suffix: " S",
    },
    {
      title: "Eggs Burned",
      value:
        maxSupply && totalSupply
          ? Number(formatEther(maxSupply - totalSupply))
          : 0,
      icon: Coins,
      color: "#fc9c04",
      suffix: " EGGS",
    },
    {
      title: "Circulating Supply",
      value:
        totalSupply && totalCollateral
          ? Number(formatEther(totalSupply - totalCollateral))
          : 0,
      icon: TrendingUp,
      color: "#f44336",
      suffix: " EGGS",
    },
    {
      title: "TVL",
      value: backing ? Number(formatEther(backing)) : 0,
      icon: PieChart,
      color: "#9c27b0",
      suffix: " S",
    },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            isLoading={!metric.value && metric.title !== "Remaining Supply"}
            suffix={metric.suffix}
          />
        </Grid>
      ))}
    </Grid>
  );
};
