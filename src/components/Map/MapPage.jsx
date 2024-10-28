import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Button } from '@mui/material';
import L, { marker } from 'leaflet';

// Define bounds for Ukraine (approximate)
const ukraineBounds = [
  [44.0, 22.0], // Southwest corner (latitude, longitude)
  [52.5, 40.2], // Northeast corner (latitude, longitude)
];

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const AddMarker = ({ onAddMarker }) => {
  useMapEvents({
    click(e) {
      onAddMarker(e.latlng);
    },
  });
  return null;
};

const MapPage = () => {
  const [markers, setMarkers] = useState([]);

  const handleAddMarker = latlng => {
    if (markers.length < 2) {
      setMarkers([...markers, latlng]);
    } else {
      // If two markers already exist, replace the oldest one
      setMarkers([markers[1], latlng]);
    }
  };

  const logCoordinates = () => {
    if (markers.length === 0) {
      console.log('No markers added.');
    } else {
      markers.forEach((marker, index) => {
        console.log(
          `Marker ${index + 1}: Latitude: ${marker.lat}, Longitude: ${marker.lng}`,
        );
      });
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Map Container */}
      <Box sx={{ flex: 1 }}>
        <MapContainer
          center={[48.3794, 31.1656]} // Centered on Ukraine
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          maxBounds={ukraineBounds} // Set the bounds to Ukraine's area
          maxBoundsViscosity={1.0} // Prevents panning outside Ukraine
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          <AddMarker onAddMarker={handleAddMarker} />

          {/* Render markers */}
          {markers.map((position, index) => (
            <Marker key={index} position={position} icon={customIcon} />
          ))}
        </MapContainer>
      </Box>
      {/* Button to log coordinates */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Button variant="contained" onClick={logCoordinates}>
          Log Marker Coordinates
        </Button>
      </Box>
    </Box>
  );
};

export default MapPage;
