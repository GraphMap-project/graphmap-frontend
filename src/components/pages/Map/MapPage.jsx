import { useEffect, useState } from 'react';

import { MapContainer, Marker, Polygon, Polyline, TileLayer } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

import { AddMarker, SaveRouteDialog } from '.';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RouteIcon from '@mui/icons-material/Route';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import { SideMenu } from '@/components/ui';

import { useAppContext } from '@/core/context/AppContext';
import { useRoute } from '@/core/context/RouteContext';
import RouteService from '@/core/service/RouteService';
import { cn } from '@/core/utils';

import { endIcon, intermediateIcon, startIcon } from './constants/mapIcons';
import { getLandmarkName } from './utils/geolocationUtils';

import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';

const ukraineBounds = [
  [44.0, 22.0], // Southwest corner (latitude, longitude)
  [52.5, 40.2], // Northeast corner (latitude, longitude)
];

const MapPage = () => {
  const { coords, setStartCoords, setEndCoords, clearCoords } = useAppContext();
  const { selectedRoute } = useRoute();

  const [markers, setMarkers] = useState([]);
  // Point names
  const [startPointName, setStartPointName] = useState('');
  const [intermediatePointNames, setIntermediatePointNames] = useState([]);
  const [endPointName, setEndPointName] = useState('');

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Intermediate points
  const [intermediatePoints, setIntermediatePoints] = useState([]);
  // Threats
  const [threats, setThreats] = useState([]);

  // Route and distance
  const [routePath, setRoutePath] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // File saving
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [routeId, setRouteId] = useState(null);

  // Algorithm selection
  const [algorithm, setAlgorithm] = useState('alt');

  // Save route dialog
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    if (selectedRoute) {
      if (selectedRoute.start_point && selectedRoute.end_point) {
        setMarkers([
          { lat: selectedRoute.start_point[0], lng: selectedRoute.start_point[1] },
          { lat: selectedRoute.end_point[0], lng: selectedRoute.end_point[1] },
        ]);
        setStartCoords({
          lat: selectedRoute.start_point[0],
          lng: selectedRoute.start_point[1],
        });
        setEndCoords({
          lat: selectedRoute.end_point[0],
          lng: selectedRoute.end_point[1],
        });
      }

      // Set intermediate points
      setIntermediatePoints(
        (selectedRoute.intermediate_points || []).map(([lat, lng]) => ({ lat, lng })),
      );
      // Set threats
      const threatZones = (selectedRoute.threats || []).map(zone =>
        zone.map(([lat, lng]) => ({ lat, lng })),
      );
      setThreats(threatZones);

      // Set route path and distance
      setRoutePath(selectedRoute.route_coords || []);
      setRouteDistance(selectedRoute.distance_km || null);

      // Optionally set route id and open sidebar
      setRouteId(selectedRoute.id || null);
      setSidebarOpen(true);

      // Optionally clear point names if not available
      setStartPointName('');
      setEndPointName('');
      setIntermediatePointNames([]);
    }
  }, [selectedRoute]);

  const handleDrawCreate = e => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    const type = geojson.geometry.type;

    let latlngs = [];

    if (type === 'Polygon') {
      const coordinates = geojson.geometry.coordinates[0]; // [ [lng, lat], ... ]
      latlngs = coordinates.map(([lng, lat]) => ({ lat, lng }));
    } else if (type === 'LineString') {
      const coordinates = geojson.geometry.coordinates; // [ [lng, lat], ... ]
      latlngs = coordinates.map(([lng, lat]) => ({ lat, lng }));
    }

    if (latlngs.length > 0) {
      setThreats(prev => [...prev, latlngs]);
    }
  };

  const handleDrawDelete = () => {
    setThreats([]);
  };

  const handleAddMarker = async latlng => {
    const newMarkers = [...markers, latlng];
    const landmarkName = await getLandmarkName(latlng.lat, latlng.lng);

    console.log(landmarkName);

    if (markers.length < 2) {
      setMarkers(newMarkers);
    }

    if (newMarkers.length === 1) {
      setStartCoords(latlng);
      setStartPointName(landmarkName);
      setSidebarOpen(true);
    } else if (newMarkers.length === 2) {
      setEndCoords(latlng);
      setEndPointName(landmarkName);
    } else {
      // Если есть промежуточная точка без координат, заполняем её
      const emptyIndex = intermediatePoints.findIndex(point => !point.lat && !point.lng);
      if (emptyIndex !== -1) {
        const updatedPoints = [...intermediatePoints];
        updatedPoints[emptyIndex] = latlng;
        setIntermediatePoints(updatedPoints);
        const updatedNames = [...intermediatePointNames];
        updatedNames[emptyIndex] = landmarkName;
        setIntermediatePointNames(updatedNames);
      }
    }
  };

  const addIntermediatePoint = () => {
    // Проверяем, есть ли уже пустая промежуточная точка
    const hasEmptyPoint = intermediatePoints.some(point => !point.lat && !point.lng);
    if (!hasEmptyPoint) {
      setIntermediatePoints([...intermediatePoints, { lat: '', lng: '' }]);
      setIntermediatePointNames([...intermediatePointNames, '']);
    }
  };

  const clearMarkers = () => {
    setMarkers([]);
    clearCoords();
    setSidebarOpen(false);
    setIntermediatePoints([]);
    setRoutePath([]);
    setRouteDistance(null);
    setStartPointName('');
    setEndPointName('');
    setIntermediatePointNames([]);
    setRouteId(null);
    setThreats([]);
  };

  const getShortestPath = async () => {
    if (markers.length === 0) {
      return;
    }
    setIsLoading(true);
    try {
      const data = {
        algorithm: algorithm,
        start_point: [markers[0].lat, markers[0].lng],
        intermediate_points: intermediatePoints.map(point => [point.lat, point.lng]),
        end_point: [markers[1].lat, markers[1].lng],
        threats: threats.map(zone => zone.map(coord => [coord.lat, coord.lng])),
      };

      console.log('Sending coordinates:', data);

      const response = await RouteService.buildRoute(data);
      setRoutePath(response.route);
      setRouteDistance(response.distance);

      setRouteId(response.route_id);
    } catch (error) {
      console.error('Error sending coordinates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    if (!routeId) return;

    setIsFileLoading(true);

    try {
      const response = await RouteService.generateRouteFile(routeId);
      const blob = new Blob([response], { type: 'text/plain' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'route.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating file:', error);
    } finally {
      setIsFileLoading(false);
    }
  };

  const handleOpenSaveDialog = () => {
    // Only open if there's a valid routeId
    if (routeId) {
      setSaveDialogOpen(true);
    }
  };

  const handleCloseSaveDialog = success => {
    setSaveDialogOpen(false);
    if (success) {
      // Optionally show success notification
      console.log('Route saved successfully');
    }
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showSuccessSnackbar = message => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const showErrorSnackbar = message => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  return (
    <Box className="flex h-[85vh] flex-col relative">
      <SideMenu open={sidebarOpen}>
        <Box className="flex justify-between items-center w-full mb-[2px]">
          <Typography variant="h6">Меню</Typography>

          {/* Button for saving a route */}
          <Box className="flex items-center space-x-1">
            <IconButton
              onClick={handleOpenSaveDialog}
              disabled={!routeId}
              title="Зберегти в профілі"
            >
              <SaveIcon />
            </IconButton>
            {/* Button for downloading a route file */}
            <IconButton
              onClick={handleDownloadFile}
              disabled={!routeId || isFileLoading}
              title="Завантажити файл маршруту"
            >
              {isFileLoading ? (
                <CircularProgress size={20} className="text-black" />
              ) : (
                <FileDownloadIcon />
              )}
            </IconButton>
          </Box>
        </Box>

        {/* Текстовые поля для координат */}
        <Box className="flex-1 overflow-y-auto">
          <TextField
            label="Початкова точка (широта, довгота)"
            value={startPointName || coords.start}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
          />

          {intermediatePoints.map((point, index) => (
            <TextField
              key={index}
              label={`Проміжна точка ${index + 1} (широта, довгота)`}
              value={intermediatePointNames[index] || `${point.lat}, ${point.lng}`}
              variant="outlined"
              fullWidth
              margin="normal"
              disabled
            />
          ))}

          <TextField
            label="Кінцева точка (широта, довгота)"
            value={endPointName || coords.end}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
          />
          <IconButton
            aria-label="addPoint"
            onClick={addIntermediatePoint}
            className="mb-2"
          >
            <AddIcon />
            <Typography className="text-primary">Додати проміжну точку</Typography>
          </IconButton>
          {/* Список алгоритмов */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="algorithm-select-label">Алгоритм</InputLabel>
            <Select
              labelId="algorithm-select-label"
              value={algorithm}
              label="Алгоритм"
              onChange={e => setAlgorithm(e.target.value)}
            >
              <MenuItem value="dijkstra">Dijkstra</MenuItem>
              <MenuItem value="alt">ALT</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* ------------------------------ */}
        {routeDistance !== null && (
          <Typography className="text-primary flex items-center gap-1">
            <RouteIcon fontSize="small" />
            Відстань: {routeDistance} км
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={getShortestPath}
          className="bg-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={20} className="text-white" />
          ) : (
            'Побудувати маршрут'
          )}
        </Button>
        <Button
          variant="contained"
          onClick={clearMarkers}
          className={cn(
            'bg-red_custom text-white transition-all duration-200',
            isLoading && 'opacity-50 cursor-not-allowed',
          )}
          disabled={isLoading}
        >
          Очистити
        </Button>
      </SideMenu>
      {/* Save Route Dialog */}
      <SaveRouteDialog
        open={saveDialogOpen}
        onClose={handleCloseSaveDialog}
        routeId={routeId}
        onSuccess={showSuccessSnackbar}
        onError={showErrorSnackbar}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box
        className={cn(
          'flex-1 transition-all duration-300',
          sidebarOpen ? 'ml-[250px]' : 'ml-0',
        )}
      >
        <MapContainer
          center={[48.3794, 31.1656]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          maxBounds={ukraineBounds}
          maxBoundsViscosity={1.0}
          minZoom={6}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <AddMarker onAddMarker={handleAddMarker} />

          {markers.map((position, index) => (
            <Marker
              key={index}
              position={position}
              icon={index === 0 ? startIcon : endIcon}
            />
          ))}

          {/* Промежуточные маркеры */}
          {intermediatePoints.map(
            (point, index) =>
              point.lat &&
              point.lng && (
                <Marker
                  key={`intermediate-${index}`}
                  position={point}
                  icon={intermediateIcon}
                />
              ),
          )}

          {threats.map((zone, index) => (
            <Polygon
              key={`threat-${index}`}
              positions={zone}
              pathOptions={{
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.3,
              }}
            />
          ))}

          {routePath.length > 0 && (
            <Polyline positions={routePath} pathOptions={{ color: 'blue', weight: 2 }} />
          )}

          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleDrawCreate}
              onDeleted={handleDrawDelete}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: true,
                polygon: {
                  allowIntersection: false,
                  showArea: false,
                  shapeOptions: {
                    color: 'red',
                  },
                },
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapPage;
