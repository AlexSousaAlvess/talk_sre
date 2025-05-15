'use client'
import { API } from '@/lib/api';
import { Button, Input, Layout, Typography } from 'antd';
import { useState } from 'react';
import { useRouter } from "next/navigation";

const { Content, Footer } = Layout;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const login = async () => {
    try {
      const response = await API.post('/users/login', {
        email,
        password
      });

      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));

      // Redirecionamento com base no tipo de usuário
      if (user.role === 'OPERATOR') {
        router.push('/product');
      } else if (user.role === 'CUSTOMER') {
        router.push('/shop');
      } else {
        alert('Perfil de usuário não reconhecido.');
      }

    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Email ou senha inválidos");
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            background: '#fff',
            height: '50vh',
            padding: 24,
            marginTop: '10px',
            borderRadius: '10px',
            maxWidth: 400,
            margin: '50px auto'
          }}
        >
          <Typography.Title level={3}>Login</Typography.Title>

          <div style={{ marginBottom: 10 }}>
            <Typography.Text>Email</Typography.Text>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Typography.Text>Senha</Typography.Text>
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button type="primary" onClick={login} block>
            Entrar
          </Button>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        By Alex ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default Login;
