'use client'
import { API } from '@/lib/api';
import { Button, Divider, Input, InputNumber, Layout, Modal, Space, Table, TableProps, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { valueType } from 'antd/es/statistic/utils';
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

const Product = () => {

  const [id, setId] = useState<number | null>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<valueType | null>();
  const [quantity, setQuantity] = useState<valueType | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [productList, setProductList] = useState<Array<IProduct>>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    salvar();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleEditOk = () => {
    salvar();
  };

  const handleEditCancel = () => {
    setIsModalEditOpen(false);
  };

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

  const salvar = async () => {
    await API.post("/product", {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'quantity': quantity
    });
    await listar();
    setId(null);
    setName('');
    setDescription('');
    setPrice(null);
    setQuantity(null);
    setIsModalOpen(false);
    setIsModalEditOpen(false);
  }

  const listar = async () => {
    try {
      const response = await API.get("/product")
      setProductList(response.data);
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  const deletar = async (id: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    await API.delete(`/product/${id}`),
      await listar();
  }

  const editar = (props: IProduct) => {
    const { id, name, description, price, quantity } = props;
    setId(id);
    setName(name);
    setDescription(description);
    setPrice(price);
    setQuantity(quantity);
    setIsModalEditOpen(true);
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
            <Typography.Text>Nome</Typography.Text>
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Text>Descrição</Typography.Text>
            <TextArea
              showCount
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              style={{ height: 60, resize: 'none' }}
            />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Text style={{ display: 'block' }}>Valor</Typography.Text>
            <InputNumber onChange={(e) => setPrice(e)} value={price} style={{ width: 300 }} />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Text style={{ display: 'block' }}>Quantidade</Typography.Text>
            <InputNumber onChange={(e) => setQuantity(e)} value={quantity} style={{ width: 300 }} />
          </div>
        </Modal>

        <Modal
          title="Editar produto"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalEditOpen}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
        >
          <div>
            <Typography.Text>Nome</Typography.Text>
            <Input onChange={(e) => setName(e.target.value)} value={name} />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Text>Descrição</Typography.Text>
            <TextArea
              showCount
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              style={{ height: 60, resize: 'none' }}
            />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Text style={{ display: 'block' }}>Valor</Typography.Text>
            <InputNumber onChange={(e) => setPrice(e)} value={price} style={{ width: 300 }} />
          </div>
          <div style={{ marginTop: 5 }}>
            <Typography.Text style={{ display: 'block' }}>Quantidade</Typography.Text>
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