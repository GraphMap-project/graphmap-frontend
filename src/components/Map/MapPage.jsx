import { useState } from 'react';

import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, IconButton, Typography } from '@mui/material';
import L from 'leaflet';

import { axiosInstance } from '@/core/api';
import { useAppContext } from '@/core/context/AppContext';
import { cn } from '@/core/utils';

import blueMarker from '../../assets/markers/marker_blue.png';
import intermediateMarker from '../../assets/markers/marker_intermediate.png';
import redMarker from '../../assets/markers/marker_red.png';
import { SideMenu } from '../SideMenu/SideMenu';

import 'leaflet/dist/leaflet.css';

const ukraineBounds = [
  [44.0, 22.0], // Southwest corner (latitude, longitude)
  [52.5, 40.2], // Northeast corner (latitude, longitude)
];

const startIcon = new L.Icon({
  iconUrl: blueMarker,
  // iconSize: [25, 41],
  iconAnchor: [25, 50],
  popupAnchor: [0, -41],
});

const endIcon = new L.Icon({
  iconUrl: redMarker,
  // iconSize: [25, 41],
  iconAnchor: [25, 50],
  popupAnchor: [0, -41],
});

const intermediateIcon = new L.Icon({
  iconUrl: intermediateMarker,
  iconAnchor: [15, 30],
});

const AddMarker = ({ onAddMarker }) => {
  // eslint-disable-next-line no-unused-vars
  const map = useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Проверка, что клик внутри Украины через API Nominatim
      const isInsideUkraine = await checkIfInsideUkraine(lat, lng);

      if (isInsideUkraine) {
        onAddMarker(e.latlng);
      } else {
        // Показывать alert, если клик за пределами Украины
        alert('Please place the marker within the borders of Ukraine.');
      }
    },
  });

  // Функция для проверки, находится ли точка в Украине
  const checkIfInsideUkraine = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const country_code = data?.address?.country_code;

      return country_code === 'ua';
    } catch (error) {
      console.error('Error checking location:', error);
      return false;
    }
  };

  return null;
};

const MapPage = () => {
  const { coords, setStartCoords, setEndCoords, clearCoords } = useAppContext();
  const [markers, setMarkers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [intermediatePoints, setIntermediatePoints] = useState([]);

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
  };

  const getShortestPath = async () => {
    try {
      if (markers.length === 0) {
        console.log('No markers to send.');
        return;
      }

      const data = {
        start_point: [markers[0].lat, markers[0].lng],
        intermediate_points: intermediatePoints.map(point => [point.lat, point.lng]),
        end_point: [markers[1].lat, markers[1].lng],
      };

      console.log('Sending coordinates:', data);
      axiosInstance.post('/shortest_path', data).then(response => {
        console.log('Response from server:', response.data);
      });
    } catch (error) {
      console.error('Error sending coordinates:', error);
    }
  };

  return (
    <Box className="flex h-[90vh] flex-col relative">
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
        <Button variant="contained" onClick={getShortestPath} className="bg-primary">
          Побудувати маршрут
        </Button>
        <Button variant="contained" onClick={clearMarkers} className="bg-primary">
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
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapPage;
