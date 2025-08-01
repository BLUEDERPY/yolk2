import React from 'react';
import { Link } from '@mui/material';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

export const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <Link
      href={href}
      sx={{
        color: 'grey.400',
        textDecoration: 'none',
        fontSize: '0.875rem',
        '&:hover': {
          color: 'primary.main',
        },
      }}
    >
      {children}
    </Link>
  );
}