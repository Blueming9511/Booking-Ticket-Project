import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Card,
  Space,
  Button,
  Dropdown,
  Divider,
  Form,
  Badge,
  Avatar,
  Progress,
  Tooltip,
  Input,
  Select,
  Modal,
} from "antd";
import {
  CrownOutlined,
  TeamOutlined,
  PlusOutlined,
  DownOutlined,
  EditOutlined,
  SyncOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  SearchOutlined,
  StarOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ModalSeatAdd from "../../components/ui/Modal/ModalSeatAdd";
import ModalSeatEdit from "../../components/ui/Modal/ModalSeatEdit";
import { header } from "framer-motion/client";
import SeatStatistics from "../../components/ui/Card/SeatStatistics";
import TagType from "../../components/ui/Tag/TagType";
import TagStatus from "../../components/ui/Tag/TagStatus";

const { Search } = Input;


const columns = (handleEdit) => [
  {
    title: "Seat Info",
    key: "info",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <Avatar
          size="default"
          style={{
            backgroundColor:
              record.type === "VIP"
                ? "#ffd666"
                : record.type === "Couple"
                  ? "#d3adf7"
                  : "#91d5ff",
            color:
              record.type === "VIP"
                ? "#d48806"
                : record.type === "Couple"
                  ? "#531dab"
                  : "#096dd9",
          }}
          className="font-bold"
        >
          {record.row}
        </Avatar>
        <div>
          <div className="font-bold text-base text-blue-600">{record.id}</div>
          <div className="text-gray-500 text-xs">Seat {record.number} - Row {record.row}</div>
        </div>
      </div>
    ),
    width: 180,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) => <TagType type={type} />,
    filters: [
      { text: "Standard", value: "Standard" },
      { text: "VIP", value: "VIP" },
      { text: "Couple", value: "Couple" },
      { text: "Disabled", value: "Disabled" },
    ],
    onFilter: (value, record) => record.type === value,
    width: 120,
  },
  {
    title: "Price Multiplier",
    dataIndex: "multiplier",
    key: "multiplier",
    render: (multiplier) => (
      <Tooltip title={`Price multiplier: ${multiplier}x`}>
        <Progress
          percent={Math.round(multiplier * 50)}
          showInfo={false}
          strokeColor={
            multiplier > 2
              ? "#ff4d4f"
              : multiplier > 1.5
                ? "#faad14"
                : "#52c41a"
          }
        />
      </Tooltip>
    ),
    sorter: (a, b) => a.multiplier - b.multiplier,
    width: 200,
  },
  {
    title: "Location",
    key: "location",
    render: (_, record) => (
      <div className="flex flex-col">
        <span className="font-medium text-base">{record.room}</span>
        <span className="text-gray-500 text-xs">{record.cinema}</span>
      </div>
    ),
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <TagStatus status={status} />,
    filters: [
      { text: "Available", value: "Available" },
      { text: "Booked", value: "Booked" },
      { text: "Maintenance", value: "Maintenance" },
      { text: "Reserved", value: "Reserved" },
    ],
    onFilter: (value, record) => record.status === value,
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
              label: "Edit Seat",
              icon: <EditOutlined />,
              onClick: () => handleEdit(record),
            },
            {
              key: "change_status",
              label: "Change Status",
              icon: <SyncOutlined />,
              children: [
                { key: "set_available", label: "Set to Available" },
                { key: "set_booked", label: "Set to Booked" },
                { key: "set_maintenance", label: "Set to Maintenance" },
              ],
            },
            {
              key: "delete",
              label: "Delete Seat",
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
        }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          icon={<EllipsisOutlined />}
          shape="default"
          className="flex items-center justify-center"
        />
      </Dropdown>
    ),
    width: 80,
    align: "center",
  },
];



const cinemas = [
  { key: "0", label: "All Cinemas", value: null },
  { key: "1", label: "CGV Vincom Mega Mall", value: "CGV Vincom Mega Mall" },
  { key: "2", label: "CGV Vincom Plaza", value: "CGV Vincom Plaza" },
  { key: "3", label: "CGV Vincom City", value: "CGV Vincom City" },
  { key: "4", label: "CGV Vincom Plaza 2", value: "CGV Vincom Plaza 2" },
];

const initData = [
  {
    key: "1",
    id: "A101",
    number: "01",
    row: "A",
    type: "VIP",
    status: "Available",
    room: "Screen 1",
    cinema: "CGV Vincom Mega Mall",
    multiplier: 1.5,
  },
  {
    key: "2",
    id: "A102",
    number: "02",
    row: "A",
    type: "VIP",
    status: "Booked",
    room: "Screen 1",
    cinema: "CGV Vincom Mega Mall",
    multiplier: 1.5,
  },
  {
    key: "3",
    id: "B101",
    number: "01",
    row: "B",
    type: "Standard",
    status: "Available",
    room: "Screen 1",
    cinema: "CGV Vincom Plaza",
    multiplier: 1,
  },
  {
    key: "4",
    id: "B102",
    number: "02",
    row: "B",
    type: "Standard",
    status: "Available",
    room: "Screen 1",
    cinema: "CGV Vincom Plaza",
    multiplier: 1,
  },
  {
    key: "5",
    id: "C101",
    number: "01",
    row: "C",
    type: "Couple",
    status: "Booked",
    room: "Screen 2",
    cinema: "CGV Vincom City",
    multiplier: 2.2,
  },
  {
    key: "6",
    id: "C102",
    number: "02",
    row: "C",
    type: "Couple",
    status: "Available",
    room: "Screen 2",
    cinema: "CGV Vincom City",
    multiplier: 2.2,
  },
  {
    key: "7",
    id: "D101",
    number: "01",
    row: "D",
    type: "Standard",
    status: "Maintenance",
    room: "Screen 2",
    cinema: "CGV Vincom Plaza 2",
    multiplier: 1,
  },
  {
    key: "8",
    id: "D102",
    number: "02",
    row: "D",
    type: "Standard",
    status: "Available",
    room: "Screen 3",
    cinema: "CGV Vincom Plaza 2",
    multiplier: 1,
  },
  {
    key: "9",
    id: "E101",
    number: "01",
    row: "E",
    type: "VIP",
    status: "Booked",
    room: "Screen 3",
    cinema: "CGV Vincom Mega Mall",
    multiplier: 1.5,
  },
  {
    key: "10",
    id: "E102",
    number: "02",
    row: "E",
    type: "VIP",
    status: "Available",
    room: "Screen 3",
    cinema: "CGV Vincom Mega Mall",
    multiplier: 1.5,
  },
];

const Seat = () => {
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [isQuickStatusModalOpen, setIsQuickStatusModalOpen] = useState(false);
  const [selectedSeatForStatus, setSelectedSeatForStatus] = useState(null);


  useEffect(() => {
    // Initialize with first cinema and its first room
    if (cinemas.length > 0 && !selectedCinema) {
      const firstCinema = cinemas[0].value;
      setSelectedCinema(firstCinema);

      const firstRoom = [
        ...new Set(
          initData
            .filter((item) => item.cinema === firstCinema)
            .map((item) => item.room)
        ),
      ][0];

      setSelectedRoom(firstRoom);
      updateFilteredData(firstCinema, firstRoom);
    }
  }, []);

  const updateFilteredData = (cinema, room, search = "") => {
    let data = [...initData];

    if (cinema) {
      data = data.filter((item) => item.cinema === cinema);
    }

    if (room) {
      data = data.filter((item) => item.room === room);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.id.toLowerCase().includes(lowerSearch) ||
          item.number.toLowerCase().includes(lowerSearch) ||
          item.row.toLowerCase().includes(lowerSearch) ||
          item.type.toLowerCase().includes(lowerSearch) ||
          item.room.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredData(data);
  };

  const handleEdit = (record) => {
    setEditingSeat(record);
    setIsModalEditOpen(true);
  };

  const handleQuickStatusChange = (record) => {
    setSelectedSeatForStatus(record);
    setIsQuickStatusModalOpen(true);
  };

  const handleStatusUpdate = (newStatus) => {
    // Update the seat status in your data
    console.log(`Changing seat ${selectedSeatForStatus.id} to ${newStatus}`);
    setIsQuickStatusModalOpen(false);
  };

  const handleEditSubmit = (values) => {
    console.log("Edited values:", values);
    setIsModalEditOpen(false);
  };

  const handleAddSubmit = (values) => {
    console.log("Added values:", values);
    setIsModalAddOpen(false);
  };

  const handleCancel = () => {
    setIsModalEditOpen(false);
    setIsModalAddOpen(false);
    setIsQuickStatusModalOpen(false);
    form.resetFields();
  };

  const handleCinemaSelect = (value) => {
    setSelectedCinema(value);
    setSelectedRoom(null);
    updateFilteredData(value, null, searchText);
  };

  const handleRoomSelect = (value) => {
    setSelectedRoom(value);
    updateFilteredData(selectedCinema, value, searchText);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    updateFilteredData(selectedCinema, selectedRoom, value);
  };

  const rooms = selectedCinema
    ? [
        ...new Set(
          initData
            .filter((item) => item.cinema === selectedCinema)
            .map((item) => item.room)
        ),
      ].map((room, index) => ({
        key: index.toString(),
        label: room,
        value: room,
      }))
    : [];

  return (
    <>
      <Card
        title={<span className="text-2xl font-bold">Seat Management</span>}
        extra={
          <Space>
            <Select
              placeholder="Select Cinema"
              value={selectedCinema}
              onChange={handleCinemaSelect}
              style={{ width: 200 }}
              options={cinemas}
            />

            <Select
              placeholder="Select Room"
              value={selectedRoom}
              onChange={handleRoomSelect}
              style={{ width: 150 }}
              disabled={!selectedCinema}
              options={rooms}
            />

            <Search
              placeholder="Search seats..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 250 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalAddOpen(true)}
            >
              Add Seat
            </Button>
          </Space>
        }
        styles={{ header: { borderBottom: "none" } }}
        style={{ border: "none" }}
      >
        <SeatStatistics data={filteredData} />

        <Table
          columns={columns(handleEdit)}
          dataSource={filteredData}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5","10", "20", "50", "100"],
          }}
          rowClassName={(record) => {
            if (record.status === "Booked") return "bg-red-50 hover:bg-red-100";
            if (record.status === "Maintenance")
              return "bg-orange-50 hover:bg-orange-100";
            if (record.status === "Reserved")
              return "bg-blue-50 hover:bg-blue-100";
            return "hover:bg-gray-50";
          }}
          scroll={{ x: 1000 }}
          rowKey="key"
        />

        <Divider />

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Showing {filteredData.length} seats</span>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </Card>

      <ModalSeatAdd
        visible={isModalAddOpen}
        onCancel={handleCancel}
        onSuccess={handleAddSubmit}
        cinemas={cinemas}
        rooms={rooms}
      />

      <ModalSeatEdit
        visible={isModalEditOpen}
        onCancel={handleCancel}
        onSuccess={handleEditSubmit}
        initialValues={editingSeat}
        cinemas={cinemas}
        rooms={rooms}
      />

      <Modal
        title={`Change Seat Status - ${selectedSeatForStatus?.id || ""}`}
        open={isQuickStatusModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="available"
            type="default"
            icon={<CheckCircleOutlined />}
            onClick={() => handleStatusUpdate("Available")}
          >
            Set Available
          </Button>,
          <Button
            key="booked"
            type="default"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleStatusUpdate("Booked")}
          >
            Set Booked
          </Button>,
          <Button
            key="maintenance"
            type="default"
            icon={<ExclamationCircleOutlined />}
            onClick={() => handleStatusUpdate("Maintenance")}
          >
            Set Maintenance
          </Button>,
        ]}
      >
        <p>
          Current status:{" "}
          <TagStatus status={selectedSeatForStatus?.status} />
        </p>
        <p className="mt-2">Select new status for this seat.</p>
      </Modal>
    </>
  );
};

export default Seat;
