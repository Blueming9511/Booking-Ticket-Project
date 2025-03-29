import React from "react";
import DynamicTable from "../../components/ui/DynamicTable";
import { Badge, Tag } from "antd";

const columns = [
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    render: (code) => <p className="font-bold">{code}</p>,
  },
  { title: "Discount", dataIndex: "discount", key: "discount" },
  { title: "Expiry", dataIndex: "expiry", key: "expiry" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      console.log("Status value:", status);
      let color;
      switch (status) {
        case "Active":
          color = "green";
          break;
        case "Expired":
          color = "red";
          break;
        case "Inactive":
          color = "lightgray";
          break;
        default:
          color = "blue";
      }
      return (
        <Tag color={color} bordered={false}>
          <p className="text-[0.8rem]">{status}</p>
        </Tag>
      );
    },
  },
];

const initData = [
  {
    key: "1",
    code: "DISCOUNT10",
    discount: "10%",
    start: "2025-01-01",
    expiry: "2025-06-30",
    status: "Active",
    description: "Get 10% off on all orders above $50.",
    condition: "Minimum purchase of $50 required.",
  },
  {
    key: "2",
    code: "FREESHIP",
    discount: "Free Shipping",
    start: "2025-01-01",
    expiry: "2025-05-15",
    status: "Expired",
    description: "Enjoy free shipping on all orders.",
    condition: "Valid for orders above $30.",
  },
  {
    key: "3",
    code: "WELCOME20",
    discount: "20%",
    start: "2025-01-01",
    expiry: "2025-12-31",
    status: "Active",
    description: "Exclusive 20% discount for first-time users.",
    condition: "Valid for new customers only.",
  },
  {
    key: "4",
    code: "MOVIEDEAL",
    discount: "15%",
    start: "2025-01-01",
    expiry: "2025-08-10",
    status: "Active",
    description: "Save 15% on all movie ticket bookings.",
    condition: "Valid for a maximum of 2 tickets per order.",
  },
  {
    key: "5",
    code: "SUMMER25",
    discount: "25%",
    start: "2025-01-01",
    expiry: "2025-07-20",
    status: "Inactive",
    description: "Get 25% off on summer collection.",
    condition: "Valid on selected items only.",
  },
];
const Coupon = () => {
  return (
    <div>
      <DynamicTable columns={columns} initData={initData} modalType="coupon" />
    </div>
  );
};

export default Coupon;
