import { Dropdown, Tag, Button, Avatar } from "antd";
import { CalendarOutlined, EllipsisOutlined } from "@ant-design/icons";
import TagStatus from "../../ui/Tag/TagStatus";

export const columns = (handleEdit, handleDelete, showtimes, seats, users) => [
  {
    title: "Booking Info",
    key: "info",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <Avatar
          size="large"
          style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
          icon={<CalendarOutlined />}
        />
        <div>
          <div className="font-bold text-blue-600">#{record.bookingCode}</div>
          {console.log(record, users)}
          <div className="text-gray-500 text-xs font-bold">User: {users.find((user) => user.id === record.userCode)?.username || "N/A"}</div>
          <div className="text-gray-500 text-xs">Show: {record.showTimeCode}</div>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Seats",
    dataIndex: "seatCode",
    key: "seatCode",
    render: (seats) => (
      <div>
        {seats.map(seat => (
          <Tag key={seat} color="cyan" className="text-xs">{seat}</Tag>
        ))}
      </div>
    ),
    width: 150,
  },
  {
    title: "Total Amount",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (amount) => (
      <Tag color="green" className="text-xs">
        {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </Tag>
    ),
    sorter: (a, b) => a.totalAmount - b.totalAmount,
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <TagStatus status={status} />,
    width: 100,
  },
  {
    title: "Actions",
    key: "action",
    render: (_, record) => (
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Edit",
              onClick: () => handleEdit(record),
            },
            {
              key: "delete",
              label: "Delete",
              danger: true,
              onClick: () => handleDelete(record.id),
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button icon={<EllipsisOutlined />} shape="default" />
      </Dropdown>
    ),
    width: 80,
    align: "center",
  },
];  