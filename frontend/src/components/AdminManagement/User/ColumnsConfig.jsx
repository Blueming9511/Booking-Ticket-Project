import { Dropdown, Tag, Button, Avatar } from "antd";
import { UserOutlined, EllipsisOutlined } from "@ant-design/icons";

export const columns = (handleEdit, handleDelete) => [
  {
    title: "User Info",
    key: "info",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <Avatar
          size="large"
          src={record.avatar}
          icon={<UserOutlined />}
        />
        <div>
          <div className="font-bold text-blue-600">{record.username}</div>
          <div className="text-gray-500 text-xs">{record.email}</div>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",

    render: (role) => {
        if (role === "ADMIN") return <Tag color="blue">Admin</Tag>;
        if (role === "PROVIDER") return <Tag color="green">Provider</Tag>;
        if (role === "USER") return <Tag color="red">User</Tag>;
        return null;
    },
    sorter: (a, b) => a.role.localeCompare(b.role),
    width: 100,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 250,
    render: (email) => (
      <p className="text-xs text-gray-600">{email}</p>
    )
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