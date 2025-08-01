import React from 'react';
import { Button } from '@mui/material';
import { ArrowDownUp } from 'lucide-react';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      onClick={onClick}
      disabled={disabled}
      startIcon={<ArrowDownUp size={16} />}
      sx={{
        py: 1.5,
        fontSize: "1rem",
        fontWeight: 600,
        borderRadius: 2,
      }}
    >
      Swap
    </Button>
  );
}