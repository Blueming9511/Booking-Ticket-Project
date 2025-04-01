import React, { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Divider,
  Card,
  Button,
  Dropdown,
  Form,
  Input,
  Select,
  DatePicker,
  Badge,
  Avatar,
} from "antd";
import {
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  DownOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  EllipsisOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import ModalPaymentAdd from "../../components/ui/Modal/ModalPaymentAdd";
import ModalPaymentEdit from "../../components/ui/Modal/ModalPaymentEdit";
import dayjs from "dayjs";
import PaymentStatistics from "../../components/ui/Card/PaymentStatistics";

const { Search } = Input;
const { RangePicker } = DatePicker;

const data = [
  {
    key: "1",
    id: "PAY78901",
    amount: 25.99,
    method: "Credit Card",
    transactionDate: "2023-05-15T10:30:00",
    status: "Completed",
  },
  {
    key: "2",
    id: "PAY78902",
    amount: 42.5,
    method: "E-Wallet",
    transactionDate: "2023-05-16T14:45:00",
    status: "Completed",
  },
  {
    key: "3",
    id: "PAY78903",
    amount: 18.75,
    method: "Bank Transfer",
    transactionDate: "2023-05-17T09:15:00",
    status: "Pending",
  },
  {
    key: "4",
    id: "PAY78904",
    amount: 60.0,
    method: "Credit Card",
    transactionDate: "2023-05-18T16:20:00",
    status: "Failed",
  },
  {
    key: "5",
    id: "PAY78905",
    amount: 33.25,
    method: "E-Wallet",
    transactionDate: "2023-05-19T11:10:00",
    status: "Completed",
  },
  {
    key: "6",
    id: "PAY78906",
    amount: 75.5,
    method: "Bank Transfer",
    transactionDate: "2023-05-20T13:30:00",
    status: "Completed",
  },
  {
    key: "7",
    id: "PAY78907",
    amount: 22.99,
    method: "Credit Card",
    transactionDate: "2023-05-21T17:45:00",
    status: "Pending",
  },
  {
    key: "8",
    id: "PAY78908",
    amount: 50.0,
    method: "E-Wallet",
    transactionDate: "2023-05-22T12:00:00",
    status: "Completed",
  },
  {
    key: "9",
    id: "PAY78909",
    amount: 29.95,
    method: "Bank Transfer",
    transactionDate: "2023-05-23T15:30:00",
    status: "Failed",
  },
  {
    key: "10",
    id: "PAY78910",
    amount: 65.25,
    method: "Credit Card",
    transactionDate: "2023-05-24T18:15:00",
    status: "Completed",
  },
];

const columns = (handleEdit) => [
  {
    title: "Payment ID",
    dataIndex: "id",
    key: "id",
    render: (id) => <span className="font-mono font-bold">#{id}</span>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => (
      <span className="font-semibold">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)}
      </span>
    ),
    sorter: (a, b) => a.amount - b.amount,
  },
  {
    title: "Payment Method",
    dataIndex: "method",
    key: "method",
    render: (method) => {
      let icon, color;
      switch (method) {
        case "Credit Card":
          icon = <CreditCardOutlined className="text-blue-500" />;
          color = "blue";
          break;
        case "E-Wallet":
          icon = <WalletOutlined className="text-green-500" />;
          color = "green";
          break;
        case "Bank Transfer":
          icon = <BankOutlined className="text-purple-500" />;
          color = "purple";
          break;
        default:
          icon = <QuestionOutlined className="text-gray-500" />;
          color = "gray";
      }
      return (
        <Tag
          icon={icon}
          color={color}
          className="flex items-center gap-2"
          style={{ borderRadius: "20px" }}
        >
          {method}
        </Tag>
      );
    },
    filters: [
      { text: "Credit Card", value: "Credit Card" },
      { text: "E-Wallet", value: "E-Wallet" },
      { text: "Bank Transfer", value: "Bank Transfer" },
    ],
    onFilter: (value, record) => record.method === value,
  },
  {
    title: "Date",
    dataIndex: "transactionDate",
    key: "transactionDate",
    render: (date) => (
      <div className="flex flex-col">
        <span className="font-bold">
          {new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    ),
    sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let icon, color;
      switch (status) {
        case "Completed":
          icon = <CheckCircleOutlined />;
          color = "green";
          break;
        case "Pending":
          icon = <ClockCircleOutlined />;
          color = "orange";
          break;
        case "Failed":
          icon = <CloseCircleOutlined />;
          color = "red";
          break;
        default:
          color = "gray";
      }
      return (
        <Tag icon={icon} color={color}>
          {status}
        </Tag>
      );
    },
    filters: [
      { text: "Completed", value: "Completed" },
      { text: "Pending", value: "Pending" },
      { text: "Failed", value: "Failed" },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: "Action",
    dataIndex: "action",
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
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button
          icon={<EllipsisOutlined />}
          shape="default"
          style={{ padding: "0" }}
        />
      </Dropdown>
    ),
    width: 100,
  },
];

const Payment = () => {
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [filterParams, setFilterParams] = useState({
    status: null,
    method: null,
    searchText: "",
    dateRange: null,
  });

  // Filter data
  const filteredData = data.filter((item) => {
    if (filterParams.status && item.status !== filterParams.status)
      return false;
    if (filterParams.method && item.method !== filterParams.method)
      return false;

    if (filterParams.searchText) {
      const searchLower = filterParams.searchText.toLowerCase();
      if (!item.id.toLowerCase().includes(searchLower)) return false;
    }

    if (filterParams.dateRange) {
      const [start, end] = filterParams.dateRange;
      const paymentDate = dayjs(item.transactionDate);
      if (start && paymentDate.isBefore(start, "day")) return false;
      if (end && paymentDate.isAfter(end, "day")) return false;
    }

    return true;
  });

  const handleEdit = (record) => {
    setEditingPayment(record);
    setIsModalEditOpen(true);
  };

  const handleAddSubmit = (values) => {
    console.log("Added payment:", values);
    setIsModalAddOpen(false);
  };

  const handleEditSubmit = (values) => {
    console.log("Edited payment:", values);
    setIsModalEditOpen(false);
  };

  const handleCancel = () => {
    setIsModalAddOpen(false);
    setIsModalEditOpen(false);
  };

  return (
    <>
      <Card
        title={<span className="text-xl font-bold">Payment Management</span>}
        extra={
          <Space>
            <Dropdown
              dropdownRender={() => (
                <Card
                  title="Filter Payments"
                  style={{ width: 300 }}
                  extra={
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        setFilterParams({
                          status: null,
                          method: null,
                          searchText: "",
                          dateRange: null,
                        })
                      }
                    >
                      Reset
                    </Button>
                  }
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <div className="text-sm font-medium mb-1">Status</div>
                      <Select
                        placeholder="Select status"
                        options={[
                          { value: "Completed", label: "Completed" },
                          { value: "Pending", label: "Pending" },
                          { value: "Failed", label: "Failed" },
                        ]}
                        style={{ width: "100%" }}
                        value={filterParams.status}
                        onChange={(value) =>
                          setFilterParams({ ...filterParams, status: value })
                        }
                        allowClear
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Method</div>
                      <Select
                        placeholder="Select method"
                        options={[
                          { value: "Credit Card", label: "Credit Card" },
                          { value: "E-Wallet", label: "E-Wallet" },
                          { value: "Bank Transfer", label: "Bank Transfer" },
                        ]}
                        style={{ width: "100%" }}
                        value={filterParams.method}
                        onChange={(value) =>
                          setFilterParams({ ...filterParams, method: value })
                        }
                        allowClear
                      />
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Date Range</div>
                      <RangePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        value={filterParams.dateRange}
                        onChange={(value) =>
                          setFilterParams({ ...filterParams, dateRange: value })
                        }
                      />
                    </div>
                  </Space>
                </Card>
              )}
              trigger={["click"]}
            >
              <Button icon={<FilterOutlined />}>
                <Space>
                  Filters
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Search
              placeholder="Search payments..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 250 }}
              value={filterParams.searchText}
              onChange={(e) =>
                setFilterParams({ ...filterParams, searchText: e.target.value })
              }
              onSearch={(value) =>
                setFilterParams({ ...filterParams, searchText: value })
              }
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalAddOpen(true)}
            >
              Add Payment
            </Button>
          </Space>
        }
        variant="borderless"
        styles={{ header: { borderBottom: "none" } }}
        style={{ boxShadow: "none" }}
      >
        <PaymentStatistics
          data={filteredData.length > 0 ? filteredData : data}
        />

        <Table
          columns={columns(handleEdit)}
          dataSource={filteredData.length > 0 ? filteredData : data}
          rowKey="key"
          pagination={{ pageSize: 5 }}
          rowClassName={(record) => {
            if (record.status === "Failed") return "bg-red-50 hover:bg-red-100";
            if (record.status === "Pending")
              return "bg-yellow-50 hover:bg-yellow-100";
            return "hover:bg-blue-50";
          }}
          scroll={{ x: 1000 }}
        />

        <Divider />

        <div className="flex justify-between text-sm text-gray-500">
          <span>
            Showing {filteredData.length} of {data.length} payments
          </span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Completed:{" "}
              {
                filteredData.filter((item) => item.status === "Completed")
                  .length
              }
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Pending:{" "}
              {filteredData.filter((item) => item.status === "Pending").length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Failed:{" "}
              {filteredData.filter((item) => item.status === "Failed").length}
            </span>
          </div>
        </div>
      </Card>

      <ModalPaymentAdd
        visible={isModalAddOpen}
        onCancel={handleCancel}
        onSuccess={handleAddSubmit}
      />

      <ModalPaymentEdit
        visible={isModalEditOpen}
        initialValues={editingPayment}
        onCancel={handleCancel}
        onSuccess={handleEditSubmit}
      />
    </>
  );
};

export default Payment;
