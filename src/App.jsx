import { Route, Routes } from 'react-router-dom';

import { RegisterPage } from './components/pages';
import { LoginPage } from './components/pages';
import { SettingsPage } from './components/pages';
import { MapPage } from './components/pages/Map';
import { Footer, Header } from './components/ui';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
