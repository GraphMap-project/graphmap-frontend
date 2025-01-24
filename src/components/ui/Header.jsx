import { NavLink } from 'react-router-dom';

import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" className="bg-primary h-[10%] flex justify-center">
      <Toolbar>
        <Typography variant="h6" component="div" className="grow">
          <Link component={NavLink} to="/" underline="none" className="text-white">
            GraphMap
          </Link>
        </Typography>
        <Box className="flex space-x-4">
          <Button
            variant="outlined"
            color="secondary"
            className="border-secondary text-secondary hover:bg-secondary hover:text-white"
            component={NavLink}
            to="/login"
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            component={NavLink}
            className="border-secondary text-secondary hover:bg-secondary hover:text-white"
            to="/register"
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
