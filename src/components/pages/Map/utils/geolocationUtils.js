const RAPID_ISITWATER_API_KEY = import.meta.env.VITE_RAPID_ISITWATER_API_KEY;

export const checkIfInsideUkraine = async (lat, lng) => {
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

export const getLandmarkName = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=uk`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const landmarkName =
      data?.address?.city || data?.address?.town || data?.address?.village;
    return landmarkName;
  } catch (error) {
    console.error('Error checking landmark name: ', error);
  }
};

export const checkIfWater = async (lat, lng) => {
  const url = `https://isitwater-com.p.rapidapi.com/?latitude=${lat}&longitude=${lng}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPID_ISITWATER_API_KEY,
      'X-RapidAPI-Host': 'isitwater-com.p.rapidapi.com',
    },
  });

  const data = await response.json();

  return data.water;
};
