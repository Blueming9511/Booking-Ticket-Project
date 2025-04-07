import { Table, Divider } from "antd";
import { columns } from "./ColumnsConfig";

const MovieTable = ({ data, onEdit, onDelete }) => {
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
        <span>Total: {data.length} movies</span>
      </div>
    </>
  );
};

export default MovieTable;