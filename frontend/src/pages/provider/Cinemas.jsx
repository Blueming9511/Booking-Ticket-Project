import React from "react";
import DynamicTable from "../../components/ui/DynamicTable";
import { Tag, Card, Space, Button, Badge, Table, Divider, Dropdown } from "antd";
import { 
  EnvironmentOutlined,
  EllipsisOutlined,
  PlusOutlined,
  FilterOutlined
} from '@ant-design/icons';

const columns = [
  {
    title: "Cinema names",
    dataIndex: "name",
    key: "name",
    render: (name) => <span className="font-semibold text-blue-600">{name}</span>,
    width: 200,
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    render: (location) => (
      <div className="flex items-center gap-2">
        <EnvironmentOutlined className="text-gray-500" />
        <span>{location}</span>
      </div>
    ),
    width: 250,
  },
  {
    title: "Screens",
    dataIndex: "screens",
    key: "screens",
    render: (screens) => (
      <Badge 
        count={`${screens} screens`} 
        className="bg-gray-100 text-gray-800" 
        style={{ padding: '0 8px' }}
      />
    ),
    width: 120,
    sorter: (a, b) => a.screens - b.screens,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <>
      {status === 'Active' && <Tag color="green">Active</Tag>}
      {status === 'Closed' && <Tag color="red">Closed</Tag>}
      {status === 'Renovating' && <Tag color="orange">Renovating</Tag>}
      </>
    ),
    filters: [
      { text: 'Active', value: 'Active' },
      { text: 'Closed', value: 'Closed' },
      { text: 'Renovating', value: 'Renovating' },
    ],
    onFilter: (value, record) => record.status === value,
    width: 150,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: () => (
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Edit",
            },
            {
              key: "delete",
              label: "Delete",
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button icon={<EllipsisOutlined />} shape="default" style={{padding: "0"}} />
      </Dropdown>
    ),
    width: 50,
  }
];

const initData = [
  {
    key: "1",
    name: "CGV Vincom Mega Mall",
    location: "Q. Bình Thạnh, TP.HCM",
    screens: 8,
    status: "Active",
  },
  {
    key: "2",
    name: "CGV Crescent Mall",
    location: "Q.7, TP.HCM",
    screens: 7,
    status: "Active",
  },
  {
    key: "3",
    name: "CGV Pandora City",
    location: "Q. Gò Vấp, TP.HCM",
    screens: 6,
    status: "Active",
  },
  {
    key: "4",
    name: "CGV Aeon Mall Tân Phú",
    location: "Q. Tân Phú, TP.HCM",
    screens: 5,
    status: "Renovating",
  },
  {
    key: "5",
    name: "CGV Hùng Vương Plaza",
    location: "Q.5, TP.HCM",
    screens: 6,
    status: "Active",
  },
  {
    key: "6",
    name: "CGV Vincom Đồng Khởi",
    location: "Q.1, TP.HCM",
    screens: 9,
    status: "Active",
  },
  {
    key: "7",
    name: "CGV Giga Mall Thủ Đức",
    location: "TP. Thủ Đức, TP.HCM",
    screens: 8,
    status: "Active",
  },
  {
    key: "8",
    name: "CGV Pearl Plaza",
    location: "Q. Bình Thạnh, TP.HCM",
    screens: 5,
    status: "Closed",
  },
  {
    key: "9",
    name: "CGV Sense City",
    location: "Q.3, TP.HCM",
    screens: 7,
    status: "Active",
  },
  {
    key: "10",
    name: "CGV Vincom Landmark 81",
    location: "Q. Bình Thạnh, TP.HCM",
    screens: 10,
    status: "Active",
  },
  
];

const Cinemas = () => {
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
          record.status === 'Renovating' ? 'bg-orange-50' : ''
        }
      />
      <Divider />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Total: {initData.length} cinemas</span>
      </div>
    </Card>
  );
};

export default Cinemas;