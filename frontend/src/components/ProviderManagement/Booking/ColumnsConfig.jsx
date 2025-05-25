import React from "react";
import { Button, Dropdown, Image, Tag, Badge, Divider } from "antd";
import { 
  ClockCircleOutlined, 
  EditOutlined, 
  EllipsisOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "orange" },
  { value: "CONFIRMED", label: "Confirmed", color: "blue" },
  { value: "CANCELLED", label: "Cancelled", color: "red" },
  { value: "COMPLETED", label: "Completed", color: "green" },
];

const columns = (handleEdit, handleDelete) => [
  {
    title: "Booking Info",
    dataIndex: "bookingCode",
    key: "bookingCode",
    render: (_, record) => (
      <div className="flex flex-col">
        <div className="font-bold text-lg">{record.bookingCode}</div>
        <div className="text-gray-500 text-sm">
          {dayjs.utc(record.createdAt).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm')}
        </div>
        <div className="mt-2">
          <Tag 
            color={statusOptions.find(s => s.value === record.status)?.color} 
            icon={record.status === "CANCELLED" ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            className="flex items-center gap-1"
          >
            {statusOptions.find(s => s.value === record.status)?.label}
          </Tag>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Movie & Showtime",
    key: "movie",
    render: (_, record) => (
      <div className="flex gap-3">
        <Image
          width={60}
          height={90}
          src={record.movie.thumbnail}
          className="rounded-md object-cover"
          preview={false}
        />
        <div className="flex-1">
          <div className="font-bold">{record.movie.title}</div>
          <div className="text-sm text-gray-500 flex flex-wrap gap-1">
            {record.movie.genre.map(g => (
              <Tag key={g} className="text-xs">{g}</Tag>
            ))}
          </div>
          <Divider className="my-2" />
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-blue-500" />
            <span>
              {dayjs.utc(record.showtime.startTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm')}
              {" - "}
              {dayjs.utc(record.showtime.endTime).tz('Asia/Ho_Chi_Minh').format('HH:mm')}
            </span>
          </div>
          <div className="text-sm mt-1">
            <span className="font-medium">Screen:</span> {record.showtime.screenCode}
          </div>
        </div>
      </div>
    ),
    width: 350,
  },
  {
    title: "User Info",
    key: "user",
    render: (_, record) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-500" />
          <span className="font-medium">{record.user.name}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <MailOutlined className="text-gray-500" />
          <span>{record.user.email}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <PhoneOutlined className="text-gray-500" />
          <span>{record.user.phoneNumber}</span>
        </div>
      </div>
    ),
    width: 250,
  },
  {
    title: "Seats & Price",
    key: "seats",
    render: (_, record) => (
      <div>
        <div className="font-medium mb-2">Seats:</div>
        <div className="flex flex-wrap gap-2">
          {record.bookingDetails.map(detail => (
            <Badge 
              key={detail.seatCode} 
              count={detail.seatCode} 
              color="blue" 
              className="bg-blue-100 text-blue-800 rounded px-2 py-1" 
            />
          ))}
        </div>
        <Divider className="my-2" />
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{(record.totalAmount / (1 + record.taxAmount)).toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({record.taxAmount * 100}%):</span>
          <span>{(record.totalAmount - (record.totalAmount / (1 + record.taxAmount))).toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between font-bold mt-1">
          <span>Total:</span>
          <span className="text-green-600">{record.totalAmount.toLocaleString()} VND</span>
        </div>
      </div>
    ),
    width: 250,
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
              icon: <EditOutlined />,
              onClick: () => handleEdit(record),
              disabled: record.status === "CANCELLED" || record.status === "COMPLETED"
            },
            {
              key: "cancel",
              label: "Cancel Booking",
              danger: true,
              icon: <CloseCircleOutlined />,
              onClick: () => handleDelete(record.bookingCode),
              disabled: record.status === "CANCELLED" || record.status === "COMPLETED"
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button
          icon={<EllipsisOutlined />}
          shape="default"
          style={{ padding: "0 8px" }}
        />
      </Dropdown>
    ),
    align: "center",
    width: 80,
  },
];

export default columns