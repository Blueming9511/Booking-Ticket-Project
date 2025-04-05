import { Avatar, Tag, Dropdown, Button, Badge } from "antd";
import { EnvironmentOutlined, EllipsisOutlined } from "@ant-design/icons";
import TagStatus from "../../ui/Tag/TagStatus";

const CinemaInfo = ({ cinemaId, cinemaData, location=false }) => {
  const cinema = cinemaData.find(c => c.cinemaCode === cinemaId);
  console.log(cinema)
  if (location)
    return (
      <div className="flex items-center text-xs text-gray-500">
        {cinema?.location || "Unknown Cinema"}
      </div>
    );
  return (
    <div className="flex items-center text-xs text-gray-500">
      {cinema?.location.split(",").slice(-1)[0] || "Unknown Cinema"}
    </div>
  );
};

export const columns = (handleEdit, handleDelete, cinemaData) => [
  {
    title: "Screen Info",
    key: "info",
    render: (_, record, index) => (
      <div className="flex items-center gap-3">
        {console.log(record)}
        <Avatar
          size="large"
          style={{
            backgroundColor:
              record.type === "IMAX"
                ? "#13c2c2"
                : record.type === "VIP"
                  ? "#fa8c16"
                  : record.type === "4DX"
                    ? "#722ed1"
                    : record.type === "Premium"
                      ? "#eb2f96"
                      : "#1890ff",
            color: "#fff",
          }}
        >
          {record.type.charAt(0)}
        </Avatar>
        <div>
          <div className="font-bold text-blue-600">
            {" "}
            #{record.screenCode}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <EnvironmentOutlined className="mr-1" />
            <CinemaInfo cinemaId={record.cinemaId} cinemaData={cinemaData} />
          </div>
        </div>
      </div>
    ),
    width: 250,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <Tag
        color={
          type === "IMAX"
            ? "cyan"
            : type === "VIP"
              ? "volcano"
              : type === "4DX"
                ? "geekblue"
                : type === "Premium"
                  ? "magenta"
                  : "blue"
        }
      >
        {type}
      </Tag>
    ),
    filters: [
      { text: "IMAX", value: "IMAX" },
      { text: "VIP", value: "VIP" },
      { text: "4DX", value: "4DX" },
      { text: "Premium", value: "Premium" },
      { text: "Standard", value: "Standard" },
    ],
    onFilter: (value, record) => record.type === value,
    width: 150,
  },
  {
    title: "Capacity",
    dataIndex: "capacity",
    key: "capacity",
    render: (capacity) => (
      <Badge
        count={`${capacity} seats`}
        className="bg-gray-100 text-gray-800"
        style={{ padding: "0 8px" }}
      />
    ),
    sorter: (a, b) => a.capacity - b.capacity,
    width: 150,
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    render: (_, record) => <CinemaInfo cinemaId={record.cinemaId} cinemaData={cinemaData} location />,
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <TagStatus status={status} />,
    filters: [
      { text: "Active", value: "ACTIVE" },
      { text: "Inactive", value: "INACTIVE" },
    ],
    onFilter: (value, record) => record.status === value,
    width: 150,
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
              onClick: () =>{console.log("2222", record.id); handleDelete(record.id)},
              danger: true,
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button icon={<EllipsisOutlined />} shape="default" />
      </Dropdown>
    ),
    width: 100,
    align: "center",
  },
];
