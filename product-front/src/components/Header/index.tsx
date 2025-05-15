import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Menu, Button, Typography, Badge } from 'antd';
import {
  HomeOutlined,
  ShopOutlined,
  ProductOutlined,
  UserAddOutlined,
  AlertOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import InboxModal from '../InboxModal';

const { Header } = Layout;

const AppHeader = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Menu theme="dark" mode="horizontal" style={{ flex: 1, minWidth: 0 }}>
          {user?.role === 'OPERATOR' && (
            <>
              <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => router.push('/')}>
                Home
              </Menu.Item>
              <Menu.Item key="product" icon={<ProductOutlined />} onClick={() => router.push('/product')}>
                Product
              </Menu.Item>
              <Menu.Item key="register" icon={<UserAddOutlined />} onClick={() => router.push('/register')}>
                Register
              </Menu.Item>
            </>
          )}
          {user?.role === 'CUSTOMER' && (
            <Menu.Item key="shop" icon={<ShopOutlined />} onClick={() => router.push('/shop')}>
              Shop
            </Menu.Item>
          )}
        </Menu>

        {user && (
          <Typography.Text style={{ color: '#fff', marginRight: 16 }}>
            {user.name} ({user.role})
          </Typography.Text>
        )}

        <Button
          type="link"
          icon={
            <Badge count={3} offset={[0, 0]}>
              <AlertOutlined style={{ color: '#fff' }} />
            </Badge>
          }
          onClick={() => setIsModalOpen(true)}
        />

        <Button
          type="link"
          icon={<PoweroffOutlined style={{ color: '#fff' }} />}
          onClick={handleLogout}
        >
          <span style={{ color: '#fff' }}>Logout</span>
        </Button>
      </Header>

      <InboxModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AppHeader;
