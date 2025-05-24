import React, { useState, useEffect } from "react";
import { Card, Space, Button, Input, message, Table, Popconfirm, Select, Badge, Modal, Divider } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { Dropdown, Tag, Avatar } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import TagStatus from "../../components/ui/Tag/TagStatus";
import TheaterLayoutView from "../../components/ProviderManagement/Layout/TheaterLayoutView";

import { Monitor } from "lucide-react";
import { MdKeyboardArrowDown } from "react-icons/md";

const { Search } = Input;

const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
        case "PENDING":
            return [
                { value: "APPROVED", label: "Confirmed" },
                { value: "REJECTED", label: "Rejected" },
                { value: "MAINTAINED", label: "Maintenance" }
            ];
        case "APPROVED":
            return [
                { value: "MAINTAINED", label: "Maintenance" },
                { value: "REJECTED", label: "Rejected" }
            ];
        case "REJECTED":
            return [];
        default:
            return [
                { value: "MAINTAINED", label: "Maintenance" },
                { value: "CLOSED", label: "Closed" }
            ];
    }
};

const TagType = ({ type }) => {
    return (
        <Tag
            color={
                type === "IMAX" ? "cyan" :
                    type === "VIP" ? "volcano" :
                        type === "4DX" ? "geekblue" :
                            type === "Premium" ? "magenta" : "blue"
            }
            className="text-xs font-semibold flex-shrink-0"
            style={{ lineHeight: '16px' }}
        >
            {type}
        </Tag>
    );
};

const columns = (handleStatusChange) => [
    {
        title: "Screen Info",
        key: "info",
        render: (_, record) => (
            <div className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <Avatar
                    size={48}
                    style={{
                        backgroundColor: "#e6f7ff",
                        color: "#1890ff",
                        fontSize: "20px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                    }}
                    icon={<EnvironmentOutlined />}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                        <div className="font-bold text-blue-600 truncate">#{record.cinemaCode}</div>
                        <TagType type={record.type} />
                    </div>
                    <div className="text-base font-semibold text-gray-800 truncate mt-1">
                        {record.cinemaName}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                        <UserOutlined className="mr-1 flex-shrink-0" />
                        <span className="truncate font-medium">
                            {record.owner || 'Unknown owner'}
                        </span>
                    </div>
                </div>
            </div>
        ),
        width: 250,
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
        dataIndex: "cinemaLocation",
        key: "cinemaLocation",
        render: (location) => <p className="text-xs text-gray-600">{location}</p>,
        width: 200,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status, record) => {
            const options = getStatusOptions().map(opt => ({
                key: opt.value,
                label: (
                    <div className="flex items-center gap-2">
                        <TagStatus status={opt.value} />
                    </div>
                ),
                onClick: (e) => {
                    e.stopPropagation();
                    handleStatusChange(record.id, opt.value);
                }
            }));
            return (
                <div className="flex items-center">
                    <TagStatus status={status} />
                    <Dropdown
                        placement="bottomRight"
                        menu={{ items: options }}
                        trigger={['click']}
                    >
                        <div p-2 onClick={e => e.stopPropagation()}>
                            <MdKeyboardArrowDown />
                        </div>
                    </Dropdown>
                </div>
            )
        },
        onFilter: (value, record) => record.status === value,
        width: 150,
    },
];

const Screens = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [Screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/owners', {
                    withCredentials: true
                });
                setOwners(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        }
        fetchOwners();
    }, [])


    const fetchData = async (page = 1, pageSize = 5, selectedOwner = null) => {
        try {
            setLoading(true);
            const url = `http://localhost:8080/api/admin/screens?page=${page - 1}&size=${pageSize}`;
            if (selectedOwner) {
                url += `&owner=${selectedOwner}`;
            }
            const response = await axios.get(url, {
                withCredentials: true,
            });
            setScreens(response.data.content);
            setPagination({
                ...pagination,
                current: page,
                pageSize,
                total: response.data.totalElements
            });
        } catch (error) {
            console.error('Error fetching Screens:', error);
            messageApi.error('Failed to fetch Screens');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/admin/screens/${id}/status`, {
                status
            }, {
                withCredentials: true,
            })
            messageApi.success('Screen status updated successfully');
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            messageApi.error('Failed to update screen status');
            console.error('Status update error:', error);
        }
    }

    return (
        <>
            {contextHolder}
            <Card
                variant="borderless"
                style={{ boxShadow: "none" }}
            >
                <div className="max-w-xs sm:max-w-md">
                    <span className="text-3xl font-black break-words">
                        SCREENS MANAGEMENT
                    </span>
                </div>
                <Divider />
                <div className="flex flex-col justify-between mb-5 gap-3 lg:flex-row">
                    <div>
                        <Select
                            allowClear
                            options={owners.map(o => ({ value: o, label: o }))}
                            placeholder="Select Owner"
                            onChange={(value) => setSelectedOwner(value)}
                            className="w-48"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Search
                            placeholder="Search screen..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            style={{ width: 300 }}
                        />

                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={() => fetchData(pagination.current, pagination.pageSize)}
                        />
                    </div>
                </div>

                <Table
                    columns={columns(handleStatusChange)}
                    dataSource={Screens}
                    loading={loading}
                    pagination={pagination}
                    onChange={(pagination) => fetchData(pagination.current, pagination.pageSize)}
                    scroll={{ x: "max-content" }}
                    rowKey="id"
                    className="rounded-lg"
                    rowClassName="hover:bg-gray-50 cursor-pointer"
                    size="middle"
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedScreen(record);
                            setIsModalDetailOpen(true);
                        },
                    })}
                />
            </Card>

            <Modal
                title={
                    <div className="flex items-center mb-10">
                        <Monitor className="mr-2" size={20} />
                        <span>Theater structure: {selectedScreen?.screenCode}</span>
                    </div>
                }
                open={isModalDetailOpen}
                onCancel={() => setIsModalDetailOpen(false)}
                footer={null}
                width={600}
            >
                {selectedScreen && (
                    <TheaterLayoutView
                        screen={selectedScreen}
                    />
                )}
            </Modal>
        </>
    );
};

export default Screens;