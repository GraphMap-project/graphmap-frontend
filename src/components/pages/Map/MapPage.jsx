import { useState } from 'react';

import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

import { AddMarker } from '.';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';

import { SideMenu } from '@/components/ui';

import { useAppContext } from '@/core/context/AppContext';
import RouteService from '@/core/service/RouteService';
import { cn } from '@/core/utils';

import { endIcon, intermediateIcon, startIcon } from './constants/mapIcons';

import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';

const ukraineBounds = [
  [44.0, 22.0], // Southwest corner (latitude, longitude)
  [52.5, 40.2], // Northeast corner (latitude, longitude)
];

const MapPage = () => {
  const { coords, setStartCoords, setEndCoords, clearCoords } = useAppContext();
  const [markers, setMarkers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [intermediatePoints, setIntermediatePoints] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [threats, setThreats] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrawCreate = e => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    const coordinates = geojson.geometry.coordinates[0]; // [ [lng, lat], ... ]

    const latlngs = coordinates.map(([lng, lat]) => ({ lat, lng }));
    setThreats(prev => [...prev, latlngs]);
  };

  const handleDrawDelete = () => {
    setThreats([]);
  };

  const handleAddMarker = latlng => {
    const newMarkers = [...markers, latlng];

    if (markers.length < 2) {
      setMarkers(newMarkers);
    }

    if (newMarkers.length === 1) {
      setStartCoords(latlng);
      setSidebarOpen(true);
    } else if (newMarkers.length === 2) {
      setEndCoords(latlng);
    } else {
      // Если есть промежуточная точка без координат, заполняем её
      const emptyIndex = intermediatePoints.findIndex(point => !point.lat && !point.lng);
      if (emptyIndex !== -1) {
        const updatedPoints = [...intermediatePoints];
        updatedPoints[emptyIndex] = latlng;
        setIntermediatePoints(updatedPoints);
      }
    }
  };

  const addIntermediatePoint = () => {
    // Проверяем, есть ли уже пустая промежуточная точка
    const hasEmptyPoint = intermediatePoints.some(point => !point.lat && !point.lng);
    if (!hasEmptyPoint) {
      setIntermediatePoints([...intermediatePoints, { lat: '', lng: '' }]);
    }
  };

  const clearMarkers = () => {
    setMarkers([]);
    clearCoords();
    setSidebarOpen(false);
    setIntermediatePoints([]);
    setRoutePath([]);
    setRouteDistance(null);
  };

  const getShortestPath = async () => {
    if (markers.length === 0) {
      return;
    }
    setIsLoading(true);
    try {
      const data = {
        algorithm: 'dijkstra',
        start_point: [markers[0].lat, markers[0].lng],
        intermediate_points: intermediatePoints.map(point => [point.lat, point.lng]),
        end_point: [markers[1].lat, markers[1].lng],
        threats: threats.map(zone => zone.map(coord => [coord.lat, coord.lng])),
      };

      console.log('Sending coordinates:', data);

      const response = await RouteService.buildRoute(data);
      setRoutePath(response.route);
      setRouteDistance(response.distance);
    } catch (error) {
      console.error('Error sending coordinates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex h-[85vh] flex-col relative">
      <SideMenu
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        coordinates={coords}
        intermediatePoints={intermediatePoints}
      >
        <IconButton aria-label="addPoint" onClick={addIntermediatePoint}>
          <AddIcon />
          <Typography className="text-primary">Додати проміжну точку</Typography>
        </IconButton>
        <Typography className="text-primary">
          Відстань маршруту: {routeDistance} км
        </Typography>
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
          Очистити маркери
        </Button>
      </SideMenu>
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
                polyline: false,
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
