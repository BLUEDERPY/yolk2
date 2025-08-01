import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import type { Payment } from "./types";

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Recent Payments
      </Typography>
      <List disablePadding>
        {payments.map((payment) => (
          <ListItem
            key={payment.id}
            disablePadding
            sx={{
              py: 1,
              borderBottom: 1,
              borderColor: "divider",
              "&:last-child": { border: 0 },
            }}
          >
            <ListItemText
              primary={formatCurrency(payment.amount) + " S"}
              secondary={formatDate(payment.date)}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
