import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';

const MapPage = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* MUI AppBar */}

      {/* Map Container */}
      <Box sx={{ flex: 1 }}>
        <MapContainer
          center={[49.018289224001, 31.351616456444525]} // Default coordinates
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapPage;
