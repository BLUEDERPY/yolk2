import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import { FooterLogo } from './FooterLogo';
import { FooterLinks } from './FooterLinks';
import { FooterCopyright } from './FooterCopyright';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'grey.800',
        py: 2,
        mt: 'auto',
        width: '100%',
      }}
    >
      <Container maxWidth={false}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems="center"
          justifyContent="space-between"
        >
          <FooterLogo />
          <FooterLinks />
          <FooterCopyright />
        </Stack>
      </Container>
    </Box>
  );
}