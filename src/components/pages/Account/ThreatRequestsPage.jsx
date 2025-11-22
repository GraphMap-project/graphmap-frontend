import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Snackbar,
  Typography,
} from '@mui/material';

import { useAuth } from '@/core/context/AuthContext';
import { useRoute } from '@/core/context/RouteContext';
import ThreatService from '@/core/service/ThreatService';

const ThreatRequestsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { setPreviewThreat } = useRoute();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (authLoading) return;
    // Перевіряємо доступ користувача
    if (!user) {
      navigate('/login');
      return;
    }

    fetchRequests();
  }, [user, navigate, authLoading]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await ThreatService.getRequests();
      setRequests(data);
      setError('');
    } catch (err) {
      if (err.status === 403) {
        setSnackbar({
          open: true,
          message: 'У вас немає доступу до цієї сторінки',
          severity: 'error',
        });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(err.message || 'Помилка при завантаженні запитів');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async requestId => {
    try {
      await ThreatService.approveRequest(requestId);
      setSnackbar({
        open: true,
        message: 'Запит успішно схвалено',
        severity: 'success',
      });
      fetchRequests();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Помилка при схваленні запиту',
        severity: 'error',
      });
    }
  };

  const handleDecline = async requestId => {
    try {
      await ThreatService.declineRequest(requestId);
      setSnackbar({
        open: true,
        message: 'Запит успішно відхилено',
        severity: 'success',
      });
      fetchRequests();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Помилка при відхиленні запиту',
        severity: 'error',
      });
    }
  };

  const handlePreview = async request => {
    if (request.action === 'create' && request.location) {
      // Перетворюємо локацію в правильний формат для нової загрози
      const threat = {
        id: request.id,
        coords: request.location.map(([lat, lng]) => ({ lat, lng })),
        type: request.threat_type,
        description: request.description,
      };
      setPreviewThreat(threat);
      navigate('/');
    } else if (request.action === 'delete' && request.threat_id) {
      // Завантажуємо існуючу загрозу для передогляду
      try {
        const threats = await ThreatService.getAll();
        const threat = threats.find(t => t.id === request.threat_id);

        if (threat) {
          const formattedThreat = {
            id: threat.id,
            coords: threat.location.map(([lat, lng]) => ({ lat, lng })),
            type: threat.type,
            description: threat.description,
          };
          setPreviewThreat(formattedThreat);
          navigate('/');
        } else {
          setSnackbar({
            open: true,
            message: 'Загрозу не знайдено',
            severity: 'error',
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Помилка при завантаженні загрози',
          severity: 'error',
        });
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading || authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 2,
        my: 2,
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(135deg, #1976d2 40%, #64b5f6 100%)',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#e3eafc',
        },
      }}
    >
      <Typography variant="h4" gutterBottom>
        Запити на перевірку загроз
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {requests.length === 0 ? (
        <Typography>Немає запитів на перевірку</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {requests.map(request => (
            <Card key={request.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    {request.action === 'create'
                      ? 'Створення загрози'
                      : 'Видалення загрози'}
                  </Typography>
                  <Chip
                    label={request.action === 'create' ? 'CREATE' : 'DELETE'}
                    color={request.action === 'create' ? 'primary' : 'error'}
                  />
                </Box>

                {request.threat_type && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Тип:</strong> {request.threat_type}
                  </Typography>
                )}

                {request.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Опис:</strong> {request.description}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Дата створення:</strong>{' '}
                  {new Date(request.created_at).toLocaleString('uk-UA')}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handlePreview(request)}
                  >
                    Переглянути
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(request.id)}
                  >
                    Прийняти
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDecline(request.id)}
                  >
                    Відхилити
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ThreatRequestsPage;
