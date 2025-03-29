import React from "react";
import DynamicTable from "../../components/ui/DynamicTable";
import { Tag } from "antd";

// Định nghĩa columns với render cho cột Status
const columns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Location", dataIndex: "location", key: "location" },
  { title: "Screens", dataIndex: "screens", key: "screens" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color;
      switch (status) {
        case "Active":
          color = "green"; // Xanh lá
          break;
        case "Closed":
          color = "red"; // Đỏ
          break;
        case "Renovating":
          color = "orange"; // Cam
          break;
        default:
          color = "blue"; // Xanh dương mặc định
      }
      return (
        <Tag
          color ={color}
        >
          <p className="text-[0.8rem]">{status}</p>
        </Tag>
      );
    },
  },
];

// 10 dữ liệu mẫu về rạp chiếu phim (dựa trên thông tin thực tế và giả định)
const initData = [
  {
    key: "1",
    name: "CGV Vincom Mega Mall",
    location: "Ho Chi Minh City, Vietnam",
    screens: 8,
    status: "Active",
  },
  {
    key: "2",
    name: "Cineworld Leicester Square",
    location: "London, UK",
    screens: 6,
    status: "Active",
  },
  {
    key: "3",
    name: "AMC Empire 25",
    location: "New York, USA",
    screens: 25,
    status: "Active",
  },
  {
    key: "4",
    name: "Regal LA Live",
    location: "Los Angeles, USA",
    screens: 14,
    status: "Active",
  },
  {
    key: "5",
    name: "Vue West End",
    location: "London, UK",
    screens: 9,
    status: "Renovating",
  },
  {
    key: "6",
    name: "Cinépolis Luxury Cinemas",
    location: "Dallas, USA",
    screens: 6,
    status: "Active",
  },
  {
    key: "7",
    name: "Pathé Tuschinski",
    location: "Amsterdam, Netherlands",
    screens: 6,
    status: "Active",
  },
  {
    key: "8",
    name: "Odeon Luxe",
    location: "Manchester, UK",
    screens: 7,
    status: "Active",
  },
  {
    key: "9",
    name: "Galaxy Cinema Nguyễn Du",
    location: "Ho Chi Minh City, Vietnam",
    screens: 5,
    status: "Closed",
  },
  {
    key: "10",
    name: "Hoyts Chadstone",
    location: "Melbourne, Australia",
    screens: 13,
    status: "Active",
  },
];

const Cinemas = () => {
  return (
    <div>
      <h1>Cinema Management</h1>
      <DynamicTable columns={columns} initData={initData} modalType="cinema" />
    </div>
  );
};

export default Cinemas;