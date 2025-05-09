import { useState } from 'react';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';

import { useAuth } from '@/core/context/AuthContext';
import AuthService from '@/core/service/AuthService';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages([]);

    try {
      const response = await AuthService.register({ email, password });
      login(response.access_token, response.refresh_token);
      window.location.href = '/';
    } catch (error) {
      const messages = error.messages || [error.message];
      setErrorMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-100">
      <Box className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Typography variant="h4" className="mb-6 text-center text-primary">
          Register
        </Typography>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-gray-50"
          />
          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-gray-50"
          />
          {/* Error Messages */}
          {errorMessages.length > 0 && (
            <Alert severity="error" className="mt-4">
              <Typography variant="subtitle2" className="font-semibold mb-1">
                Please correct the following errors:
              </Typography>
              <List dense disablePadding>
                {errorMessages.map((msg, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ErrorOutlineIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={msg}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}
          {/* Register Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4 bg-primary hover:bg-primary-dark text-white"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        {/* Login Link */}
        <Typography variant="body2" className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
