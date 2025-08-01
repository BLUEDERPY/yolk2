import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface HealthIndicatorProps {
  healthFactor: number;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({ healthFactor }) => {
  const getHealthColor = (health: number) => {
    if (health >= 2) return 'success';
    if (health >= 1.5) return 'warning';
    return 'error';
  };

  const getHealthStatus = (health: number) => {
    if (health >= 2) return 'Safe';
    if (health >= 1.5) return 'Caution';
    return 'At Risk';
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Position Health
      </Typography>
      <LinearProgress
        variant="determinate"
        value={Math.min((healthFactor / 3) * 100, 100)}
        color={getHealthColor(healthFactor)}
        sx={{ height: 8, borderRadius: 1 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Health Factor: {healthFactor.toFixed(2)}
        </Typography>
        <Typography variant="caption" color={getHealthColor(healthFactor)}>
          {getHealthStatus(healthFactor)}
        </Typography>
      </Box>
    </Box>
  );
};