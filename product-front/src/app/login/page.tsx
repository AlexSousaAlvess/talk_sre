'use client'
import { API } from '@/lib/api';
import { Button, Input, InputNumber, Layout, Menu, Typography } from 'antd';
import { PoweroffOutlined, AlertOutlined, HomeOutlined, ShopOutlined, UserAddOutlined, ProductOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { valueType } from 'antd/es/statistic/utils';

const { Header, Content, Footer } = Layout;

const Login = () => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<valueType | null>();
  const [quantity, setQuantity] = useState<valueType | null>();
  const router = useRouter();

  const salvar = () => {
    API.post("", {
      'name': name,
      'description': description,
      'price': price,
      'quantity': quantity
    })
  }

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          //items={()=>(<Typography.Title level={5}>Nome</Typography.Title>)}
          style={{ flex: 1, minWidth: 0 }}
        >
          <Button color='primary' variant='link' icon={<HomeOutlined/>} onClick={()=>router.push("/")} >Home</Button>
          <Button color='primary' variant='link' icon={<ShopOutlined/>} onClick={()=>router.push("/shop")} >Shop</Button>
          <Button color='primary' variant='link' icon={<ProductOutlined/>} onClick={()=>router.push("/product")} >Product</Button>
          <Button color='primary' variant='link' icon={<UserAddOutlined/>} onClick={()=>router.push("/register")} >Register</Button>
        </Menu>
          <Button color='primary' variant='link' icon={<AlertOutlined/>} onClick={()=>router.push("/register")}>{<span style={{color: 'yellow'}}>3</span>}</Button>
          <Button color='primary' variant='link' icon={<PoweroffOutlined/>} onClick={()=>router.push("/register")} >Logout</Button>
      </Header>
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
          content
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        By Alex ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Login;
