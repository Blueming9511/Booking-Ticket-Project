import React, { useState, useEffect } from "react";
import { Card, Space, Button, Input, message, Table, Badge, Select, Divider } from "antd";
import { BankOutlined, CheckCircleOutlined, CloseCircleOutlined, CreditCardOutlined, DeleteOutlined, PlusOutlined, QrcodeOutlined, QuestionOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { Dropdown, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { Rate, Image } from "antd";
import {
    ClockCircleOutlined,
    DollarOutlined,
    StarFilled,
    EditOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import TagStatus from "../../components/ui/Tag/TagStatus";
import { MdKeyboardArrowDown } from "react-icons/md";
import MovieEditModal from "../../components/providerManagement/Movie/ModalMovieEdit";
import dayjs from "dayjs";

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
        case "PENDING":
            return [
                { value: "APPROVED", label: "Confirmed" },
                { value: "REJECTED", label: "Rejected" },
            ];
        case "APPROVED":
            return [
            ];
        case "REJECTED":
            return [];
        default:
            return [];
    }
};
const columns = (handleStatusChange) => [
    {
        title: "Payment ID",
        dataIndex: "paymentCode",
        key: "paymentCode",
        render: (id) => <span className="font-mono font-bold text-blue-600  ">#{id}</span>,
    },
    {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amount) => (
            <span className="font-semibold text-sm">
                {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(amount)}
            </span>
        ),
        sorter: (a, b) => a.amount - b.amount,
    },
    {
        title: "Payment Method",
        dataIndex: "method",
        key: "method",
        render: (method) => {
            let icon, color;
            switch (method) {
                case "VISA":
                    icon = <CreditCardOutlined className="text-blue-500" />;
                    color = "blue";
                    break;
                case "MOMO":
                    icon = <QrcodeOutlined className="text-green-500" />;
                    color = "green";
                    break;
                case "BANK":
                    icon = <BankOutlined className="text-purple-500" />;
                    color = "purple";
                    break;
                default:
                    icon = <QuestionOutlined className="text-gray-500" />;
                    color = "gray";
            }
            return (
                <Tag
                    icon={icon}
                    color={color}
                    className="flex items-center gap-2"
                    style={{ borderRadius: "20px" }}
                >
                    {method}
                </Tag>
            );
        },
        filters: [
            { text: "Credit Card", value: "Credit Card" },
            { text: "E-Wallet", value: "E-Wallet" },
            { text: "Bank Transfer", value: "Bank Transfer" },
        ],
        onFilter: (value, record) => record.method === value,
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (date) => (
            <div className="flex flex-col">
                <span className="font-bold">
                    {new Date(date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
                <span className="text-sm text-gray-500">
                    {console.log(date)}
                    {new Date(date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        ),
        sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
        width: 300,
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
                            {options.length > 0 && <MdKeyboardArrowDown />}
                        </div>
                    </Dropdown>
                </div>
            )
        },
        onFilter: (value, record) => record.status === value,
        width: 200,
    },
];

const { Search } = Input;



const Payments = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
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


    const fetchData = async (page = 1, pageSize = 5) => {
        try {
            setLoading(true);
            const url = `http://localhost:8080/api/admin/payments?page=${page - 1}&size=${pageSize}` + (selectedOwner ? `&owner=${selectedOwner}` : '');
            const response = await axios.get(url, {
                withCredentials: true,
            })
            setPayments(response.data.content);
            setPagination({
                ...pagination,
                current: page,
                pageSize,
                total: response.data.totalElements
            });
        } catch (error) {
            console.error('Error fetching Payments:', error);
            messageApi.error('Failed to fetch Payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, selectedOwner);
    }, [selectedOwner]);

    const handleSubmit = async (values) => {
        const isEdit = !!selectedPayment;
        const config = {
            method: isEdit ? "put" : "post",
            url: isEdit
                ? `http://localhost:8080/api/admin/payments/${selectedPayment.id}`
                : "http://localhost:8080/api/admin/payments",
            data: values,
            withCredentials: true,
        };

        try {
            setLoading(true);
            await axios(config);
            messageApi.success(`Cinema ${isEdit ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            fetchData(pagination.current, pagination.pageSize);
            setSelectedPayment(null);
        } catch (error) {
            messageApi.error(`Failed to ${isEdit ? 'update' : 'create'} cinema`);
            console.error(`${isEdit ? 'Update' : 'Create'} error:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/payments/${id}/status`, { status: newStatus }, {
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
                        PAYMENT MANAGEMENT
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
                            placeholder="Search payment..."
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
                    dataSource={payments}
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
                            setSelectedPayment(record);
                            setIsModalDetailOpen(true);
                        },
                    })}

                />
            </Card>

            <MovieEditModal
                initialValues={selectedPayment}
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={handleSubmit}
                loading={loading}
            />
        </>
    );
};

export default Payments;