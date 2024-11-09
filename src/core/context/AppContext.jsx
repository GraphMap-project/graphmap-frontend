import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const props = useContext(AppContext);
  if (!props) {
    throw new Error('AppContext must be used within a AppContextProvider');
  }
  return props;
};

const AppContextProvider = ({ children }) => {
  const [coords, setCoords] = useState({ start: '', end: '' });

  const setStartCoords = latlng => {
    setCoords(prev => ({
      ...prev,
      start: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
    }));
  };

  const setEndCoords = latlng => {
    setCoords(prev => ({
      ...prev,
      end: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
    }));
  };

  const clearCoords = () => {
    setCoords({ start: '', end: '' });
  };

  const context = { coords, setStartCoords, setEndCoords, clearCoords };
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
