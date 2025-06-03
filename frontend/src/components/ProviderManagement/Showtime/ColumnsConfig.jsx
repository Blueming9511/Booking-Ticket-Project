import React from "react";
import { Button, Dropdown, Image, Rate, Tag } from "antd";
import { ClockCircleOutlined, EditOutlined, EllipsisOutlined, StarFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "FULL", label: "Full" },
];

export const columns = (handleEdit, handleDelete, cinemas, rooms, movies, bookingDetails) => [
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
        width: 120,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
            <Tag
                color={status == statusOptions[0].value ? "green" : "red"}
                className="flex items-center gap-1"
            >
                {status === "AVAILABLE" ? (
                    <>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        AVAILABLE
                    </>
                ) : (
                    <>
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        FULL
                    </>
                )}
            </Tag>
        ),
        align: "center",
        width: 120,
        filters: statusOptions,
        onFilter: (value, record) => record.status === value,
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
                            icon: <EditOutlined />,
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
                <Button
                    icon={<EllipsisOutlined />}
                    shape="default"
                    style={{ padding: "0 8px" }}
                />
            </Dropdown>
        ),
        align: "center",
        width: 80,
    },
];