import React, { useState, useEffect } from "react";
import { Card, Space, Button, Input, message, Table, Badge, Select, Divider, DatePicker } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
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
const columns = (handleStatusChange) => [
    {
        title: "Movie",
        dataIndex: "movie",
        key: "movie",
        render: (_, record) => {
            console.log(record)
            return (
                <div className="flex items-center gap-3">
                    <Image
                        width={60}
                        height={90}
                        src={record.movieThumbnail}
                        className="rounded-md object-cover h-full"
                        preview={false}
                    />
                    <div>
                        <div className="font-medium">{record.movieTitle}</div>
                        <div className="flex items-center gap-1">
                            <Rate
                                disabled
                                allowHalf
                                defaultValue={record?.movieRating ? (Number(record.movieRating).toFixed(2) / 2) : 0}
                                character={<StarFilled />}
                                className="text-xs"
                            />
                            <span className="text-xs text-gray-500">
                                {Number(record.movieRating).toFixed(2)}/10
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">{record.movieDuration} mins</div>
                        <div className="text-xs text-gray-500">
                            <span className="font-bold">Owner: </span> {record.owner}
                        </div>
                    </div>
                </div>)
        },
        width: 300,
    },
    {
        title: "Cinema & Room",
        key: "cinema",
        render: (_, record) => {
            return (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-medium">{record.cinemaLocation}</div>
                        <div className="text-sm text-gray-500">{record.screenCode}</div>
                    </div>
                </div>
            )
        },
        width: 200,
    },
    {
        title: "Showtime",
        key: "showtime",
        render: (_, record) => {
            console.log(record)
            const date = dayjs.utc(record.startTime).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
            const start = dayjs.utc(record.startTime).tz('Asia/Ho_Chi_Minh').format('HH:mm');
            const end = dayjs.utc(record.endTime).tz('Asia/Ho_Chi_Minh').format('HH:mm');
            console.log(record.startTime, record.endTime)
            return (
                <div>
                    <div className="font-medium">
                        {date}
                    </div>
                    <div className="flex items-center gap-2">
                        <ClockCircleOutlined className="text-blue-500" />
                        <span>

                            {start} - {end}
                        </span>
                    </div>
                </div>
            )
        },
        width: 200,
    },
    {
        title: "Seats",
        key: "seats",
        render: (_, record) => {
            const bookedPercentage = (record.bookedSeats / record.seats) * 100
            return (
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${bookedPercentage === 100 ? "bg-red-500" : "bg-green-500"
                                    }`}
                                style={{ width: `${bookedPercentage}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-medium">
                            {record.bookedSeats}/{record.seats}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {bookedPercentage}% booked
                        {bookedPercentage === 100 && (
                            <Tag color="red" className="ml-2">Full</Tag>
                        )}
                    </div>
                </div>
            );
        },
        width: 150,
    },
    {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (price) => (
            <div className="font-medium text-green-600">
                {price.toLocaleString()} $
            </div>
        ),
        align: "right",
        width: 100,
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
];

const { Search } = Input;
const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Confirmed" },
    { value: "REJECTED", label: "Rejected" },
    { value: "MAINTAINED", label: "Maintenance" },
    { value: "CLOSED", label: "Closed" },
    { value: "IN_COMING", label: "Coming Soon" },
    { value: "AVAILABLE", label: "Available" },
    { value: "FULL", label: "Full" }
]

const screenType = [
    { value: "STANDARD", label: "Standard" },
    { value: "DELUXE", label: "Deluxe" },
    { value: "PREMIUM", label: "Premium" },
    { value: "IMAX", label: "IMAX" },
    { value: "THREE_D", label: "3D" },
    { value: "FOUR_DX", label: "4DX" }
]

const Showtimes = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [status, setStatus] = useState(null);
    const [search, setSearch] = useState(null);
    const [type, setType] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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


    const fetchData = async (page = 1, pageSize = 5, selectedOwner = null, status = null, search = null, type = null, startDate = null, endDate = null) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page - 1,
                size: pageSize,
            })
            if (selectedOwner) params.append('owner', selectedOwner);
            if (status) params.append('status', status);
            if (search) params.append('title', search);
            if (type) params.append('type', type);
            if (startDate) params.append('startTime', dayjs(startDate).format("YYYY-MM-DDTHH:MM:ss"));
            if (endDate) params.append('endTime', dayjs(endDate).format("YYYY-MM-DDTHH:MM:ss"));
            const url = `http://localhost:8080/api/admin/showtimes?${params.toString()}`
            const response = await axios.get(url, {
                withCredentials: true,
            });
            setShowtimes(response.data.content);
            setPagination({
                ...pagination,
                current: page,
                pageSize,
                total: response.data.totalElements
            });
        } catch (error) {
            console.error('Error fetching showtimes:', error);
            messageApi.error('Failed to fetch showtimes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, selectedOwner, status, search, type, startDate, endDate);
    }, [selectedOwner, status, search, type, startDate, endDate]);

    const handleSubmit = async (values) => {
        const isEdit = !!selectedShowtime;
        const config = {
            method: isEdit ? "put" : "post",
            url: isEdit
                ? `http://localhost:8080/api/admin/showtimes/${selectedShowtime.id}`
                : "http://localhost:8080/api/admin/showtimes",
            data: values,
            withCredentials: true,
        };

        try {
            setLoading(true);
            await axios(config);
            messageApi.success(`Cinema ${isEdit ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            fetchData(pagination.current, pagination.pageSize);
            setSelectedShowtime(null);
        } catch (error) {
            messageApi.error(`Failed to ${isEdit ? 'update' : 'create'} cinema`);
            console.error(`${isEdit ? 'Update' : 'Create'} error:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/showtimes/${id}/status`, { status: newStatus }, {
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
                        SCREENS MANAGEMENT
                    </span>
                </div>
                <Divider />
                <div className="flex flex-col justify-between mb-5 gap-3 lg:flex-row">
                    <div className="flex flex-wrap gap-3">
                        <Select
                            allowClear
                            options={owners.map(o => ({ value: o, label: o }))}
                            placeholder="Select Owner"
                            onChange={(value) => setSelectedOwner(value)}
                            className="w-32"
                        />
                        <Select
                            allowClear
                            options={statusOptions}
                            placeholder="Select Status"
                            onChange={(value) => setStatus(value)}
                            className="w-32"
                        />
                        <Select
                            allowClear
                            options={screenType}
                            placeholder="Select Type"
                            onChange={(value) => setType(value)}
                            className="w-32"
                        />
                        <DatePicker.RangePicker
                            allowClear
                            onChange={(value) => {
                                if (!value) {
                                    setStartDate(null);
                                    setEndDate(null);
                                } else {
                                    setStartDate(value[0]);
                                    setEndDate(value[1]);
                                }
                            }}
                        />

                    </div>
                    <div className="flex gap-2">
                        <Search
                            placeholder="Search screen..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={(value) => setSearch(value)}
                            style={{ width: 300 }}
                        />

                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={() => fetchData(pagination.current, pagination.pageSize, selectedOwner)}
                        />
                    </div>
                </div>

                <Table
                    columns={columns(handleStatusChange)}
                    dataSource={showtimes}
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
                            setSelectedShowtime(record);
                            setIsModalDetailOpen(true);
                        },
                    })}

                />
            </Card>

            <MovieEditModal
                initialValues={selectedShowtime}
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={handleSubmit}
                loading={loading}
            />
        </>
    );
};

export default Showtimes;