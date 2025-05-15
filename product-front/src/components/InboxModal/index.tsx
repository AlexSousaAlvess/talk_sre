import { Modal, Typography, List, Badge } from 'antd';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (visible) {
      const fetchMessages = async () => {
        const data: Message[] = [
          { id: 1, title: 'Pedido Confirmado', content: 'Seu pedido foi confirmado.', read: false },
          { id: 2, title: 'Promoção Especial', content: 'Aproveite nossa promoção.', read: true },
        ];
        setMessages(data);
      };

      fetchMessages();
    }
  }, [visible]);

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
          <List.Item>
            <List.Item.Meta
              title={
                <Typography.Text strong={!item.read}>
                  {item.title}
                </Typography.Text>
              }
              description={item.content}
            />
            {!item.read && <Badge status="processing" />}
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default InboxModal;
