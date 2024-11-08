import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Button, Typography, TextField } from '@mui/material';
import L from 'leaflet';
import axiosInstance from '../../Axios';
import redMarker from '../../assets/markers/marker_red.png';
import blueMarker from '../../assets/markers/marker_blue.png';

const ukraineBounds = [
  [44.0, 22.0], // Southwest corner (latitude, longitude)
  [52.5, 40.2], // Northeast corner (latitude, longitude)
];

const startIcon = new L.Icon({
  iconUrl: blueMarker,
  // iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const endIcon = new L.Icon({
  iconUrl: redMarker,
  // iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const AddMarker = ({ onAddMarker }) => {
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
  const [markers, setMarkers] = useState([]);
  const [coordinates, setCoordinates] = useState({ start: '', end: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddMarker = latlng => {
    const newMarkers = [...markers, latlng];

    if (markers.length < 2) {
      setMarkers(newMarkers);
    }
    // } else {
    //   // Если уже два маркера, заменяем самый старый
    //   setMarkers([markers[1], latlng]);
    // }

    if (newMarkers.length === 1) {
      setCoordinates(prev => ({
        ...prev,
        start: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
      }));
    } else if (newMarkers.length === 2) {
      setCoordinates(prev => ({
        ...prev,
        end: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
      }));
    }
  };

  const clearMarkers = () => {
    setMarkers([]);
    setCoordinates({ start: '', end: '' });
  };

  const getShortestPath = async () => {
    try {
      if (markers.length === 0) {
        console.log('No markers to send.');
        return;
      }

      const data = {
        start_point: [markers[0].lat, markers[0].lng],
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
    <Box
      sx={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Кастомное выдвигающееся меню */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '250px', // Меняем ширину для анимации
          backgroundColor: 'white',
          overflowX: 'hidden',
          transition: 'transform 0.3s ease', // Плавная анимация
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: sidebarOpen ? '2px 0 5px rgba(0,0,0,0.2)' : 'none',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between', // Располагает элементы по краям
            alignItems: 'center', // Выравнивание по вертикали
            width: '100%', // Чтобы контейнер растягивался на всю ширину
            mb: 2,
          }}
        >
          <Typography variant="h6">Меню</Typography>
          <Button onClick={() => setSidebarOpen(false)}> {'<<'} </Button>
        </Box>

        {/* Текстовые поля для координат */}
        <TextField
          label="Начальная точка (широта, долгота)"
          value={coordinates.start}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Конечная точка (широта, долгота)"
          value={coordinates.end}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          transition: 'margin-left 0.3s ease',
          marginLeft: sidebarOpen ? '250px' : '0',
        }}
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
        </MapContainer>
      </Box>

      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button variant="contained" onClick={() => setSidebarOpen(true)}>
          Открыть меню
        </Button>
        <Button variant="contained" onClick={getShortestPath}>
          Log Marker Coordinates
        </Button>
        <Button variant="contained" onClick={clearMarkers}>
          Clear Markers
        </Button>
      </Box>
    </Box>
  );
};

export default MapPage;
