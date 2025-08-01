import React from "react";
import { Card, Typography, Box, Skeleton } from "@mui/material";
import { DivideIcon as LucideIcon } from "lucide-react";
import { nFormatter } from "../../utils/formatters";
import { useWSonicPrice } from "../../hooks/useWSonicPrice";
import useConverter from "../../hooks/useConverter";
import { formatEther, parseEther } from "viem";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  isLoading?: boolean;
  prefix?: string;
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  isLoading = false,
  prefix = "",
  suffix = "",
}) => {
  const { price } = useWSonicPrice();
  const { sonic: _collateralInSonic } = useConverter(
    parseEther(value.toString())
  );

  const collateralInSonic = Number(
    formatEther(_collateralInSonic || BigInt(0))
  );
  return (
    <Card
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          backgroundColor: color,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <Icon size={24} color={color} />
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </Box>

      {isLoading ? (
        <Skeleton variant="text" width="80%" height={40} />
      ) : suffix !== " S" ? (
        <>
          <Typography variant="h4" sx={{ mt: "auto" }}>
            {prefix}
            {typeof value === "number" ? nFormatter(value, 2) : value}
            {suffix}
          </Typography>
          <Typography variant="body1" sx={{ mt: "auto" }}>
            $
            {typeof value === "number"
              ? nFormatter(collateralInSonic * (price || 0), 2)
              : value}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h4" sx={{ mt: "auto" }}>
            $
            {typeof value === "number"
              ? nFormatter(value * (price || 0), 2)
              : value}
          </Typography>
          <Typography variant="body1" sx={{ mt: "auto" }}>
            {prefix}
            {typeof value === "number" ? nFormatter(value, 2) : value}
            {suffix}
          </Typography>
        </>
      )}
    </Card>
  );
};
