import { useEffect, useState } from 'react';

import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import AuthService from '@/core/service/AuthService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const [token] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setErrorMessages(['Reset token is missing or invalid.']);
    }
  }, [token]);

  const handleCloseSnack = (e, reason) => {
    if (reason === 'clickaway') return;
    setSnack(s => ({ ...s, open: false }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessages([]);

    // Client-side validation
    const clientErrors = [];
    if (!token) clientErrors.push('Missing token');
    if (newPassword.length < 8)
      clientErrors.push('Password must be at least 8 characters');
    if (newPassword !== confirm) clientErrors.push('Passwords do not match');

    if (clientErrors.length > 0) {
      setErrorMessages(clientErrors);
      return;
    }

    setLoading(true);
    try {
      await AuthService.resetPassword({ token, new_password: newPassword });
      setSnack({
        open: true,
        message: 'Password reset successfully. Redirecting to login...',
        severity: 'success',
      });
      setTimeout(() => navigate('/login'), 1400);
    } catch (error) {
      // Handle backend validation errors
      const messages = error.messages || [error.message || 'Failed to reset password'];
      setErrorMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-100">
      <Box className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Typography variant="h4" className="mb-6 text-center text-primary">
          Reset Password
        </Typography>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New password"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="bg-gray-50"
            required
          />
          <TextField
            fullWidth
            label="Confirm password"
            type="password"
            variant="outlined"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="bg-gray-50"
            required
          />

          {/* Error Messages */}
          {errorMessages.length > 0 && (
            <Alert severity="error" className="mt-4">
              {errorMessages.length === 1 ? (
                <Typography variant="body2">{errorMessages[0]}</Typography>
              ) : (
                <>
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
                </>
              )}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4 bg-primary hover:bg-primary-dark text-white"
            disabled={loading || !token}
          >
            {loading ? 'Resetting password...' : 'Reset Password'}
          </Button>
        </form>

        <Typography variant="body2" className="mt-4 text-center text-gray-600">
          Remember your password?{' '}
          <RouterLink to="/login" className="text-primary hover:underline">
            Login
          </RouterLink>
        </Typography>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword;
