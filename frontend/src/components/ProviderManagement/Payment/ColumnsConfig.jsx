import React from "react";
import {
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
  WalletOutlined,
  EllipsisOutlined,
  QuestionOutlined,
  ClockCircleOutlined,
  QrcodeOutlined
} from "@ant-design/icons";
import { Button, Dropdown, Tag } from "antd";
const columns = (handleEdit, handleDelete) => [
  {
    title: "Payment ID",
    dataIndex: "paymentCode",
    key: "paymentCode",
    render: (id) => <span className="font-mono font-bold text-blue-600  ">#{id}</span>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => (
      <span className="font-semibold text-sm">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
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
        case "VISA":
          icon = <CreditCardOutlined className="text-blue-500" />;
          color = "blue";
          break;
        case "MOMO":
          icon = <QrcodeOutlined className="text-green-500" />;
          color = "green";
          break;
        case "BANK":
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
    dataIndex: "date",
    key: "date",
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
            {console.log(date)}
          {new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    ),
    sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
    width: 300,
},
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let icon, color;
      switch (status) {
        case "APPROVED":
          icon = <CheckCircleOutlined />;
          color = "green";
          break;
        case "PENDING":
          icon = <ClockCircleOutlined />;
          color = "orange";
          break;
        case "REJECTED":
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
              danger: true,
              onClick: () => handleDelete(record),
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

export default columns;
