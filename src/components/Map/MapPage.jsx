import { useState } from 'react';

import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import { Box, Button } from '@mui/material';
import L from 'leaflet';

import { useAppContext } from '@/core/context/AppContext';

import axiosInstance from '../../Axios';
import blueMarker from '../../assets/markers/marker_blue.png';
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
      setStartCoords(latlng);
    } else if (newMarkers.length === 2) {
      setEndCoords(latlng);
    }
  };

  const clearMarkers = () => {
    setMarkers([]);
    clearCoords();
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
      <SideMenu open={sidebarOpen} setOpen={setSidebarOpen} coordinates={coords}>
        <Button variant="contained" onClick={() => setSidebarOpen(true)}>
          Открыть меню
        </Button>
        <Button variant="contained" onClick={getShortestPath}>
          Log Marker Coordinates
        </Button>
        <Button variant="contained" onClick={clearMarkers}>
          Clear Markers
        </Button>
      </SideMenu>
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
    </Box>
  );
};

export default MapPage;
