import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Galerija. Created by Eligijus Bendikas
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: { xs: 1, sm: 0 },
            }}
          >
            <EmailIcon sx={{ mr: 1, fontSize: '1rem' }} />
            <Link
              href="mailto:eligijus.bendikas@gmail.com"
              color="inherit"
              underline="hover"
            >
              eligijus.bendikas@gmail.com
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
