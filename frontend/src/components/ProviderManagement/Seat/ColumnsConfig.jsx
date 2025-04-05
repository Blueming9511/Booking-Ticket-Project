import { Avatar, Tooltip, Progress, Dropdown, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import TagStatus from "../../ui/Tag/TagStatus";
import TagType from "../../ui/Tag/TagType";

export const columns = (
  handleEdit,
  handleDelete,
  cinemas = [],
  screens = []
) => [
  {
    title: "Seat Info",
    key: "info",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <Avatar
          size="default"
          style={{
            backgroundColor:
              record.type === "VIP"
                ? "#ffd666"
                : record.type === "Couple"
                  ? "#d3adf7"
                  : "#91d5ff",
            color:
              record.type === "VIP"
                ? "#d48806"
                : record.type === "Couple"
                  ? "#531dab"
                  : "#096dd9",
          }}
          className="font-bold"
        >
          {record.row}
        </Avatar>
        <div>
          <div className="font-bold text-base text-blue-600">
            #{record.seatCode}
          </div>
          <div className="text-gray-500 text-xs">
            Seat {record.number} - Row {record.row}
          </div>
        </div>
      </div>
    ),
    sorter: (a, b) => a.seatCode.localeCompare(b.seatCode),
    width: 180,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) => <TagType type={type} />,
    filters: [
      { text: "Standard", value: "STANDARD" },
      { text: "VIP", value: "VIP" },
      { text: "Couple", value: "COUPLE" },
    ],
    onFilter: (value, record) => record.type === value,
    width: 120,
  },
  {
    title: "Price Multiplier",
    dataIndex: "multiplier",
    key: "multiplier",
    render: (multiplier) => (
      <Tooltip title={`Price multiplier: ${multiplier}x`}>
        <Progress
          percent={Math.round(multiplier * 50)}
          showInfo={false}
          strokeColor={
            multiplier > 2
              ? "#ff4d4f"
              : multiplier > 1.5
                ? "#faad14"
                : "#52c41a"
          }
        />
      </Tooltip>
    ),
    sorter: (a, b) => a.multiplier - b.multiplier,
    width: 200,
  },
  {
    title: "Location",
    key: "location",
    render: (_, record) => {
      const cinema = cinemas[record.cinemaCode];
      const screen = screens[record.cinemaCode]?.find(s => s.value === record.screenCode);
      console.log(screen)
      return (
        <div className="flex flex-col">
          <span className="font-medium text-base">
            {cinema}
          </span>
          <span className="text-gray-500 text-xs">
            {screen?.label}
          </span>
        </div>
      );
    },
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <TagStatus status={status} />,
    filters: [
      { text: "Available", value: "AVAILABLE" },
      { text: "Booked", value: "BOOKED" },
      { text: "Maintenance", value: "MAINTAINANCE" },
    ],
    onFilter: (value, record) => record.status === value,
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
              label: "Edit Seat",
              icon: <EditOutlined />,
              onClick: () => handleEdit(record),
            },
            {
              key: "delete",
              label: "Delete Seat",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete(record.id),
            },
          ],
        }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          icon={<EllipsisOutlined />}
          shape="default"
          className="flex items-center justify-center"
        />
      </Dropdown>
    ),
    width: 80,
    align: "center",
  },
];
