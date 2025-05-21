import {Table, Divider} from "antd";
import {columns} from "./ColumnsConfig";

const MovieTable = ({data, onEdit, onDelete, pagination, onChangePage}) => {
    return (
        <>
            <Table
                columns={columns(onEdit, onDelete)}
                dataSource={data}
                rowKey="id"
                className="rounded-lg"
                rowClassName="hover:bg-gray-50 cursor-pointer"
                scroll={{x: true}}
                size="middle"
                pagination={{
                    current: pagination.page + 1,
                    pageSize: pagination.size,
                    total: pagination.totalElements - 1,
                    showSizeChanger: false,
                    responsive: true,
                    onChange: (page) => onChangePage(page - 1)
                }}
            />
            <Divider/>
            <div className="flex justify-between text-sm text-gray-500">
                <span>Total: {data.length} movies</span>
            </div>
        </>
    );
};

export default MovieTable;