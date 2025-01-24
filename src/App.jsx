import { Route, Routes } from 'react-router-dom';

import { MapPage } from './components/Map';
import { RegisterPage } from './components/pages';
import { Footer, Header } from './components/ui';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
