import { Route, Routes } from 'react-router-dom';

import { MapPage } from './components/Map';
import { RegisterPage } from './components/pages';
import { LoginPage } from './components/pages';
import { Footer, Header } from './components/ui';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
