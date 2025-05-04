import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';

import { useAuth } from '@/core/context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className="bg-primary h-[10%] flex justify-center">
      <Toolbar>
        <Typography variant="h6" component="div" className="grow">
          <Link component={NavLink} to="/" underline="none" className="text-white">
            GraphMap
          </Link>
        </Typography>

        <Box className="flex space-x-4">
          {user ? (
            <>
              <Avatar sx={{ cursor: 'pointer' }} onClick={handleAvatarClick}>
                {user.email[0]} {/* Отображаем первую букву имени пользователя */}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleAvatarClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
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
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
