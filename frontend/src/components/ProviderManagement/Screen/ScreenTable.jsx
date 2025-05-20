import { Divider, Table } from "antd";
import { columns } from "./ColumnsConfig";

const ScreenTable = ({ data, onEdit, onDelete, loading, cinemas, pagination, onSetPage }) => {
  return (
    <>
      <Table
        columns={columns(onEdit, onDelete, cinemas)}
        dataSource={data}
        pagination={{
          current: pagination.page + 1,
          pageSize: pagination.size,
          total: pagination.totalElements,
          responsive: true,
          onChange: (page) => onSetPage(page - 1),
        }}
        rowClassName={(record) => {
          if (record.status === "Closed") return "bg-red-50 hover:bg-red-100";
          if (record.status === "Renovating")
            return "bg-orange-50 hover:bg-orange-100";
          if (record.status === "Inactive")
            return "bg-gray-50 hover:bg-gray-100";
          return "hover:bg-blue-50";
        }}
        scroll={{ x: true }}
        size="middle"
        rowKey="key"
        loading={loading}
      />

      <Divider />

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          Showing{" "}
          {data.length}{" "}
          screens
        </span>
        <span>Last updated: {new Date().toLocaleString()}</span>
      </div>
    </>
  );
};

export default ScreenTable;
