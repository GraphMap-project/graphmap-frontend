import { Route, Routes } from 'react-router-dom';

import { Box } from '@mui/material';

import { RegisterPage } from './components/pages';
import { LoginPage } from './components/pages';
import { SettingsPage } from './components/pages';
import { ForgotPassword } from './components/pages';
import { ResetPassword } from './components/pages';
import { AdminPage } from './components/pages';
import { MapPage } from './components/pages/Map';
import { Footer, Header } from './components/ui';

function App() {
  return (
    <Box className="flex flex-col h-screen">
      <Header />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
