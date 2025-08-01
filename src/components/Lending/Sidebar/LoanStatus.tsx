import React from 'react';
import { Chip } from '@mui/material';
import type { LoanStatus as Status } from './types';

interface LoanStatusProps {
  status: Status;
}

export const LoanStatus: React.FC<LoanStatusProps> = ({ status }) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'late':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getStatusColor(status)}
      size="small"
    />
  );
};