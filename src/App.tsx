import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import AdsList from './pages/AdsList';
import AdDetail from './pages/AdDetail';
import Stats from './pages/Stats';
import MainLayout from './components/Layout/MainLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './hooks/useTheme';

const AppContent = () => {
  const { theme: currentTheme } = useTheme();

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm:
          currentTheme === 'dark'
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<AdsList />} />
            <Route path="/item/:id" element={<AdDetail />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
