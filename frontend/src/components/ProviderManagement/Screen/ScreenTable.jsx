import React, { useState } from 'react';
import { Table, Divider, Modal } from 'antd';
import { Monitor } from 'lucide-react';

import { Avatar, Tag, Dropdown, Button, Badge } from "antd";
import { EnvironmentOutlined, EllipsisOutlined } from "@ant-design/icons";
import TagStatus from "../../ui/Tag/TagStatus";
import TheaterLayoutView from "../Layout/TheaterLayoutView.jsx";

export const columns = (handleEdit, handleDelete, cinemaData) => [
    {
        title: "Screen Info",
        key: "info",
        render: (_, record, index) => (
            <div className="flex items-center gap-3">
                <Avatar
                    size="large"
                    style={{
                        backgroundColor:
                            record.type === "IMAX"
                                ? "#13c2c2"
                                : record.type === "VIP"
                                    ? "#fa8c16"
                                    : record.type === "4DX"
                                        ? "#722ed1"
                                        : record.type === "Premium"
                                            ? "#eb2f96"
                                            : "#1890ff",
                        color: "#fff",
                    }}
                >
                    {record.type.charAt(0)}
                </Avatar>
                <div>
                    <div className="font-bold text-blue-600">
                        {" "}
                        #{record.screenCode}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <EnvironmentOutlined className="mr-1" />
                        <p className={"text-sm"}>{record.cinemaName}</p>
                    </div>
                </div>
            </div>
        ),
        width: 250,
    },
    {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (type) => (
            <Tag
                color={
                    type === "IMAX"
                        ? "cyan"
                        : type === "VIP"
                            ? "volcano"
                            : type === "4DX"
                                ? "geekblue"
                                : type === "Premium"
                                    ? "magenta"
                                    : "blue"
                }
            >
                {type}
            </Tag>
        ),
        filters: [
            { text: "IMAX", value: "IMAX" },
            { text: "VIP", value: "VIP" },
            { text: "4DX", value: "4DX" },
            { text: "Premium", value: "Premium" },
            { text: "Standard", value: "Standard" },
        ],
        onFilter: (value, record) => record.type === value,
        width: 150,
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
        render: (location) => <p className={"text-xs text-gray-600"}>{location}</p>,
        width: 200,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => <TagStatus status={status} />,
        filters: [
            { text: "Active", value: "ACTIVE" },
            { text: "Inactive", value: "INACTIVE" },
        ],
        onFilter: (value, record) => record.status === value,
        width: 150,
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
                            onClick: (e) => {
                                e.domEvent?.stopPropagation();
                                handleEdit(record);
                            },
                        },
                        {
                            key: "delete",
                            label: "Delete",
                            onClick: (e) => {
                                e.domEvent?.stopPropagation();
                                handleDelete(record.id);
                            },
                            danger: true,
                        },
                    ],
                }}
                trigger={["click"]}
            >
                <Button
                    icon={<EllipsisOutlined />}
                    shape="default"
                    onClick={(e) => e.stopPropagation()}
                />
            </Dropdown>

        ),
        width: 100,
        align: "center",
    },
];

// Component chính
const ScreenTable = ({
    data = sampleData,
    loading = false,
    cinemas = [],
    pagination = { page: 0, size: 10, totalElements: 5 },
    onSetPage = () => {
    },
    onEdit,
    onDelete
}) => {
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleRowClick = (record) => {
        setSelectedScreen(record);
        setModalVisible(true);
    };

    return (
        <>
            <Table
                columns={columns(onEdit, onDelete, cinemas)}
                dataSource={data}
                pagination={{
                    current: pagination.page + 1,
                    pageSize: pagination.size,
                    total: pagination.totalElements - 1,
                    responsive: true,
                    onChange: (page) => onSetPage(page - 1),
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    className: 'cursor-pointer hover:bg-gray-50'
                })}
                scroll={{ x: true }}
                size="middle"
                rowKey="key"
                loading={loading}
            />

            <Divider />

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                    Hiển thị {data.length || 0} rạp
                </span>
                <span>Cập nhật lần cuối: {new Date().toLocaleString()}</span>
            </div>

            {/* Modal hiển thị sơ đồ rạp */}
            <Modal
                title={
                    <div className="flex items-center">
                        <Monitor className="mr-2" size={20} />
                        <span>Sơ đồ rạp: {selectedScreen?.name}</span>
                    </div>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
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

export default ScreenTable;