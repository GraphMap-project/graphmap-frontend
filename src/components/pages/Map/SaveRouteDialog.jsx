import { useState } from 'react';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import RouteService from '@/core/service/RouteService';

const SaveRouteDialog = ({ open, onClose, routeId, onSuccess, onError }) => {
  const [routeName, setRouteName] = useState('');
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const handleSave = async () => {
    // Prevent saving if routeId is not provided or routeName is empty
    if (!routeId || !routeName.trim()) {
      return;
    }

    // Call the saveRoute method from RouteService
    setIsSaveLoading(true);
    try {
      await RouteService.saveRoute(routeId, routeName.trim());
      // Reset state and close dialog on success
      setRouteName('');
      onSuccess?.('Маршрут успішно збережено');
      onClose(true); // Pass true to indicate save success
      console.log('Route saved successfully');
    } catch (error) {
      console.error('Error saving route:', error);
      onError?.('Помилка при збереженні маршруту');
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleClose = () => {
    if (!isSaveLoading) {
      setRouteName('');
      onClose(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && routeName.trim() && !isSaveLoading) {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Зберегти маршрут</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Назва маршруту"
          type="text"
          fullWidth
          variant="outlined"
          value={routeName}
          onChange={e => setRouteName(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSaveLoading}
          placeholder="Введіть назву маршруту"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSaveLoading}>
          Скасувати
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!routeName.trim() || isSaveLoading}
          className="bg-primary"
        >
          {isSaveLoading ? (
            <CircularProgress size={20} className="text-white" />
          ) : (
            'Зберегти'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveRouteDialog;
