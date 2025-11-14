import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import AdsList from './pages/AdsList';
import AdDetail from './pages/AdDetail';
// import Stats from './pages/Stats';
import MainLayout from './components/Layout/MainLayout';

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<AdsList />} />
            <Route path="/item/:id" element={<AdDetail />} />
            {/* <Route path="/stats" element={<Stats />} /> */}
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
