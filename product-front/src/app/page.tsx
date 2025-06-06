'use client'

import { Card, Col, Layout, Row, Statistic } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

import { useEffect, useState } from 'react';
import { API } from '@/lib/api';
import { valueType } from 'antd/es/statistic/utils';
import AppHeader from '@/components/Header';

const { Content, Footer } = Layout;

const Home = () => {
  const [purchase, setPurchase] = useState<valueType | null>(null);

  const listar = async () => {
    try {
      const response = await API.get("/dashboard")
      setPurchase(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    listar();

    const eventSource = new EventSource(`http://localhost:8081/notifications/stream?userId=${user.id}`);

    eventSource.addEventListener("notification", (event) => {
      const data = JSON.parse(event.data);
      console.log("Dashboard recebeu evento:", data);
      listar();
    });

    return () => {
      eventSource.close();
    };
  }, [])



  return (
    <Layout>
      <AppHeader />

      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            background: '#fff',
            height: '100vh',
            padding: 24,
            marginTop: '10px',
            borderRadius: '10px',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Card variant="borderless">
                <Statistic
                  title="Valor Total de vendas"
                  value={purchase ?? 0}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={purchase != 0 ? <ArrowUpOutlined /> : null}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        By Alex ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Home;