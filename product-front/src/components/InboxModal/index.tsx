import { Modal, List, Button } from 'antd';
import { useEffect, useState } from 'react';
import { API_NOTIFICATION } from '@/lib/api';

interface Message {
  createdAt: string;
  id: number;
  message: string;
  read: boolean;
}

interface InboxModalProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
}

const InboxModal: React.FC<InboxModalProps> = ({ visible, onClose, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    try {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const markAsRead = async (id: number) => {
    try {
      await API_NOTIFICATION.patch(`/notifications/${id}/mark-as-read`);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await API_NOTIFICATION.delete(`/messages/${id}`);
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
    }
  };

  return (
    <Modal
      title="Caixa de Entrada"
      open={visible}
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
            <List.Item.Meta description={item.message} />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default InboxModal;