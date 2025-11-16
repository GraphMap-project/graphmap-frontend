import { createContext, useContext, useState } from 'react';

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [previewThreat, setPreviewThreat] = useState(null);
  return (
    <RouteContext.Provider
      value={{ selectedRoute, setSelectedRoute, previewThreat, setPreviewThreat }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => useContext(RouteContext);
