import React from "react";
import { Badge, Button, Dropdown, Tag } from "antd";
import dayjs from "dayjs";

import {
  EllipsisOutlined,
  FireOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const columns = (handleEdit, handleDelete) => [
  {
    title: "Coupon Code",
    dataIndex: "couponCode",
    key: "couponCode",
    render: (code) => (
      <Badge
        count={code}
        className="font-mono font-bold text-base"
        style={{ backgroundColor: "#1890ff" }}
      />
    ),
    width: 150,
  },
  {
    title: "Offer",
    dataIndex: "discountValue",
    key: "discountValue",
    render: (discount) => (
      <div className="flex items-center gap-2">
        {discount != 0 ? (
          <FireOutlined className="text-red-500 text-lg" />
        ) : (
          <GiftOutlined className="text-green-500 text-lg" />
        )}
        <span
          className={`font-semibold w-[5rem] ${
            discount != 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {discount != 0 ? (
            <Badge count={`${discount}% OFF`} />
          ) : (
            <Badge count="FREE DELIVERY" color="green" />
          )}
        </span>
      </div>
    ),
    width: 100,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (description) => (
      <span className="text-gray-500 text-sm">
        {description || "No description provided"}
      </span>
    ),
    width: 200,
  },
  {
    title: "Conditions",
    key: "conditions",
    render: (_, record) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-gray-600  ">Min. Order:</span>
          <span className="font-medium">
            {record.minOrderValue ? `$${record.minOrderValue}` : "None"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Usage Limit:</span>
          <span className="font-medium">
            {record.usageLimit ? `${record.usageLimit} uses` : "Unlimited"}
          </span>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Validity",
    dataIndex: "validity",
    key: "validity",
    render: (_, record) => (
      <>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-gray-500" />
            <span className="text-gray-700">{record.expiryDate}</span>
          </div>
          <span className="text-xs text-gray-500">
            From: {record.startDate}
          </span>
        </div>
      </>
    ),
    width: 150,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, record) => {
      let icon, color, text;

      const now = dayjs();
      const start = dayjs(record.startDate);
      const end = dayjs(record.expiryDate);

      let status;
      if (end.isBefore(now)) {
        status = "Expired";
      } else if (start.isAfter(now)) {
        status = "Inactive";
      } else {
        status = "Active";
      }

      switch (status) {
        case "Active":
          icon = <CheckCircleOutlined />;
          color = "#52c41a";
          break;
        case "Expired":
          icon = <CloseCircleOutlined />;
          color = "#f5222d";
          break;
        case "Inactive":
          icon = <ClockCircleOutlined />;
          color = "#faad14";
          text = "Inactive";
          break;
        default:
          color = "#d9d9d9";
      }

      return (
        <Badge
          color={color}
          text={<span style={{ color }}></span>}
          icon={icon}
        />
      );
    },
    align: "center",
    width: 50,
    filters: [
      { text: "Active", value: "active" },
      { text: "Inactive", value: "inactive" },
      { text: "Expired", value: "expired" },
    ],
    onFilter: (value, record) => {
      const now = dayjs();
      const start = dayjs(record.startDate);
      const end = dayjs(record.expiryDate);

      if (value === "active") return start <= now && end >= now;
      if (value === "inactive") return start > now;
      if (value === "expired") return end < now;
      return true;
    },
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
