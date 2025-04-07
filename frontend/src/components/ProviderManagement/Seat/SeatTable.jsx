import { Table, Button } from "antd";
import { columns } from "./ColumnsConfig";
export const SeatTable = ({ data, onEdit, onDelete, loading, cinemas, screens }) => {
  return (
    <Table
      columns={columns(onEdit, onDelete, cinemas, screens)}
      dataSource={data}
      pagination={{
        pageSize: 5,
        responsive: true,
      }}
      rowClassName={(record) => {
        if (record.status === "INACTIVE") return "bg-gray-50 hover:bg-gray-100";
        if (record.status === "BOOKED") return "bg-blue-50 hover:bg-blue-100";
        return "hover:bg-blue-50";
      }}
      scroll={{ x: 1000 }}
      rowKey="key"
      loading={loading}
      size="middle"
    />
  );
};
