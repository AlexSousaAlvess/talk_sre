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
import { API_NOTIFICATION } from '@/lib/api';
import { ToastContainer, toast } from 'react-toastify';

const { Header } = Layout;

const AppHeader = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string; id: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      API_NOTIFICATION.get(`/notifications/unread-count/${parsed.id}`)
        .then((res) => setUnreadCount(res.data))
        .catch((err) => console.error("Erro ao buscar notificações:", err));
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const eventSource = new EventSource(`http://localhost:8081/notifications/stream?userId=${user.id}`);

    eventSource.addEventListener("notification", (event) => {
      const data = JSON.parse(event.data);

      if(data.userId == user.id){
        console.log("Payload recebido via SSE:", data);
        toast.success(data.notification.message);
  
        setUnreadCount(data.unreadCount);
      }
    });

    return () => eventSource.close();
  }, [user]);

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
              <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => router.push('/')}>Home</Menu.Item>
              <Menu.Item key="product" icon={<ProductOutlined />} onClick={() => router.push('/product')}>Product</Menu.Item>
              <Menu.Item key="register" icon={<UserAddOutlined />} onClick={() => router.push('/register')}>Register</Menu.Item>
            </>
          )}
          {user?.role === 'CUSTOMER' && (
            <Menu.Item key="shop" icon={<ShopOutlined />} onClick={() => router.push('/shop')}>Shop</Menu.Item>
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
            <Badge count={unreadCount} offset={[0, 0]}>
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
      <ToastContainer />
      </Header>

      {user && (
        <InboxModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} userId={user.id} />
      )}
    </>
  );
};

export default AppHeader;