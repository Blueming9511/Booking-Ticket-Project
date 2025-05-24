import React, { useState, useEffect } from "react";
import { Card, Space, Button, Input, message, Table, Badge, Divider, Select } from "antd";
import { DeleteOutlined, MailOutlined, PhoneOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

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
                { value: "MAINTAINED", label: "Maintenance" }
            ];
        case "APPROVED":
            return [
                { value: "MAINTAINED", label: "Maintenance" },
                { value: "REJECTED", label: "Rejected" }
            ];
        case "MAINTAINED":
            return [
                { value: "APPROVED", label: "Confirmed" },
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

const columns = (handleEdit, handleDelete) => [
    {
        title: "Booking Info",
        dataIndex: "bookingCode",
        key: "bookingCode",
        render: (_, record) => (
            <div className="flex flex-col">
                <div className="font-bold text-lg">{record.bookingCode}</div>
                <div className="text-gray-500 text-sm">
                    {dayjs.utc(record.createdAt).format('YYYY-MM-DD HH:mm')}
                </div>
                <div className="mt-2">
                    <TagStatus status={record.status} />
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
                    height={120}
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
                    <div className="flex gap-2 items-center mt-1">
                        <UserOutlined />
                        <span className="font-bold text-xs">Owner: </span> <span>{record.showtime.owner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ClockCircleOutlined className="text-blue-500" />
                        <span>
                            {dayjs.utc(record.showtime.startTime).format('YYYY-MM-DD HH:mm')}
                            {" - "}
                            {dayjs.utc(record.showtime.endTime).format('HH:mm')}
                        </span>
                    </div>
                    <div className="text-sm mt-1">
                        <span className="font-medium">Screen:</span> {record.showtime.screenCode}
                    </div>
                </div>
            </div>
        ),
        width: 300,
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
    }
];

const { Search } = Input;



const Bookings = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
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
            const url = `http://localhost:8080/api/admin/bookings?page=${page - 1}&size=${pageSize}` + (selectedOwner ? `&owner=${selectedOwner}` : '');
            const response = await axios.get(url, {
                withCredentials: true,
            })
            setBookings(response.data.content);
            setPagination({
                ...pagination,
                current: page,
                pageSize,
                total: response.data.totalElements
            });
        } catch (error) {
            console.error('Error fetching Bookings:', error);
            messageApi.error('Failed to fetch Bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, selectedOwner);
    }, [selectedOwner]);


    return (
        <>
            {contextHolder}
            <Card
                variant="borderless"
                style={{ boxShadow: "none" }}
            >
                <div className="max-w-xs sm:max-w-md">
                    <span className="text-3xl font-black break-words">
                        BOOKINGS MANAGEMENT
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
                            placeholder="Search booking..."
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
                    columns={columns(null, null)}
                    dataSource={bookings}
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
                            setSelectedBooking(record);
                            setIsModalDetailOpen(true);
                        },
                    })}

                />
            </Card>
        </>
    );
};

export default Bookings;