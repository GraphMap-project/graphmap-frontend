import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Button } from '@mui/material';
import L from 'leaflet';
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

      console.log(data);

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

  const handleAddMarker = latlng => {
    if (markers.length < 2) {
      setMarkers([...markers, latlng]);
    }
    // } else {
    //   // Если уже два маркера, заменяем самый старый
    //   setMarkers([markers[1], latlng]);
    // }
  };

  const clearMarkers = () => {
    setMarkers([]);
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
      // Сделать API вызов для получения кратчайшего пути
    } catch (error) {
      console.error('Error sending coordinates:', error);
    }
  };

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
      {/* Map Container */}
      <Box sx={{ flex: 1 }}>
        <MapContainer
          center={[48.3794, 31.1656]} // Centered on Ukraine
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          maxBounds={ukraineBounds} // Set the bounds to Ukraine's area
          maxBoundsViscosity={1.0}
          minZoom={6}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <AddMarker onAddMarker={handleAddMarker} />
          {/* Render markers */}
          {markers.map((position, index) => (
            <Marker
              key={index}
              position={position}
              icon={index === 0 ? startIcon : endIcon} // Используем разные иконки для начальной и конечной точки
            />
          ))}
        </MapContainer>
      </Box>

      {/* Button to log coordinates */}
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
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
