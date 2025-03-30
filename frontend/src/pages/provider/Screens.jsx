import React from "react";
import DynamicTable from "../../components/ui/DynamicTable";
import { Tag, Divider, Badge, Table, Card, Button, Space } from "antd";
import { 
  StarOutlined, 
  VideoCameraOutlined, 
  ThunderboltOutlined,
  PlusOutlined,
  FilterOutlined
} from '@ant-design/icons';

const columns = [
  {
    title: "Screen ID",
    dataIndex: "id",
    key: "id",
    render: (id) => <span className="font-mono font-bold">#{id}</span>,
    width: 200,
    sorter: (a, b) => a.id.localeCompare(b.id),
  },
  { 
    title: "Screen Type", 
    dataIndex: "type", 
    key: "type",
    render: (type) => (
      <div>
        {type === "Standard" && <Tag color="blue">Standard</Tag>}
        {type === "VIP" && <Tag color="volcano">VIP</Tag>}
        {type === "IMAX" && <Tag color="cyan">IMAX</Tag>}
        {type === "4DX" && <Tag color="geekblue">4DX</Tag>}
        {type === "Deluxe" && <Tag color="magenta">Deluxe</Tag>}
        {type === "Premium" && <Tag color="red">Premium</Tag>}
      </div>
    ),
    filters: [
      { text: 'Standard', value: 'Standard' },
      { text: 'VIP', value: 'VIP' },
      { text: 'IMAX', value: 'IMAX' },
      { text: '4DX', value: '4DX' },
      { text: 'Deluxe', value: 'Deluxe' },
      { text: 'Premium', value: 'Premium' },
      { text: '3D', value: '3D' },
    ],
    onFilter: (value, record) => record.type === value,
    width: 200,
  },
  { 
    title: "Capacity", 
    dataIndex: "capacity", 
    key: "capacity",
    render: (capacity) => (
      <Badge 
        count={`${capacity} seats`} 
        className="bg-gray-100 text-gray-800" 
        style={{ padding: '0 8px' }}
      />
    ),
    sorter: (a, b) => a.capacity - b.capacity,
    width: 200,
  },
  { 
    title: "Cinema", 
    dataIndex: "cinema", 
    key: "cinema",
    render: (cinema) => <span className="text-blue-600">{cinema}</span>,
    filters: [
      { text: 'CGV Vincom Mega Mall', value: 'CGV Vincom Mega Mall'},
      { text: 'CGV Vincom Plaza', value: 'CGV Vincom Plaza'},
      { text: 'CGV Vincom City', value: 'CGV Vincom City'},
      { text: 'CGV Vincom Plaza 2', value: 'CGV Vincom Plaza 2'},
    ],
    onFilter: (value, record) => record.cinema === value,
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
        <>
          {status === "Active" && <Tag color="green">Active</Tag>}
          {status === "Closed" && <Tag color="red">Closed</Tag>}
          {status === "Renovating" && <Tag color="orange">Renovating</Tag>}
          {status === "Inactive" && <Tag color="gray">Inactive</Tag>}
        </>
    ),

    filters: [
      { text: 'Active', value: 'Active' },
      { text: 'Closed', value: 'Closed' },
      { text: 'Renovating', value: 'Renovating' },
      { text: 'Inactive', value: 'Inactive' },
    ],
    onFilter: (value, record) => record.status === value,
    width: 150,
  },
];

const initData = [
  {
    id: "R001",
    type: "Standard",
    capacity: 120,
    status: "Active",
    cinema: "CGV Vincom Mega Mall",
    key: "1"
  },
  {
    id: "R002",
    type: "VIP",
    capacity: 50,
    status: "Active",
    cinema: "CGV Vincom Mega Mall",
    key: "2"
  },
  {
    id: "R003",
    type: "IMAX",
    capacity: 200,
    status: "Inactive",
    cinema: "CGV Vincom Mega Mall",
    key: "3"
  },
  {
    id: "R004",
    type: "4DX",
    capacity: 80,
    status: "Active",
    cinema: "CGV Vincom Mega Mall",
    key: "4"
  },
  {
    id: "R005",
    type: "Deluxe",
    capacity: 100,
    status: "Renovating",
    cinema: "CGV Vincom Mega Mall",
    key: "5"
  },
  {
    id: "R006",
    type: "Standard",
    capacity: 150,
    status: "Active",
    cinema: "CGV Vincom Mega Mall",
    key: "6"
  },
  {
    id: "R007",
    type: "VIP",
    capacity: 40,
    status: "Inactive",
    cinema: "CGV Vincom Mega Mall",
    key: "7"
  },
  {
    id: "R008",
    type: "Premium",
    capacity: 75,
    status: "Active",
    cinema: "CGV Vincom Mega Mall",
    key: "8"
  },
  {
    id: "R009",
    type: "Standard",
    capacity: 110,
    status: "Closed",
    cinema: "CGV Vincom Mega Mall",
    key: "9"
  },
  {
    id: "R010",
    type: "3D",
    capacity: 180,
    status: "Active",
    cinema: "CGV Vincom Mega Mall",
    key: "10"
  }
];

const Screens = () => {
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
        dataSource={initData} 
        pagination={{ pageSize: 5 }}
        rowClassName={(record) => 
          record.status === 'Closed' ? 'bg-red-50' : 
          record.status === 'Renovating' ? 'bg-orange-50' : 
          record.status === 'Inactive' ? 'bg-gray-50' : ''
        }
      />
            <Divider />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Total: {initData.length} cinemas</span>
        </div>

    </Card>
  );
};

export default Screens;