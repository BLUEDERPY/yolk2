import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeProvider/ThemeProvider';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  showTooltip = true 
}) => {
  const { mode, toggleTheme } = useTheme();

  const button = (
    <IconButton
      onClick={toggleTheme}
      size={size}
      sx={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'rotate(180deg)',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        },
      }}
    >
      {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
        {button}
      </Tooltip>
    );
  }

  return button;
};