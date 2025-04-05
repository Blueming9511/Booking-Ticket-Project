import React from "react";
import { Table, Divider } from "antd";
import columns from "./ColumnsConfig";

const CouponTable = ({ data, onEdit, onDelete }) => {
  return (
    <>
      <Table
        columns={columns(onEdit, onDelete)}
        dataSource={data}
        pagination={{ pageSize: 5, responsive: true }}
        rowKey="id"
        className="rounded-lg"
        rowClassName="hover:bg-gray-50 cursor-pointer"
        scroll={{ x: true }}
        size="middle"
      />
      <Divider />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Total: {data.length} coupons</span>
        <span className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            Inactive
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Expired
          </span>
        </span>
      </div>
    </>
  );
};

export default CouponTable;
