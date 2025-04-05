import { Table, Divider } from "antd";
import columns from "./ColumnsConfig";

const PaymentTable = ({ data, onEdit, onDelete }) => {
  return (
    <>
      <Table
        columns={columns(onEdit, onDelete)}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        rowKey="id"
        className="rounded-lg"
        rowClassName="hover:bg-gray-50 cursor-pointer"
      />
      <Divider />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Total: {data.length} payments</span>
      </div>
    </>
  );
};

export default PaymentTable;