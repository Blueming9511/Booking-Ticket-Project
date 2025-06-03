import React, { useState, useEffect } from "react";
import { Card, Space, Button, Input, message, Table, Popconfirm, Select, Divider } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { Dropdown, Tag, Avatar } from "antd";
import { EnvironmentOutlined, EllipsisOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import CinemaModal from "../../components/AdminManagement/CinemaModal";
import TagStatus from "../../components/ui/Tag/TagStatus";
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

const columns = (handleEdit, handleStatusChange) => [
    {
        title: "Cinema Info",
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
                        <Tag
                            color="blue"
                            className="text-xs font-semibold flex-shrink-0"
                            style={{ lineHeight: '16px' }}
                        >
                            {record.type || 'Standard'}
                        </Tag>
                    </div>

                    <div className="text-base font-semibold text-gray-800 truncate mt-1">
                        {record.cinemaName}
                    </div>

                    <div className="flex items-center text-xs text-gray-600 mt-1">
                        <EnvironmentOutlined className="mr-1 flex-shrink-0" />
                        <span className="truncate">
                            {record.location?.split(/,\s*/).pop() || record.location}
                        </span>
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
        width: 280,
    },
    {
        title: "Screens",
        dataIndex: "numberOfScreens",
        key: "numberOfScreens",
        render: (screens) => <Tag color="red-inverse" className="text-xs">{screens} screens</Tag>,
        sorter: (a, b) => a.numberOfScreens - b.numberOfScreens,
        width: 100,
    },
    {
        title: "Location",
        dataIndex: "location",
        key: "location",
        width: 250,
        render: (text) => <p className="text-xs text-gray-600">{text}</p>
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status, record) => {
            const options = getStatusOptions(status).map(opt => ({
                key: opt.value,
                label: (
                    <div className="flex items-center gap-2">
                        <TagStatus status={opt.value} />
                    </div>
                ),
                onClick: () => {
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
                        <div onClick={e => e.stopPropagation()}>
                            <MdKeyboardArrowDown />
                        </div>
                    </Dropdown>
                </div>
            )
        },
        onFilter: (value, record) => record.status === value,
        width: 200,
    },
    {
        title: "Actions",
        key: "action",
        render: (_, record) => (
            <Button type="primary" size="small" onClick={() => handleEdit(record)}>Edit</Button>
        ),
        width: 80,
        align: "center",
    },
];

const Cinemas = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCinema, setSelectedCinema] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/owners', {
                    withCredentials: true
                });
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        }
        fetchOwners();
    }, [])



    const fetchData = async (page = 1, pageSize = 5, selectedRole = null, searchKeyword = null, statusFilter = null) => {
        try {
            setLoading(true);
            let url = `http://localhost:8080/api/admin/cinemas?page=${page - 1}&size=${pageSize}`;

            // Thêm các tham số query
            const params = new URLSearchParams();
            if (selectedRole) params.append('owner', selectedRole);
            if (searchKeyword) params.append('address', searchKeyword);
            if (statusFilter) params.append('status', statusFilter);

            url += `&${params.toString()}`;

            const response = await axios.get(url, {
                withCredentials: true,
            });
            setCinemas(response.data.content);
            setPagination({
                ...pagination,
                current: page,
                pageSize,
                total: response.data.totalElements
            });
        } catch (error) {
            console.error('Error fetching cinemas:', error);
            messageApi.error('Failed to fetch cinemas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, selectedRole, searchKeyword, statusFilter);
    }, [selectedRole, statusFilter, searchKeyword]);

    const handleEdit = (cinema) => {
        setSelectedCinema(cinema);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/cinemas/${id}/status`, { status: newStatus }, {
                withCredentials: true,
            })
            messageApi.success('Cinema status updated successfully');
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            messageApi.error('Failed to update cinema status');
            console.error('Status update error:', error);
        }
    }

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:8080/api/admin/cinemas/${id}`, {
                withCredentials: true,
            });
            messageApi.success('Cinema deleted successfully');
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            messageApi.error('Failed to delete cinema');
            console.error('Delete error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        console.log(!!selectedCinema, values)
        const isEdit = !!selectedCinema;
        const config = {
            method: isEdit ? "put" : "post",
            url: isEdit
                ? `http://localhost:8080/api/admin/cinemas/${selectedCinema.id}`
                : "http://localhost:8080/api/admin/cinemas",
            data: values,
            withCredentials: true,
        };

        try {
            setLoading(true);
            await axios(config);
            messageApi.success(`Cinema ${isEdit ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            messageApi.error(`Failed to ${isEdit ? 'update' : 'create'} cinema`);
            console.error(`${isEdit ? 'Update' : 'Create'} error:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Card
                variant="borderless"
                style={{ boxShadow: "none" }}
            >
                <div className="max-w-xs sm:max-w-md">
                    <span className="text-3xl font-black break-words">
                        CINEMAS MANAGEMENT
                    </span>
                </div>
                <Divider />
                <div className="flex flex-col justify-between mb-5 gap-3 lg:flex-row">
                    <div className="flex gap-2 flex-wrap">
                        <Select
                            allowClear
                            options={roles.map(role => ({ value: role, label: role }))}
                            placeholder="Filter by Owner"
                            onChange={(value) => setSelectedRole(value)}
                            className="w-48"
                        />

                        <Select
                            allowClear
                            options={[
                                { value: 'PENDING', label: 'Pending' },
                                { value: 'APPROVED', label: 'Approved' },
                                { value: 'REJECTED', label: 'Rejected' },
                                { value: 'OPEN', label: 'Open' },
                                { value: 'CLOSED', label: 'Closed' },
                                { value: 'MAINTAINED', label: 'Maintained' }
                            ]}
                            placeholder="Filter by Status"
                            onChange={(value) => setStatusFilter(value)}
                            className="w-48"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Search
                            placeholder="Search by name or code..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={(value) => {
                                setSearchKeyword(value);
                                fetchData(1, pagination.pageSize, selectedRole);
                            }}
                            style={{ width: 300 }}
                        />

                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                setSearchKeyword('');
                                setStatusFilter(null);
                                setSelectedRole(null);
                                fetchData(1, pagination.pageSize);
                            }}
                        />
                    </div>
                </div>

                <Table
                    columns={columns(handleEdit, handleDelete, handleStatusChange)}
                    dataSource={cinemas}
                    loading={loading}
                    pagination={pagination}
                    onChange={(pagination) => fetchData(pagination.current, pagination.pageSize, selectedRole)}
                    scroll={{ x: "max-content" }}
                    rowKey="id"
                    className="rounded-lg"
                    rowClassName="hover:bg-gray-50 cursor-pointer"
                    size="middle"
                />
            </Card >

            <CinemaModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onFinish={handleSubmit}
                initialValues={selectedCinema}
                loading={loading}
            />
        </>
    );
};

export default Cinemas;