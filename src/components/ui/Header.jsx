import { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

  const handleSettings = () => {
    navigate('/settings');
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    // Перезавантажуємо сторінку при кліку на логотип
    window.location.href = '/';
  };

  return (
    <AppBar position="static" className="bg-primary">
      <Toolbar>
        <Typography variant="h6" component="div" className="grow">
          <Link
            component={NavLink}
            to="/"
            underline="none"
            className="text-white"
            onClick={handleLogoClick}
          >
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
                <MenuItem onClick={handleSettings}>Settings</MenuItem>
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
