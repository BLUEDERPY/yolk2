import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
  Card,
  Chip,
  Tooltip,
} from "@mui/material";
import { formatEther } from "viem";
import {
  Clock,
  Coins,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";
import { useEggsData } from "../../providers/data-provider";
import { nFormatter } from "../../utils/formatters";

interface LoanData {
  date: Date;
  amount: bigint;
  collateral: bigint;
}

interface LoanExpirationTableProps {
  loanData: {
    [key: number]: [bigint, bigint] | undefined;
  };
}

export const LoanExpirationTable: React.FC<LoanExpirationTableProps> = ({
  loanData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<"date" | "amount">("date");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const { backing, totalSupply, lastPrice } = useEggsData();

  const handleSort = (property: "date" | "amount") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const now = new Date();

  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  function rollingSumMap(map, property) {
    let borrowSum = BigInt(0);
    let colSum = BigInt(0);
    const result = new Array();
    if (backing && totalSupply) {
      map.forEach((value) => {
        if (value) {
          colSum += value.collateral;
          borrowSum += value.amount;
        }

        const newPrice =
          (BigInt(1e18) * (backing - borrowSum)) / (totalSupply - colSum);
        result.push({
          ...value,
          newPrice,
          priceChange:
            (Number(formatEther(newPrice)) /
              Number(formatEther(lastPrice || "1")) -
              1) *
            100,
        });
      });
    }
    return result;
  }

  const _flattenedData = Object.entries(loanData)
    .filter(([_, loans]) => loans !== undefined)
    .map(([day, loans]) => ({
      date: new Date(today.getTime() + Number(day) * 24 * 60 * 60 * 1000),
      amount: loans![0],
      collateral: loans![1],
    }));
  const flattenedData = rollingSumMap(_flattenedData, "collateral");

  const sortedData = flattenedData.sort((a, b) => {
    if (orderBy === "date") {
      return order === "asc"
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    }
    return order === "asc"
      ? Number(a.amount) - Number(b.amount)
      : Number(b.amount) - Number(a.amount);
  });

  const getExpiryStatus = (date: Date) => {
    const _d = new Date(today.getTime() * 24 * 60 * 60 * 1000);
    const daysUntilExpiry = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) - 1
    );
    if (daysUntilExpiry <= 0) {
      return <Box fontSize={"35px!important"}>🍳</Box>;
    } else if (daysUntilExpiry <= 1) {
      return <Box fontSize={"35px!important"}>🐣</Box>;
    } else if (daysUntilExpiry <= 2) {
      return <Box fontSize={"35px!important"}>⏲️</Box>;
    } else if (daysUntilExpiry <= 3) {
      return <Box fontSize={"35px!important"}>🥚</Box>;
    }

    return <Box fontSize={"35px!important"}>🪺</Box>;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 5) return "#4CAF50";
    if (change > 0) return "#81C784";
    if (change < -5) return "#F44336";
    if (change < 0) return "#E57373";
    return "text.primary";
  };

  if (sortedData.length === 0) {
    return (
      <Card sx={{ width: "100%", p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upcoming Loan Expirations
        </Typography>
        <Alert severity="info">No upcoming loan expirations</Alert>
      </Card>
    );
  }

  return (
    <Card sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6">Upcoming Loan Expirations</Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={() => handleSort("date")}
                >
                  Expiration Date
                </TableSortLabel>
              </TableCell>
              {!isMobile && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "amount"}
                    direction={orderBy === "amount" ? order : "asc"}
                    onClick={() => handleSort("amount")}
                  >
                    Borrowed Amount
                  </TableSortLabel>
                </TableCell>
              )}
              <TableCell>Collateral</TableCell>
              <Tooltip title="This price may vary if users close thier positions before 7pm EST">
                <TableCell>Price After (EGGS/S) {"*"}</TableCell>
              </Tooltip>
              {!isMobile && <TableCell align="right">Status</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const status = getExpiryStatus(row.date);
                const priceColor = getPriceChangeColor(row.priceChange);
                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {!isMobile && <Clock size={16} />}
                        {row.date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Box>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography>
                            {nFormatter(Number(formatEther(row?.amount)), 2)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            S
                          </Typography>
                        </Box>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography>
                          {nFormatter(Number(formatEther(row?.collateral)), 2)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          EGGS
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: priceColor,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {row.priceChange > 0 ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          <Typography sx={{ fontWeight: "bold" }}>
                            {Number(formatEther(row?.newPrice)).toFixed(8)}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${
                            row.priceChange > 0 ? "+" : ""
                          }${row.priceChange.toFixed(4)}%`}
                          size="small"
                          sx={{
                            backgroundColor: `${priceColor}15`,
                            color: priceColor,
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    </TableCell>
                    {!isMobile && <TableCell align="right">{status}</TableCell>}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
