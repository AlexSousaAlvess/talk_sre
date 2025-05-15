'use client'
import { API } from '@/lib/api';
import { Button, Divider, Input, Layout, Modal, Select, Space, Table, TableProps, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { SearchProps } from 'antd/es/input';
import AppHeader from '@/components/Header';

const { Content, Footer } = Layout;

const { Search } = Input;

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;

}

const Register = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'OPERATOR' | 'CUSTOMER'>('CUSTOMER');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userList, setUserList] = useState<Array<IUser>>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    salvar();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSearch: SearchProps['onSearch'] = (value) => {
    const result = userList?.filter((user) => {
      if (user.name == value) {
        return user;
      }
    })
    if (result) {
      setUserList(result);
    }
  };

  const listar = async () => {
    try {
      const response = await API.get("/users")
      setUserList(response.data);
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  const salvar = async () => {
    try {
      await API.post("/users/register", {
        name,
        email,
        password,
        role
      });
      await listar();
      toast("Usuário registrado com sucesso!");
    } catch (err) {
      console.error("Erro ao registrar:", err);
      toast("Erro ao registrar usuário.");
    }
    setName('');
    setEmail('');
    setPassword('');
    setIsModalOpen(false);
  };

  useEffect(() => {
    listar();
  }, [])

  const columns: TableProps<IUser>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Papel',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button color='blue' variant='solid' icon={<EditOutlined />} onClick={() => console.log("editar", record)}>Editar</Button>
          <Button color='danger' variant='solid' icon={<DeleteOutlined />} onClick={() => console.log("deletar", record)}>Deletar</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <AppHeader/>

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

          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Cadastrar</Button>
          <Search placeholder="pesquisar produto" onSearch={onSearch} enterButton style={{ marginTop: 10 }} />
          <Divider />
          <Table<IUser> columns={columns} dataSource={userList} />
          <ToastContainer />
        </div>
        <Modal
          title="Cadastrar novo produto"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Typography.Title level={3}>Cadastro de Usuário</Typography.Title>

          <div style={{ marginBottom: 10 }}>
            <Typography.Text>Nome</Typography.Text>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <Typography.Text>Email</Typography.Text>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <Typography.Text>Senha</Typography.Text>
            <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Typography.Text>Tipo de usuário</Typography.Text>
            <Select
              value={role}
              onChange={(value) => setRole(value)}
              style={{ width: 300, display: 'block' }}
              options={[
                { label: 'Operador', value: 'OPERATOR' },
                { label: 'Cliente', value: 'CUSTOMER' },
              ]}
            />
          </div>
        </Modal>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        By Alex ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Register;