import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material';

import AuthService from '@/core/service/AuthService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleCloseSnack = (e, reason) => {
    if (reason === 'clickaway') return;
    setSnack(s => ({ ...s, open: false }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { message } = await AuthService.forgotPassword({ email });

      setSnack({
        open: true,
        message: message,
        severity: 'success',
      });
      setEmail('');
      setTimeout(() => navigate('/login'), 1400);
    } catch (err) {
      setSnack({
        open: true,
        message: err.message || 'Failed to request reset',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: 360, mx: 'auto', mt: 6 }}>
      <Typography variant="h6" gutterBottom>
        Forgot password
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" fullWidth disabled={loading}>
        {loading ? 'Sending…' : 'Send reset link'}
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

export default ForgotPassword;
