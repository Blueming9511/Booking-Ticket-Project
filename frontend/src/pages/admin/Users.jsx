import { Card, Divider, Layout, message, Modal, Select, Spin, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dropdown, Tag, Tooltip, Badge, Switch } from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CrownOutlined,
    EllipsisOutlined,
    LockOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import UserEditModal from '../../components/AdminManagement/UserEditModal';

const roleOptions = [
    { value: "ADMIN", label: "Admin", color: "purple" },
    { value: "CUSTOMER", label: "User", color: "blue" },
    { value: "PROVIDER", label: "Provider", color: "green" },
];

export const columns = (handleEdit, handleBan, handleUnban) => [
    {
        title: "User",
        key: "user",
        render: (_, record) => (
            <div className="flex items-center gap-3">
                <Avatar
                    src={record.avatar}
                    icon={<UserOutlined />}
                    size="large"
                    className="bg-gray-200"
                />
                <div>
                    <div className="font-medium">
                        {record.name || <span className="text-gray-400">No name</span>}
                    </div>
                    <div className="text-sm text-gray-500">{record.email}</div>
                </div>
            </div>
        ),
        width: 250,
    },
    {
        title: "Contact",
        key: "contact",
        render: (_, record) => (
            <div className="flex flex-col">
                {record.phoneNumber ? (
                    <div className="flex items-center gap-2">
                        <PhoneOutlined className="text-gray-500" />
                        <span>{record.phoneNumber}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                        <PhoneOutlined />
                        <span>No phone</span>
                    </div>
                )}
            </div>
        ),
        width: 180,
    },
    {
        title: "Role",
        dataIndex: "role",
        key: "role",
        render: (role) => {
            const roleInfo = roleOptions.find(r => r.value === role) ||
                { label: role, color: "default" };
            return (
                <Tag
                    color={roleInfo.color}
                    icon={role === "ADMIN" ? <CrownOutlined /> : null}
                    className="flex items-center gap-1"
                >
                    {roleInfo.label}
                </Tag>
            );
        },
        filters: roleOptions,
        onFilter: (value, record) => record.role === value,
        width: 120,
    },
    {
        title: "Status",
        key: "status",
        render: (_, record) => (
            <Tooltip title={record.isBanned ? "Banned user" : "Active user"}>
                <Badge
                    status={record.isBanned ? "error" : "success"}
                    text={record.isBanned ? "Banned" : "Active"}
                />
            </Tooltip>
        ),
        width: 100,
    },
    {
        title: "Ban/Unban",
        key: "ban",
        render: (_, record) => (
            <Switch
                checkedChildren={<UnlockOutlined />}
                unCheckedChildren={<LockOutlined />}
                checked={!record.ban}
                onChange={(checked) => {
                    if (checked) {
                        handleUnban(record.id);
                    } else {
                        handleBan(record.id);
                    }
                }}
                className={record.ban ? "bg-red-500" : "bg-green-500"}
            />
        ),
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
                            label: "Edit Profile",
                            icon: <UserOutlined />,
                            onClick: () => handleEdit(record),
                        },
                        {
                            key: record.isBanned ? "unban" : "ban",
                            label: record.isBanned ? "Unban User" : "Ban User",
                            icon: record.isBanned ? <UnlockOutlined /> : <LockOutlined />,
                            danger: !record.isBanned,
                            onClick: () => record.isBanned ? handleUnban(record.id) : handleBan(record.id),
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
        width: 80,
    },
];

const Users = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        totalElements: 0
    });
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async (page = 0, size = 5) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/users?page=${page}&size=${size}&role=${role}`,
                { withCredentials: true }
            );
            const data = response.data.content;
            setUsers(data);
            setPagination({
                ...pagination,
                totalElements: response.data.totalElements
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUsers(pagination.page, pagination.size);
    }, [pagination.page, role])

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/users/${selectedUser.id}`, values, {
                withCredentials: true
            });
            messageApi.success("User updated successfully");
            fetchUsers(pagination.page, pagination.size);
            setModalOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
            messageApi.error("Failed to update user");
        }
    }


    const handleUnban = async (userId) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/users/${userId}/unban`, {
                withCredentials: true
            });
            messageApi.success("User unbanned successfully");
            fetchUsers(pagination.page, pagination.size);
        } catch (error) {
            console.error('Error unbanning user:', error);
        }
    };

    const handleBan = async (userId) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/users/${userId}/ban`, {
                withCredentials: true
            });
            messageApi.success("User banned successfully");
            fetchUsers(pagination.page, pagination.size);
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };


    return (
        <Layout>
            {contextHolder}
            <Card
                variant='borderless'
                className='bg-white rounded-2xl p-6 min-h-screen mt-15'
                style={{ boxShadow: 'none' }}
            >
                <div className="max-w-xs sm:max-w-md">
                    <span className="text-3xl font-black break-words">
                        USERS MANAGEMENT
                    </span>
                </div>
                <Divider />
                <div className='flex flex-col gap-5'>
                    <Select
                        allowClear
                        placeholder={"Role"}
                        style={{ width: 150 }}
                        onChange={(value) => setRole(value)}
                        options={[
                            { value: "ADMIN", label: "Admin" },
                            { value: "CUSTOMER", label: "User" },
                            { value: "PROVIDER", label: "Provider" },
                        ]}
                    />
                    <Table
                        columns={columns(handleEdit, handleBan, handleUnban)}
                        dataSource={users}
                        loading={loading}
                        pagination={{
                            current: pagination.page + 1,
                            pageSize: pagination.size,
                            total: pagination.totalElements - 1,
                            responsive: true,
                            onChange: (page) => setPagination({ ...pagination, page: page - 1 })
                        }}
                        scroll={{ x: "max-content" }}
                    />
                </div>
            </Card>

            <UserEditModal
                initialValues={selectedUser}
                visible={modalOpen}
                onCancel={() => setModalOpen(false)}
                onFinish={handleSubmit}
            />
        </Layout>
    );
}

export default Users;
