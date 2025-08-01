import React from 'react';
import { Card } from '@mui/material';
import { LoanMetrics } from './LoanMetrics';

export const LoanSummarySidebar: React.FC = () => {
  return (
    <Card 
      sx={{ 
        p: 3,
        width: { xs: '100%', md: '320px' },
        height: 'fit-content'
      }}
    >
      <LoanMetrics />
    </Card>
  );
};