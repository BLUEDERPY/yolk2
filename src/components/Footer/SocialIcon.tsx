import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface SocialIconProps {
  iconSrc?: string;
  label: string;
  href: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ iconSrc, label, href }) => {
  const theme = useTheme();

  return (
    <Tooltip title={label}>
      <IconButton
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'grey.400',
          '&:hover': {
            color: 'primary.main',
            bgcolor: 'rgba(252, 156, 4, 0.08)',
          },
        }}
      >
        {iconSrc ? (
          <img 
            src={iconSrc} 
            alt={label}
            style={{ 
              width: 20, 
              height: 20,
              filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
            }}
          />
        ) : null}
      </IconButton>
    </Tooltip>
  );
};