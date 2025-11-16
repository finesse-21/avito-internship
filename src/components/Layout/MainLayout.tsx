import { Layout, Menu, Switch } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UnorderedListOutlined,
  BarChartOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTheme } from '../../hooks/useTheme';

const { Header, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const menuItems: MenuProps['items'] = [
    {
      key: '/list',
      icon: <UnorderedListOutlined />,
      label: 'Список объявлений',
    },
    {
      key: '/stats',
      icon: <BarChartOutlined />,
      label: 'Статистика',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/item')) {
      return '/list';
    }
    return location.pathname;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            marginRight: '50px',
          }}
        >
          Модерация Авито
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: '16px',
          }}
        >
          <MoonOutlined style={{ color: 'white', fontSize: '18px' }} />
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            checkedChildren="Тёмная"
            unCheckedChildren="Светлая"
          />
        </div>
      </Header>
      <Content style={{ padding: '24px' }}>{children}</Content>
    </Layout>
  );
};

export default MainLayout;
