import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: 'auto',
        backgroundColor: theme => theme.palette.primary.main,
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="body1">© 2024 GraphMap</Typography>
      <Typography variant="body2">All rights reserved</Typography>
    </Box>
  );
};

export default Footer;
