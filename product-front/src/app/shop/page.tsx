'use client'
import { API } from '@/lib/api';
import { Button, Card, Divider, Input, Layout, List, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { SearchProps } from 'antd/es/input';
import AppHeader from '@/components/Header';

const { Content, Footer } = Layout;

const { Search } = Input;

interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number
}

const Shop = () => {
  const [productList, setProductList] = useState<Array<IProduct>>();

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
      const response = await API.get("/product")
      setProductList(response.data);

    } catch (e) {
      console.log(e);
    }
  }

  const purchase = async (item: IProduct) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;
    if (!userId) {
      return;
    }
    await API.patch(`/product/${item?.id}`, {
      quantity: 1,
      userId: userId
    });
    window.dispatchEvent(new Event("notification-created"));
  } catch (e) {
    console.log(e);
  }
};


  useEffect(() => {
    listar();
  }, [])

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
          <Search placeholder="pesquisar produto" onSearch={onSearch} enterButton style={{ marginTop: 10 }} />
          <Divider />
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={productList}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.name} style={{ margin: '0 10 0 0', width: 250 }}>
                  <Typography.Text style={{ display: 'block' }}>{item.description}</Typography.Text>
                  <Typography.Text style={{ display: 'block' }}>R${item.price}</Typography.Text>
                  <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => { purchase(item) }} style={{ width: '100%' }}>Comprar</Button>

                </Card>
              </List.Item>
            )}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        By Alex ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Shop;