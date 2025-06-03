import React from "react";
import { Table, Divider } from "antd";
import { columns } from "./ColumnsConfig";

export const CinemaTable = ({ data, onEdit, onDelete, pagination, onPageChange }) => {
  return (
    <>
      <Table
        columns={columns(onEdit, onDelete)}
        dataSource={data}
        pagination={{
          current: pagination.page + 1,
          pageSize: pagination.size,
          total: pagination.totalElements,
          showSizeChanger: false,
          onChange: (page) => onPageChange(page - 1)
        }}
        rowKey="id"
        className="rounded-lg"
        rowClassName="hover:bg-gray-50 cursor-pointer"
        scroll={{ x: "max-content" }}
      />
      <Divider />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Total: {pagination.totalElements} cinemas</span>
      </div>
    </>
  );
};
