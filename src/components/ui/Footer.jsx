import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" className="py-2 mt-auto text-white text-center bg-primary">
      <Typography variant="body1">© 2024 GraphMap</Typography>
      <Typography variant="body2">All rights reserved</Typography>
    </Box>
  );
};

export default Footer;
