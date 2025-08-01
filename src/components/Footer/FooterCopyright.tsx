import React from 'react';
import { Typography } from '@mui/material';

export const FooterCopyright: React.FC = () => {
  return (
    <Typography
      variant="caption"
      sx={{ 
        color: 'grey.500',
        fontSize: '0.75rem'
      }}
    >
      © {new Date().getFullYear()} Eggs Finance
    </Typography>
  );
}