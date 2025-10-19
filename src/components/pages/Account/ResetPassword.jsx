import { useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material';

import AuthService from '@/core/service/AuthService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const [token] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setSnack({ open: true, message: 'Reset token is missing.', severity: 'error' });
    }
  }, [token]);

  const handleCloseSnack = (e, reason) => {
    if (reason === 'clickaway') return;
    setSnack(s => ({ ...s, open: false }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token)
      return setSnack({ open: true, message: 'Missing token', severity: 'error' });
    if (newPassword.length < 8)
      return setSnack({
        open: true,
        message: 'Password must be at least 8 characters',
        severity: 'warning',
      });
    if (newPassword !== confirm)
      return setSnack({
        open: true,
        message: 'Passwords do not match',
        severity: 'warning',
      });

    setLoading(true);
    try {
      await AuthService.resetPassword({ token, new_password: newPassword });
      setSnack({
        open: true,
        message: 'Password reset successfully. Please login.',
        severity: 'success',
      });
      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      setSnack({
        open: true,
        message: err.message || 'Failed to reset password',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: 360, mx: 'auto', mt: 6 }}>
      <Typography variant="h6" gutterBottom>
        Reset password
      </Typography>

      {!token && (
        <Typography color="error" sx={{ mb: 2 }}>
          Missing or invalid reset token.
        </Typography>
      )}

      <TextField
        label="New password"
        type="password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Confirm password"
        type="password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" fullWidth disabled={loading || !token}>
        {loading ? 'Resetting…' : 'Reset password'}
      </Button>

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
