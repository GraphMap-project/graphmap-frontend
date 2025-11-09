import { useMapEvents } from 'react-leaflet';

import { checkIfInsideUkraine, checkIfWater } from './utils/geolocationUtils';

const AddMarker = ({ onAddMarker, markers, intermediatePoints }) => {
  // eslint-disable-next-line no-unused-vars
  const map = useMapEvents({
    async click(e) {
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
