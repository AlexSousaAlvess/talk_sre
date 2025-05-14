'use client'
import { API } from '@/lib/api';
import { Alert, Button, Card, Divider, Input, InputNumber, Layout, List, Menu, Modal, Space, Table, TableProps, Tag, Typography } from 'antd';
import { PoweroffOutlined, AlertOutlined, HomeOutlined, ShopOutlined, UserAddOutlined, ProductOutlined, PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useDeferredValue, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { valueType } from 'antd/es/statistic/utils';
import { SearchProps } from 'antd/es/input';
import { ToastContainer, toast } from 'react-toastify';

const { Header, Content, Footer } = Layout;

const { Search } = Input;

interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number
}

const Shop = () => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<valueType | null>();
  const [quantity, setQuantity] = useState<valueType | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState<Array<IProduct>>();
  const [productFound, setProductFound] = useState<Array<IProduct | []>>();
  const router = useRouter();

  const onSearch: SearchProps['onSearch'] = (value) => {
    const result = productList?.filter((product) => {
      if (product.name == value) {
        return product;
      }
    })
    if (result) {
      setProductList(result);
    }
  };

  const listar = async () => {
    try {
      const response = await API.get("")
      setProductList(response.data);
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  const purchase = async (item:IProduct) => {
    try{
      await API.patch(`/${item?.id}`, 
        {quantityUpdate: 1}
      )
      toast("Compra feita");
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    listar();
  }, [])

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ flex: 1, minWidth: 0 }}
        >
          <Button color='primary' variant='link' icon={<HomeOutlined />} onClick={() => router.push("/")} >Home</Button>
          <Button color='primary' variant='link' icon={<ShopOutlined />} onClick={() => router.push("/shop")} >Shop</Button>
          <Button color='primary' variant='link' icon={<ProductOutlined />} onClick={() => router.push("/product")} >Product</Button>
          <Button color='primary' variant='link' icon={<UserAddOutlined />} onClick={() => router.push("/register")} >Register</Button>
        </Menu>
        <Button color='primary' variant='link' icon={<AlertOutlined />} onClick={() => { }}>{<span style={{ color: 'yellow' }}>3</span>}</Button>
        <Button color='primary' variant='link' icon={<PoweroffOutlined />} onClick={() => { }} >Logout</Button>
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
          <Search placeholder="pesquisar produto" onSearch={onSearch} enterButton style={{ marginTop: 10 }} />
          <Divider />
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={productList}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.name} style={{margin: '0 10 0 0', width: 250}}>
                  <Typography.Title level={5} style={{}}>{item.description}</Typography.Title>
                  <Typography.Title level={5} style={{}}>R${item.price}</Typography.Title>
                  <Button type="primary" icon={<ShoppingCartOutlined />} onClick={()=>{purchase(item)}} style={{width: '100%'}}>Comprar</Button>
                  
                </Card>
              </List.Item>
            )}
          />
          <ToastContainer />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        By Alex ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Shop;