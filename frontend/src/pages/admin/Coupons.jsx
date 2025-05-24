import React, { useState, useEffect } from "react";
import { Card, Space, Button, Input, message, Table, Badge, Popconfirm, Tooltip, Progress, Select, Divider } from "antd";
import { CalendarOutlined, DeleteOutlined, DollarOutlined, EditOutlined, FrownOutlined, PercentageOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, TeamOutlined } from "@ant-design/icons";
import axios from "axios";
import { Dropdown, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { Rate, Image } from "antd";
import {
    EllipsisOutlined,
    FireOutlined,
    GiftOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import TagStatus from "../../components/ui/Tag/TagStatus";
import { MdKeyboardArrowDown } from "react-icons/md";
import dayjs from "dayjs";
import ModalCouponForm from "../../components/ProviderManagement/Coupon/ModalCouponForm";
import CouponModal from "../../components/AdminManagement/CouponModal";

const convertDay = (day) => {
    const date = new Date(day);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const convertMoney = (money) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(money);
}

const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
        case "INACTIVE":
            return [
                { value: "ACTIVE", label: "Active" },
            ];
        case "ACTIVE":
            return [
                { value: "INACTIVE", label: "Inactive" },
            ];
        case "EXPIRED":
            return [];
        case "FULL":
            return [];
        default:
            return [
                { value: "INACTIVE", label: "Inactive" },
            ];
    }
};
const columns = (handleEdit, handleDelete, handleStatusChange) => [
    {
        title: "Coupon Code",
        dataIndex: "couponCode",
        key: "couponCode",
        render: (code) => (
            <Badge
                count={code}
                className="font-mono font-bold text-base"
            />
        ),
        width: 150,
    },
    {
        title: "Coupon Info",
        dataIndex: "couponInfo",
        key: "couponInfo",
        render: (_, record) => (
            <div className="flex flex-col items-start gap-3">
                {record.type === 'FIXED' ? (
                    <div className="flex gap-3 justify-start items-center">
                        <DollarOutlined className="text-green-600" />
                        <div className="flex flex-col">
                            <span className="text-green-600 font-bold text-base">
                                ${record.discountValue.toFixed(2)} OFF
                            </span>
                            <span className="text-xs text-gray-500">
                                Min. order: ${record.minOrderValue.toFixed(2)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-3 justify-start items-center">
                        <PercentageOutlined className="text-red-500" />
                        <div className="flex flex-col">
                            <span className="text-red-500 font-bold text-base">
                                {Math.round(record.discountValue)} % OFF
                            </span>
                            <span className="text-xs text-gray-500">
                                Min. order: ${record.minOrderValue?.toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <CalendarOutlined className="text-gray-400 font-bold" />
                        <span className="text-gray-700 font-bold">
                            {dayjs(record.startDate).format('DD/MM/YYYY')} - {dayjs(record.expiryDate).format('DD/MM/YYYY')}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ClockCircleOutlined className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                            {dayjs(record.expiryDate).diff(dayjs(), 'day')} days remaining
                        </span>
                    </div>
                </div>
            </div>
        ),
        width: 250,
    },
    {
        title: "Conditions & Usage",
        key: "conditions",
        render: (_, record) => (
            <div className="flex flex-col items-center justify-center gap-1">

                <div className="flex items-center gap-2">
                    <TeamOutlined className="text-gray-400" />
                    <span className="text-gray-600">Used: </span>
                    <span className="font-medium">
                        {record.usage || 0}/{record.usageLimit || '∞'}
                    </span>
                </div>

                <Progress
                    percent={record.usageLimit ? Math.min(100, (record.usage / record.usageLimit) * 100) : 0}
                    size="small"
                    strokeColor={record.usageLimit && record.usage >= record.usageLimit ? '#f5222d' : '#52c41a'}
                    showInfo={false}
                />
            </div>
        ),
        width: 220,
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (description) => (
            <Tooltip title={description || "No description"}>
                <span className="text-gray-600 text-sm line-clamp-2">
                    {description || "No description"}
                </span>
            </Tooltip>
        ),
        width: 200,
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
                onClick: (e) => {
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
        width: 200,
    },
    {
        title: "Actions",
        key: "action",
        render: (_, record) => (
            <Space>
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                />
                <Popconfirm
                    title="Delete this coupon?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDelete(record)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm>
            </Space>
        ),
        width: 120,
    },
];

const { Search } = Input;



const Coupons = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [owners, setOwners] = useState([]);

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
            const url = `http://localhost:8080/api/admin/coupons?page=${page - 1}&size=${pageSize}` + (selectedOwner ? `&owner=${selectedOwner}` : '');
            const response = await axios.get(url, {
                withCredentials: true,
            })
            setCoupons(response.data.content);
            setPagination({
                ...pagination,
                current: page,
                pageSize,
                total: response.data.totalElements
            });
        } catch (error) {
            console.error('Error fetching Coupons:', error);
            messageApi.error('Failed to fetch Coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [selectedOwner]);

    const handleEdit = (record) => {
        setSelectedCoupon(record);
        setIsModalOpen(true);
    }

    const handleDelete = async (record) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:8080/api/admin/coupons/${record.id}`, {
                withCredentials: true,
            });
            messageApi.success('Coupon deleted successfully');
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error('Error deleting Coupon:', error);
            messageApi.error('Failed to delete Coupon');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        const isEdit = !!selectedCoupon;
        const config = {
            method: isEdit ? "put" : "post",
            url: isEdit
                ? `http://localhost:8080/api/admin/coupons/${selectedCoupon.id}`
                : "http://localhost:8080/api/admin/coupons",
            data: values,
            withCredentials: true,
        };

        try {
            setLoading(true);
            await axios(config);
            messageApi.success(`Cinema ${isEdit ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            fetchData(pagination.current, pagination.pageSize);
            setSelectedCoupon(null);
        } catch (error) {
            messageApi.error(`Failed to ${isEdit ? 'update' : 'create'} cinema`);
            console.error(`${isEdit ? 'Update' : 'Create'} error:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/coupons/${id}/status`, { status: newStatus }, {
                withCredentials: true,
            })
            messageApi.success('Movie status updated successfully');
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            messageApi.error('Failed to update movie status');
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
                        COUPONS MANAGEMENT
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
                    columns={columns(handleEdit, handleDelete, handleStatusChange)}
                    dataSource={coupons}
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
                            setSelectedCoupon(record);
                            setIsModalDetailOpen(true);
                        },
                    })}

                />
            </Card>
            <CouponModal
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setSelectedCoupon(null);
                }}
                onFinish={handleSubmit}
                initialValues={selectedCoupon}
                loading={loading}
                title="Add Coupon"
            />

        </>
    );
};

export default Coupons;