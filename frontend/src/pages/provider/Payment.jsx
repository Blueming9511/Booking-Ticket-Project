import React from "react";
import { Table, Tag, Space, Divider, Card, Button } from "antd";
import { 
  CreditCardOutlined, 
  WalletOutlined, 
  BankOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CloseCircleOutlined ,
  FilterOutlined,
  PlusOutlined,
  
} from '@ant-design/icons';

const columns = [
  {
    title: 'Payment ID',
    dataIndex: 'id',
    key: 'id',
    render: (id) => <span className="font-mono font-bold">#{id}</span>,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount) => (
      <span className="font-semibold">
        {new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(amount)}
      </span>
    ),
    sorter: (a, b) => a.amount - b.amount,
  },
  {
    title: 'Payment Method',
    dataIndex: 'method',
    key: 'method',
    render: (method) => {
      let icon, color;
      switch (method) {
        case 'Credit Card':
          icon = <CreditCardOutlined className="text-blue-500" />;
          color = 'blue';
          break;
        case 'E-Wallet':
          icon = <WalletOutlined className="text-green-500" />;
          color = 'green';
          break;
        case 'Bank Transfer':
          icon = <BankOutlined className="text-purple-500" />;
          color = 'purple';
          break;
        default:
          icon = <QuestionOutlined className="text-gray-500" />;
          color = 'gray';
      }
      return (
        <Tag 
          icon={icon}
          color={color}
          className="flex items-center gap-2"
          style={{ borderRadius: '20px' }}
        >
          {method}
        </Tag>
      );
    },
    filters: [
      { text: 'Credit Card', value: 'Credit Card' },
      { text: 'E-Wallet', value: 'E-Wallet' },
      { text: 'Bank Transfer', value: 'Bank Transfer' },
    ],
    onFilter: (value, record) => record.method === value,
  },
  {
    title: 'Date',
    dataIndex: 'transactionDate',
    key: 'transactionDate',
    render: (date) => new Date(date).toLocaleString(),
    sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let icon, color;
      switch (status) {
        case 'Completed':
          icon = <CheckCircleOutlined />;
          color = 'green';
          break;
        case 'Pending':
          icon = <ClockCircleOutlined />;
          color = 'orange';
          break;
        case 'Failed':
          icon = <CloseCircleOutlined />;
          color = 'red';
          break;
        default:
          color = 'gray';
      }
      return (
        <Tag icon={icon} color={color}>
          {status}
        </Tag>
      );
    },
    filters: [
      { text: 'Completed', value: 'Completed' },
      { text: 'Pending', value: 'Pending' },
      { text: 'Failed', value: 'Failed' },
    ],
    onFilter: (value, record) => record.status === value,
  },
];

const data = [
  {
    key: '1',
    id: 'PAY78901',
    amount: 25.99,
    method: 'Credit Card',
    transactionDate: '2023-05-15T10:30:00',
    status: 'Completed',
  },
  {
    key: '2',
    id: 'PAY78902',
    amount: 42.50,
    method: 'E-Wallet',
    transactionDate: '2023-05-16T14:45:00',
    status: 'Completed',
  },
  {
    key: '3',
    id: 'PAY78903',
    amount: 18.75,
    method: 'Bank Transfer',
    transactionDate: '2023-05-17T09:15:00',
    status: 'Pending',
  },
  {
    key: '4',
    id: 'PAY78904',
    amount: 60.00,
    method: 'Credit Card',
    transactionDate: '2023-05-18T16:20:00',
    status: 'Failed',
  },
  {
    key: '5',
    id: 'PAY78905',
    amount: 33.25,
    method: 'E-Wallet',
    transactionDate: '2023-05-19T11:10:00',
    status: 'Completed',
  },
  {
    key: '6',
    id: 'PAY78906',
    amount: 75.50,
    method: 'Bank Transfer',
    transactionDate: '2023-05-20T13:30:00',
    status: 'Completed',
  },
  {
    key: '7',
    id: 'PAY78907',
    amount: 22.99,
    method: 'Credit Card',
    transactionDate: '2023-05-21T17:45:00',
    status: 'Pending',
  },
  {
    key: '8',
    id: 'PAY78908',
    amount: 50.00,
    method: 'E-Wallet',
    transactionDate: '2023-05-22T12:00:00',
    status: 'Completed',
  },
  {
    key: '9',
    id: 'PAY78909',
    amount: 29.95,
    method: 'Bank Transfer',
    transactionDate: '2023-05-23T15:30:00',
    status: 'Failed',
  },
  {
    key: '10',
    id: 'PAY78910',
    amount: 65.25,
    method: 'Credit Card',
    transactionDate: '2023-05-24T18:15:00',
    status: 'Completed',
  },
];

const Payment = () => {
  return (
    <Card 
    title={<span className="text-xl font-bold">Mangement Cinema</span>}
    extra={
      <Space>
        <Button icon={<FilterOutlined />}>Lọc</Button>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm rạp mới
        </Button>
      </Space>
    }
    variant="borderless"  
    styles ={{ header: {borderBottom: 'none'}}}
    style={{boxShadow: 'none'}}
  >
      <Table 
        columns={columns} 
        dataSource={data} 
        bordered = {false}
        pagination={{ pageSize: 6 }}
        rowClassName={(record) => 
          record.status === 'Pending' ? 'bg-orange-50' : 
          record.status === 'Failed' ? 'bg-red-50' : ''
        }
      />
      <Divider />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Total: {data.length} movies</span>
      </div>
    </Card>
  );
};

export default Payment;