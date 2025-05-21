import React from "react";
import { Table, Divider } from "antd";
import { columns } from "./ColumnsConfig";
const ShowtimeTable = ({ data, onEdit, onDelete, cinemas, rooms, movies, bookingDetails }) => {
  console.log(data, cinemas, rooms, movies, bookingDetails)
    return (
    <>
        <Table
        columns={columns(onEdit, onDelete, cinemas, rooms, movies, bookingDetails)}
        dataSource={data}
        rowKey="key"
        pagination={{ pageSize: 5, responsive: true }}
        rowClassName={(record) => {
          if (record.status === "Failed") return "bg-red-50 hover:bg-red-100";
          if (record.status === "Pending")
            return "bg-yellow-50 hover:bg-yellow-100";
          return "hover:bg-blue-50";
        }}
        scroll={{ x: 1000 }}
        size="middle"
        className="rounded-lg"
      />

      <Divider />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Total: {data.length} showtimes</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Active:{" "}
            {data.filter((item) => item.status === "Active").length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Inactive:{" "}
            {data.filter((item) => item.status === "Inactive").length}
          </span>
        </div>
      </div>
    </>
  );
};

export default ShowtimeTable;
