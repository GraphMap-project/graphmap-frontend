import { createContext, useContext, useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';

import AuthService from '../service/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub });
      } catch (error) {
        console.log('Invalid token', error);
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const login = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    const decoded = jwtDecode(accessToken);
    setUser({ email: decoded.sub });
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
