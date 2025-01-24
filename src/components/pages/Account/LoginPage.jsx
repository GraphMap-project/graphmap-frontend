import { Box, Button, TextField, Typography } from '@mui/material';

const LoginPage = () => {
  return (
    <Box className="flex justify-center items-center h-screen bg-gray-100">
      <Box className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Typography variant="h4" className="mb-6 text-center text-primary">
          Login
        </Typography>
        <form className="space-y-4">
          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            className="bg-gray-50"
          />
          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            className="bg-gray-50"
          />
          {/* Register Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4 bg-primary hover:bg-primary-dark text-white"
          >
            Register
          </Button>
        </form>
        {/* Login Link */}
        <Typography variant="body2" className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-primary hover:underline">
            Register
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
