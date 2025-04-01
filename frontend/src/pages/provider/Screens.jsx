import React, { useState, useEffect } from "react";
import {
  Tag,
  Divider,
  Badge,
  Table,
  Card,
  Button,
  Space,
  Dropdown,
  Form,
  Input,
  Select,
  Avatar
} from "antd";
import {
  EllipsisOutlined,
  PlusOutlined,
  FilterOutlined,
  SearchOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import ModalScreenAdd from "../../components/ui/Modal/ModalScreenAdd";
import ModalScreenEdit from "../../components/ui/Modal/ModalScreenEdit";
import ScreenStatistics from "../../components/ui/Card/ScreenStatistics";
import TagStatus from "../../components/ui/Tag/TagStatus";

const { Search } = Input;

const ScreenTable = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    filteredData: [],
    searchText: "",
    statusFilter: null,
    typeFilter: null,
    cinemaFilter: null,
    isModalEditOpen: false,
    isModalAddOpen: false,
    editingScreen: null
  });

  const INIT_DATA = [
    {
      id: "R001",
      type: "Standard",
      capacity: 120,
      status: "Active",
      cinema: "CGV Vincom Mega Mall",
      location: "Q. Bình Thạnh, TP.HCM",
      key: "1",
    },
    {
      id: "R002",
      type: "VIP",
      capacity: 50,
      status: "Active",
      cinema: "CGV Vincom Mega Mall",
      location: "Q. Bình Thạnh, TP.HCM",
      key: "2",
    },
    {
      id: "R003",
      type: "IMAX",
      capacity: 200,
      status: "Inactive",
      cinema: "CGV Vincom Mega Mall",
      location: "Q. Bình Thạnh, TP.HCM",
      key: "3",
    },
    {
      id: "R004",
      type: "4DX",
      capacity: 80,
      status: "Active",
      cinema: "CGV Vincom Plaza",
      location: "Q.1, TP.HCM",
      key: "4",
    },
    {
      id: "R005",
      type: "Deluxe",
      capacity: 100,
      status: "Renovating",
      cinema: "CGV Vincom Plaza",
      location: "Q.1, TP.HCM",
      key: "5",
    },
    {
      id: "R006",
      type: "Standard",
      capacity: 150,
      status: "Active",
      cinema: "CGV Vincom Center",
      location: "Q.1, TP.HCM",
      key: "6",
    },
    {
      id: "R007",
      type: "VIP",
      capacity: 40,
      status: "Inactive",
      cinema: "CGV Vincom Center",
      location: "Q.1, TP.HCM",
      key: "7",
    },
    {
      id: "R008",
      type: "Premium",
      capacity: 75,
      status: "Active",
      cinema: "CGV Vincom Landmark",
      location: "Q.7, TP.HCM",
      key: "8",
    },
    {
      id: "R009",
      type: "Standard",
      capacity: 110,
      status: "Closed",
      cinema: "CGV Vincom Landmark",
      location: "Q.7, TP.HCM",
      key: "9",
    },
    {
      id: "R010",
      type: "3D",
      capacity: 180,
      status: "Active",
      cinema: "CGV Vincom Mega Mall",
      location: "Q. Bình Thạnh, TP.HCM",
      key: "10",
    },
  ];

  const STATUS_OPTIONS = [
    { value: "Active", label: "Active" },
    { value: "Closed", label: "Closed" },
    { value: "Renovating", label: "Renovating" },
    { value: "Inactive", label: "Inactive" }
  ];

  const TYPE_OPTIONS = [
    { value: "Standard", label: "Standard" },
    { value: "VIP", label: "VIP" },
    { value: "IMAX", label: "IMAX" },
    { value: "4DX", label: "4DX" },
    { value: "Deluxe", label: "Deluxe" },
    { value: "Premium", label: "Premium" },
    { value: "3D", label: "3D" }
  ];

  const CINEMA_OPTIONS = [
    { value: "CGV Vincom Mega Mall", label: "CGV Vincom Mega Mall" },
    { value: "CGV Vincom Plaza", label: "CGV Vincom Plaza" },
    { value: "CGV Vincom Center", label: "CGV Vincom Center" },
    { value: "CGV Vincom Landmark", label: "CGV Vincom Landmark" }
  ];

  useEffect(() => {
    updateFilteredData();
  }, [state.searchText, state.statusFilter, state.typeFilter, state.cinemaFilter]);

  const updateFilteredData = () => {
    let data = [...INIT_DATA];
    
    if (state.searchText) {
      const lowerSearch = state.searchText.toLowerCase();
      data = data.filter(item =>
        item.id.toLowerCase().includes(lowerSearch) ||
        item.cinema.toLowerCase().includes(lowerSearch) ||
        item.location.toLowerCase().includes(lowerSearch))
    }
    
    if (state.statusFilter) {
      data = data.filter(item => item.status === state.statusFilter);
    }
    
    if (state.typeFilter) {
      data = data.filter(item => item.type === state.typeFilter);
    }
    
    if (state.cinemaFilter) {
      data = data.filter(item => item.cinema === state.cinemaFilter);
    }
    
    setState(prev => ({ ...prev, filteredData: data }));
  };

  const handleEdit = (record) => {
    setState(prev => ({
      ...prev,
      editingScreen: record,
      isModalEditOpen: true
    }));
  };

  const handleStatusFilter = (value) => {
    setState(prev => ({ ...prev, statusFilter: value }));
  };

  const handleTypeFilter = (value) => {
    setState(prev => ({ ...prev, typeFilter: value }));
  };

  const handleCinemaFilter = (value) => {
    setState(prev => ({ ...prev, cinemaFilter: value }));
  };

  const handleSearch = (value) => {
    setState(prev => ({ ...prev, searchText: value }));
  };

  const handleModalToggle = (modalType, isOpen) => {
    setState(prev => ({ ...prev, [`is${modalType}Open`]: isOpen }));
  };

  const handleAddSubmit = (values) => {
    console.log("Added screen:", values);
    handleModalToggle("ModalAdd", false);
  };

  const handleEditSubmit = (values) => {
    console.log("Edited screen:", values);
    handleModalToggle("ModalEdit", false);
  };

  const columns = [
    {
      title: "Screen Info",
      key: "info",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size="large" 
            style={{ 
              backgroundColor: record.type === "IMAX" ? '#13c2c2' : 
                            record.type === "VIP" ? '#fa8c16' : 
                            record.type === "4DX" ? '#722ed1' : 
                            record.type === "Premium" ? '#eb2f96' : '#1890ff',
              color: '#fff'
            }}
          >
            {record.type.charAt(0)}
          </Avatar>
          <div>
            <div className="font-bold text-blue-600">{record.id}</div>
            <div className="flex items-center text-xs text-gray-500">
              <EnvironmentOutlined className="mr-1" />
              {record.cinema}
            </div>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag 
          color={
            type === "IMAX" ? 'cyan' : 
            type === "VIP" ? 'volcano' : 
            type === "4DX" ? 'geekblue' : 
            type === "Premium" ? 'magenta' : 'blue'
          }
        >
          {type}
        </Tag>
      ),
      width: 150,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity) => (
        <Badge
          count={`${capacity} seats`}
          className="bg-gray-100 text-gray-800"
          style={{ padding: "0 8px" }}
        />
      ),
      sorter: (a, b) => a.capacity - b.capacity,
      width: 150,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location) => <span className="text-gray-600">{location}</span>,
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <TagStatus status={status} />,
      width: 150,
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
                onClick: () => handleEdit(record),
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            icon={<EllipsisOutlined />}
            shape="default"
          />
        </Dropdown>
      ),
      width: 100,
      align: 'center',
    },
  ];

  return (
    <>
      <Card
        title={<span className="text-2xl font-bold">Screen Management</span>}
        extra={
          <Space>
            <Select
              placeholder="Filter by Status"
              value={state.statusFilter}
              onChange={handleStatusFilter}
              style={{ width: 150 }}
              allowClear
              options={STATUS_OPTIONS}
            />
            
            <Select
              placeholder="Filter by Type"
              value={state.typeFilter}
              onChange={handleTypeFilter}
              style={{ width: 150 }}
              allowClear
              options={TYPE_OPTIONS}
            />
            
            <Select
              placeholder="Filter by Cinema"
              value={state.cinemaFilter}
              onChange={handleCinemaFilter}
              style={{ width: 200 }}
              allowClear
              options={CINEMA_OPTIONS}
            />
            
            <Search
              placeholder="Search screens..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
            
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModalToggle("ModalAdd", true)}
            >
              Add Screen
            </Button>
          </Space>
        }
        variant="borderless"
        style={{boxShadow: 'none'}}
        styles={{header: {borderBottom: 'none'}}}
      >
        <ScreenStatistics data={state.filteredData.length > 0 ? state.filteredData : INIT_DATA} />
        
        <Table
          columns={columns}
          dataSource={state.filteredData.length > 0 ? state.filteredData : INIT_DATA}
          pagination={{ 
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50']
          }}
          rowClassName={record => {
            if (record.status === "Closed") return "bg-red-50 hover:bg-red-100";
            if (record.status === "Renovating") return "bg-orange-50 hover:bg-orange-100";
            if (record.status === "Inactive") return "bg-gray-50 hover:bg-gray-100";
            return "hover:bg-blue-50";
          }}
          scroll={{ x: 1000 }}
          rowKey="key"
        />
        
        <Divider />
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Showing {state.filteredData.length > 0 ? state.filteredData.length : INIT_DATA.length} screens</span>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </Card>
      
      <ModalScreenAdd
        visible={state.isModalAddOpen}
        onCancel={() => handleModalToggle("ModalAdd", false)}
        onSuccess={handleAddSubmit}
      />
      
      <ModalScreenEdit
        visible={state.isModalEditOpen}
        onCancel={() => handleModalToggle("ModalEdit", false)}
        onSuccess={handleEditSubmit}
        initialValues={state.editingScreen}
      />
    </>
  );
};

export default ScreenTable;