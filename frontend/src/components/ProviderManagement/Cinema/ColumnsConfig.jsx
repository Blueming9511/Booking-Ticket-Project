import { Avatar, Tag, Dropdown, Button } from "antd";
import { EnvironmentOutlined, EllipsisOutlined } from "@ant-design/icons";
import TagStatus from "../../ui/Tag/TagStatus";

export const columns = (handleEdit, handleDelete) => [
  {
    title: "Cinema Info",
    key: "info",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <Avatar
          size="large"
          style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
          icon={<EnvironmentOutlined />}
        />
        <div>
          <div className="font-bold  text-blue-600">#{record.cinemaCode}</div>
          <div className="text-gray-500 text-xs font-bold">{record.cinemaName}</div>
          <div className="flex items-center text-xs text-gray-500">
            <EnvironmentOutlined className="mr-1" />
            {record.location?.split(/,\s*/).pop() || record.location}
          </div>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Screens",
    dataIndex: "numberOfScreens",
    key: "numberOfScreens",
    render: (screens) => <Tag color="red-inverse" className="text-xs">{screens} screens</Tag>,
    sorter: (a, b) => a.screens - b.screens,
    width: 100,
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    width: 250,
    render: (_, record) => (
      <p className="text-xs text-gray-600">{record.location}</p>
    )
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (<TagStatus status={status} />),
    width: 50,
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
