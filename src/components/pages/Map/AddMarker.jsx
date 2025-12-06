import { useEffect, useRef, useState } from 'react';

import { useMap, useMapEvents } from 'react-leaflet';

import { checkIfInsideUkraine, checkIfWater } from './utils/geolocationUtils';

const AddMarker = ({ onAddMarker, markers, intermediatePoints }) => {
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const map = useMap();
  const skipNextClick = useRef(false);

  // Listen to Leaflet draw events directly
  useEffect(() => {
    const handleDrawStart = () => {
      setIsDrawingActive(true);
    };

    const handleDrawStop = () => {
      setIsDrawingActive(false);
    };

    map.on('draw:drawstart', handleDrawStart);
    map.on('draw:drawstop', handleDrawStop);
    map.on('draw:created', handleDrawStop);
    map.on('draw:canceled', handleDrawStop);

    return () => {
      map.off('draw:drawstart', handleDrawStart);
      map.off('draw:drawstop', handleDrawStop);
      map.off('draw:created', handleDrawStop);
      map.off('draw:canceled', handleDrawStop);
    };
  }, [map]);

  // Listen for custom event to skip next click (fired when clicking threats)
  useEffect(() => {
    const handleSkipClick = () => {
      skipNextClick.current = true;
    };

    map.on('threat:click', handleSkipClick);

    return () => {
      map.off('threat:click', handleSkipClick);
    };
  }, [map]);

  useMapEvents({
    async click(e) {
      // Don't add markers while drawing threats
      if (isDrawingActive) {
        return;
      }

      // Skip this click if it was from a threat interaction
      if (skipNextClick.current) {
        skipNextClick.current = false;
        return;
      }

      const hasEmptyIntermediate = intermediatePoints.some(p => !p.lat || !p.lng);
      const canAddMarker = markers.length < 2 || hasEmptyIntermediate;

      if (!canAddMarker) {
        return;
      }

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Проверка, что клик внутри Украины через API Nominatim
      const isInsideUkraine = await checkIfInsideUkraine(lat, lng);
      const isWater = await checkIfWater(lat, lng);
      console.log(isWater);

      if (isInsideUkraine) {
        if (!isWater) {
          onAddMarker(e.latlng);
        } else {
          // TODO: add toast
          alert('Не можна ставити маркер на воду');
        }
      } else {
        // Показывать alert, если клик за пределами Украины
        alert('Не можна ставити маркер поза межами України');
      }
    },
  });
  return null;
};

export default AddMarker;
