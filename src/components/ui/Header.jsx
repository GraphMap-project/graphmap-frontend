import { AppBar, Box, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" className="bg-primary">
      <Toolbar>
        <Typography variant="h6" component="div" className="grow">
          GraphMap
        </Typography>
        <Box></Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
