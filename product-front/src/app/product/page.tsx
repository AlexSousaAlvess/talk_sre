'use client'
import { API } from '@/lib/api';
import { Button, Divider, Input, InputNumber, Layout, Menu, Modal, Space, Table, TableProps, Tag, Typography } from 'antd';
import { PoweroffOutlined, AlertOutlined, HomeOutlined, ShopOutlined, UserAddOutlined, ProductOutlined, PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useDeferredValue, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { valueType } from 'antd/es/statistic/utils';
import { SearchProps } from 'antd/es/input';

const { Header, Content, Footer } = Layout;

const { Search } = Input;

interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number
}

const Product = () => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<valueType | null>();
  const [quantity, setQuantity] = useState<valueType | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState<Array<IProduct>>();
  const router = useRouter();

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
    const result = productList?.filter((product)=>{
      if(product.name == value){
        return product;
      }
    })
    if(result){
      setProductList(result);
    }
  };

  const salvar = async () => {
    await API.post("", {
        'name': name,
        'description': description,
        'price': price,
        'quantity': quantity
      });
    await listar();
    setName('');
    setDescription(''),
    setPrice(null),
    setQuantity(null),
    setIsModalOpen(false);
  }

  const listar = async () => {
    try {
      const response = await API.get("")
      setProductList(response.data);
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  const deletar = async (id: number) => {
    await API.delete(`/${id}`),
    await listar();
  }

  const editar = (props:IProduct) => {
    const {id, name, description, price, quantity} = props;
    setName(name);
    setDescription(description);
    setPrice(price);
    setQuantity(quantity);
    setIsModalOpen(true);
  }

  useEffect(() => {
    listar();
  }, [])

  const columns: TableProps<IProduct>['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Valor',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Ações',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button color='blue' variant='solid' icon={<EditOutlined />} onClick={() => editar(record)}>Editar</Button>
          <Button color='danger' variant='solid' icon={<DeleteOutlined />} onClick={() => deletar(record?.id)}>Deletar</Button>
        </Space>
      ),
    },
  ];

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
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Cadastrar</Button>
          <Search placeholder="pesquisar produto" onSearch={onSearch} enterButton style={{ marginTop: 10 }} />
          <Divider />
          <Table<IProduct> columns={columns} dataSource={productList} />
        </div>

        <Modal
          title="Cadastrar novo produto"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <Typography.Title level={5}>Nome</Typography.Title>
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Title level={5}>Descrição</Typography.Title>
            <TextArea
              showCount
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              style={{ height: 60, resize: 'none' }}
            />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Title level={5}>Valor</Typography.Title>
            <InputNumber onChange={(e) => setPrice(e)} value={price} style={{ width: 300 }} />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Title level={5}>Quantidade</Typography.Title>
            <InputNumber onChange={(e) => setQuantity(e)} value={quantity} style={{ width: 300 }} />
          </div>
        </Modal>

        <Modal
          title="Editar produto"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <Typography.Title level={5}>Nome</Typography.Title>
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Title level={5}>Descrição</Typography.Title>
            <TextArea
              showCount
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              style={{ height: 60, resize: 'none' }}
            />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Title level={5}>Valor</Typography.Title>
            <InputNumber onChange={(e) => setPrice(e)} value={price} style={{ width: 300 }} />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Title level={5}>Quantidade</Typography.Title>
            <InputNumber onChange={(e) => setQuantity(e)} value={quantity} style={{ width: 300 }} />
          </div>
        </Modal>

      </Content>
      <Footer style={{ textAlign: 'center' }}>
        By Alex ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Product;