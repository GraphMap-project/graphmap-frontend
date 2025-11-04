import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { RouteProvider } from '@/core/context/RouteContext.jsx';

import App from './App.jsx';
import AppContextProvider from './core/context/AppContext.jsx';
import { AuthProvider } from './core/context/AuthContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Router>
    <AuthProvider>
      <AppContextProvider>
        <RouteProvider>
          <App />
        </RouteProvider>
      </AppContextProvider>
    </AuthProvider>
  </Router>,
  // </StrictMode>,
);
