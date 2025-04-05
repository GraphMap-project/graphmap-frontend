import L from 'leaflet';

import blueMarker from '../../../assets/markers/marker_blue.png';
import intermediateMarker from '../../../assets/markers/marker_intermediate.png';
import redMarker from '../../../assets/markers/marker_red.png';

export const startIcon = new L.Icon({
  iconUrl: blueMarker,
  // iconSize: [25, 41],
  iconAnchor: [25, 50],
  popupAnchor: [0, -41],
});

export const endIcon = new L.Icon({
  iconUrl: redMarker,
  // iconSize: [25, 41],
  iconAnchor: [25, 50],
  popupAnchor: [0, -41],
});

export const intermediateIcon = new L.Icon({
  iconUrl: intermediateMarker,
  iconAnchor: [15, 30],
});
