import React, { useState, useMemo, useEffect } from "react";
import {
  Tag,
  Card,
  Space,
  Button,
  Badge,
  Table,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Avatar,
  Progress,
  Tooltip,
  Dropdown,
} from "antd";
import {
  EnvironmentOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ModalCinemaEdit from "../../components/ui/Modal/ModalCinemaEdit";
import ModalCinemaAdd from "../../components/ui/Modal/ModalCinemaAdd";
import CinemaStatistics from "../../components/ui/Card/CinemaStatistics";
import TagStatus from "../../components/ui/Tag/TagStatus";

// Reusable Components

const { Search } = Input;

const Cinemas = () => {
  // State Management
  const [state, setState] = useState({
    filteredData: [],
    searchText: "",
    statusFilter: null,
    isModalEditOpen: false,
    isModalAddOpen: false,
    editingCinema: null,
  });

  // Constants
  const INIT_DATA = [
    {
      key: "1",
      name: "CGV Vincom Mega Mall",
      location: "Q. Bình Thạnh, TP.HCM",
      screens: 8,
      status: "Active",
    },
    {
      key: "2",
      name: "CGV Vincom City",
      location: "Q. Bình Thạnh, TP.HCM",
      screens: 6,
      status: "Closed",
    },
    {
      key: "3",
      name: "CGV Vincom City",
      location: "Q. Bình Thạnh, TP.HCM",
      screens: 6,
      status: "Closed",
    },
    {
      key: "4",
      name: "CGV Vincom City",
      location: "Q. Bình Thạnh, TP.HCM",
      screens: 6,
      status: "Closed",
    },
    {
      key: "5",
      name: "CGV Vincom City",
      location: "Q. Bình Thạnh, TP.HCM",
      screens: 6,
      status: "Closed",
    },
    {
      key: "6",
      name: "CGV Vincom City",
      location: "Q. Bình Thạnh, TP.HCM",
      screens: 6,
      status: "Closed",
    },
    {
      key: "7",
      name: "CGV Vincom City",
      location: "Q. Bình Thạnh, TP.HCM",
      screens: 6,
      status: "Closed",
    },
  ];

  const STATUS_OPTIONS = [
    { value: "Active", label: "Active" },
    { value: "Closed", label: "Closed" },
    { value: "Renovating", label: "Renovating" },
  ];

  // Effects
  useEffect(() => {
    updateFilteredData();
  }, [state.searchText, state.statusFilter]);

  // Handler Functions
  const updateFilteredData = () => {
    let data = [...INIT_DATA];

    if (state.searchText) {
      const lowerSearch = state.searchText.toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.location.toLowerCase().includes(lowerSearch)
      );
    }

    if (state.statusFilter) {
      data = data.filter((item) => item.status === state.statusFilter);
    }

    setState((prev) => ({ ...prev, filteredData: data }));
  };

  const handleEdit = (record) => {
    setState((prev) => ({
      ...prev,
      editingCinema: record,
      isModalEditOpen: true,
    }));
  };

  const handleStatusFilter = (value) => {
    setState((prev) => ({ ...prev, statusFilter: value }));
  };

  const handleSearch = (value) => {
    setState((prev) => ({ ...prev, searchText: value }));
  };

  const handleModalToggle = (modalType, isOpen) => {
    setState((prev) => ({ ...prev, [`is${modalType}Open`]: isOpen }));
  };

  const handleAddSubmit = (values) => {
    console.log("Added cinema:", values);
    handleModalToggle("Add", false);
  };

  const handleEditSubmit = (values) => {
    console.log("Edited cinema:", values);
    handleModalToggle("Edit", false);
  };

  // Table Configuration
  const columns = [
    {
      title: "Cinema Info",
      key: "info",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="large"
            style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
            icon={<EnvironmentOutlined />}
          />
          <div>
            <div className="font-bold text-blue-600">{record.name}</div>
            <div className="flex items-center text-sm text-gray-500">
              <EnvironmentOutlined className="mr-1" />
              {record.location}
            </div>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Screens",
      dataIndex: "screens",
      key: "screens",
      render: (screens) => <Tag color="red-inverse">{screens} screens</Tag>,
      sorter: (a, b) => a.screens - b.screens,
      width: 150,
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
          <Button icon={<EllipsisOutlined />} shape="default" />
        </Dropdown>
      ),
      width: 80,
      align: "center",
    },
  ];

  return (
    <>
      <Card
        title={<span className="text-2xl font-bold">Cinema Management</span>}
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

            <Search
              placeholder="Search cinemas..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleModalToggle("ModalAdd", true)}
            >
              Add Cinema
            </Button>
          </Space>
        }
        variant="borderless"
        style={{ boxShadow: "none" }}
        styles={{ header: { borderBottom: "none" } }}
      >
        <CinemaStatistics data={state.filteredData} />

        <Table
          columns={columns}
          dataSource={state.filteredData}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          rowClassName={(record) => {
            if (record.status === "Closed") return "bg-red-50 hover:bg-red-100";
            if (record.status === "Renovating")
              return "bg-orange-50 hover:bg-orange-100";
            return "hover:bg-gray-50";
          }}
          scroll={{ x: 800 }}
          rowKey="key"
        />

        <Divider />

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Showing {state.filteredData.length} cinemas</span>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </Card>

      <ModalCinemaAdd
        visible={state.isModalAddOpen}
        onCancel={() => handleModalToggle("ModalAdd", false)}
        onSuccess={handleAddSubmit}
      />

      <ModalCinemaEdit
        visible={state.isModalEditOpen}
        onCancel={() => handleModalToggle("ModalEdit", false)}
        onSuccess={handleEditSubmit}
        initialValues={state.editingCinema}
      />
    </>
  );
};

export default Cinemas;
