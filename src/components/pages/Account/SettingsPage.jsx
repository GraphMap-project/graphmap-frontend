import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  CardActions,
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { useAuth } from '@/core/context/AuthContext';
import { useRoute } from '@/core/context/RouteContext.jsx';
import AuthService from '@/core/service/AuthService';

function DeleteIcon() {
  return null;
}

function ShowIcon() {
  return null;
}

const SettingsPage = () => {
  const { user } = useAuth();
  const { setSelectedRoute } = useRoute();

  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const fetchSettings = async () => {
      try {
        const response = await AuthService.requestWithAuth('account/settings');
        setMessage(`Welcome, ${response.email || 'user'}!`);
        const routesResponse = await AuthService.requestWithAuth('routes');
        setRoutes(routesResponse.routes || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, navigate]);

  const handleShow = async routeId => {
    try {
      const routeData = await AuthService.requestWithAuth(`routes/${routeId}`);
      // Optionally, store routeData in a global context or state for the map page
      // For now, just navigate to the map page
      setSelectedRoute(routeData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to load route.');
    }
  };
  const handleDelete = async routeId => {
    try {
      await AuthService.requestWithAuth(`routes/${routeId}`, 'DELETE');
      setRoutes(prev => prev.filter(r => r.id !== routeId));
    } catch (err) {
      setError(err.message || 'Failed to delete route.');
    }
  };

  return (
    <Box className="h-full overflow-y-auto">
      <Box className="p-6 max-w-3xl mx-auto">
        {loading && (
          <Box className="flex justify-center items-center mt-10">
            <CircularProgress />
            <Typography color="text.secondary" variant="body1">
              Завантаження маршрутів...
            </Typography>
          </Box>
        )}

        {!loading && (
          <>
            {error && (
              <Typography color="error" className="mt-4">
                {error}
              </Typography>
            )}
            {!error && (
              <>
                <Typography color="success.main" className="mt-2">
                  {message}
                </Typography>

                <Divider className="my-6" />

                <Typography variant="h6" gutterBottom>
                  Збережені маршрути
                </Typography>

                {routes.length === 0 && (
                  <Typography color="text.secondary">
                    Немає збережених маршрутів.
                  </Typography>
                )}
                {routes.length > 0 && (
                  <Stack spacing={2} className="mt-4">
                    {routes.map((route, idx) => (
                      <Card
                        key={route.id || idx}
                        elevation={3}
                        sx={{
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': { transform: 'scale(1.01)', boxShadow: 6 },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6">
                            {route.name || `Маршрут #${idx + 1}`}
                          </Typography>
                          {route.description && (
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                              {route.description}
                            </Typography>
                          )}
                        </CardContent>

                        <CardActions className="flex justify-end">
                          <Tooltip title="Показати маршрут">
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<ShowIcon />}
                              onClick={() => handleShow(route.id)}
                            >
                              Показати
                            </Button>
                          </Tooltip>
                          <Tooltip title="Видалити маршрут">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDelete(route.id)}
                            >
                              Видалити
                            </Button>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    ))}
                  </Stack>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SettingsPage;
