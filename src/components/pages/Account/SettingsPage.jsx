import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { useAuth } from '@/core/context/AuthContext';
import { useRoute } from '@/core/context/RouteContext.jsx';
import AuthService from '@/core/service/AuthService';

const SettingsPage = () => {
  const { user } = useAuth();
  const { setSelectedRoute } = useRoute();

  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState([]);
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
    <div className="p-4">
      <h2 className="text-2xl mb-2">Settings</h2>
      {error && <p className="text-red-600">{error}</p>}
      {!error && (
        <>
          <p className="text-green-600">{message}</p>
          <div className="mt-6">
            <h3 className="text-xl mb-4">Saved Routes</h3>
            {routes.length === 0 && <p>No saved routes found.</p>}
            {routes.length > 0 && (
              <div className="grid gap-4">
                {routes.map((route, idx) => (
                  <Card key={route.id || idx} className="shadow-md">
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Typography variant="h6" component="div">
                          {route.name || `Route #${idx + 1}`}
                        </Typography>
                        <Stack direction="row" spacing={2} className="mt-2">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleShow(route.id)}
                          >
                            Show
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(route.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPage;
