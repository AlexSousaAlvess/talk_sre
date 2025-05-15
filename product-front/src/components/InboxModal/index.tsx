import { Modal, Typography, List, Badge, Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { API } from '@/lib/api'; // Certifique-se de que o caminho está correto

interface Message {
  id: number;
  title: string;
  content: string;
  read: boolean;
}

interface InboxModalProps {
  visible: boolean;
  onClose: () => void;
}

const InboxModal: React.FC<InboxModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    try {
      const response = await API.get('/messages'); // Substitua pelo endpoint real
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
      await API.put(`/messages/${id}/read`); // Substitua pelo endpoint real
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
      await API.delete(`/messages/${id}`); // Substitua pelo endpoint real
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
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
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  {!item.read && <Badge status="processing" />}
                  <Typography.Text strong={!item.read}>
                    {item.title}
                  </Typography.Text>
                </Space>
              }
              description={item.content}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default InboxModal;
