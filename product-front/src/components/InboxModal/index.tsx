import { Modal, List, Button } from 'antd';
import { useEffect, useState } from 'react';
import {API_NOTIFICATION } from '@/lib/api';

interface Message {
  createdAt: string;
  id: number;
  message: string;
  read: boolean
}

interface InboxModalProps {
  visible: boolean;
  onClose: () => void;
}

const InboxModal: React.FC<InboxModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
  const eventSource = new EventSource('http://localhost:8081/notifications/stream');

  eventSource.onmessage = (event) => {
    try {
      const newMessage: Message = JSON.parse(event.data);
      setMessages(prevMessages => [newMessage, ...prevMessages]);
    } catch (error) {
      console.error('Erro ao processar a notificação:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('Erro na conexão SSE:', error);
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
}, []);

  const fetchMessages = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    const response = await API_NOTIFICATION.get(`/notifications/by-user/${userId}`);
    setMessages(response.data);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
  }
};

  useEffect(() => {
    if (visible) {
      fetchMessages();
    }
  }, [visible]);

  const markAsRead = async (id: number) => {
    try {
      await API_NOTIFICATION.put(`/unread-count/${id}`);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id ? { ...msg, read: true } : msg
        )
      );
      window.dispatchEvent(new Event("notification-created"));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await API_NOTIFICATION.delete(`/messages/${id}`);
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
      window.dispatchEvent(new Event("notification-created"));
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
    }
  };

  return (
    <Modal
      title="Caixa de Entrada"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={item => (
          <List.Item
            actions={[
              !item.read && (
                <Button type="link" onClick={() => markAsRead(item.id)}>
                  Marcar como lida
                </Button>
              ),
              // eslint-disable-next-line react/jsx-key
              <Button type="link" danger onClick={() => deleteMessage(item.id)}>
                Excluir
              </Button>
            ]}
          >
            <List.Item.Meta
              description={item.message}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default InboxModal;
