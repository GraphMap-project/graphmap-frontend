import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

import { useAuth } from '@/core/context/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="error">
          No user information available
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6">
        <Typography variant="h3" className="text-primary font-bold mb-2">
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome to your admin panel
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg">
            <CardContent>
              <Box className="flex items-center gap-4 mb-4">
                <Avatar
                  sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
                  className="text-4xl"
                >
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h5" className="font-semibold">
                    {user.name || 'Admin User'}
                  </Typography>
                  <Chip
                    label={user.is_superuser ? 'Super Admin' : 'Admin'}
                    color="primary"
                    size="small"
                    icon={<AdminPanelSettingsIcon />}
                    className="mt-1"
                  />
                </Box>
              </Box>

              <Divider className="my-4" />

              <Box className="space-y-3">
                <Box className="flex items-center gap-2">
                  <EmailIcon color="action" />
                  <Typography variant="body1">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Last login: {new Date().toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Card (placeholder for future features) */}
        <Grid item xs={12}>
          <Card className="shadow-lg">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                Quick Stats
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-4 bg-blue-50 rounded-lg">
                    <Typography variant="h4" className="text-primary font-bold">
                      0
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average Time
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-4 bg-green-50 rounded-lg">
                    <Typography variant="h4" className="text-green-600 font-bold">
                      0
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Saved Locations
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box className="text-center p-4 bg-purple-50 rounded-lg">
                    <Typography variant="h4" className="text-purple-600 font-bold">
                      0 km
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Distance
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPage;
