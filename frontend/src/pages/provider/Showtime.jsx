import React, { useState } from "react";
import {
  Tag,
  Card,
  Space,
  Button,
  Badge,
  Table,
  Divider,
  Dropdown,
  Image,
  Rate,
  Form,
  Tooltip,
  Avatar,
} from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  StarFilled,
  FilterOutlined,
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ModalShowTimeEdit from "../../components/ui/Modal/ModalShowTimeEdit";
import ModalShowTimeAdd from "../../components/ui/Modal/ModalShowTimeAdd";
import ShowTimeStatistics from "../../components/ui/Card/ShowtimeStatistics";

// Sample data with more details
const showTimeData = [
  {
    id: "ST001",
    movie: "Avengers: Endgame",
    moviePoster:
      "https://image.tmdb.org/t/p/w200/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    cinema: "CGV Vincom",
    cinemaLogo: "https://via.placeholder.com/40/FF0000/FFFFFF?text=CGV",
    room: "Phòng 1",
    date: "2023-06-15",
    startTime: "09:00",
    endTime: "11:30",
    price: 80000,
    status: "Active",
    seatsAvailable: 120,
    seatsBooked: 45,
    movieRating: 8.4,
    duration: 181,
  },
  {
    id: "ST002",
    movie: "Spider-Man: No Way Home",
    moviePoster:
      "https://image.tmdb.org/t/p/w200/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    cinema: "CGV Vincom",
    cinemaLogo: "https://via.placeholder.com/40/FF0000/FFFFFF?text=CGV",
    room: "Phòng 2",
    date: "2023-06-15",
    startTime: "12:00",
    endTime: "14:30",
    price: 100000,
    status: "Active",
    seatsAvailable: 150,
    seatsBooked: 112,
    movieRating: 8.2,
    duration: 148,
  },
  {
    id: "ST003",
    movie: "The Batman",
    moviePoster:
      "https://image.tmdb.org/t/p/w200/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    cinema: "Lotte Cinema",
    cinemaLogo: "https://via.placeholder.com/40/0000FF/FFFFFF?text=Lotte",
    room: "Phòng 3",
    date: "2023-06-16",
    startTime: "18:00",
    endTime: "21:15",
    price: 120000,
    status: "Active",
    seatsAvailable: 200,
    seatsBooked: 185,
    movieRating: 7.9,
    duration: 176,
  },
  {
    id: "ST004",
    movie: "Dune",
    moviePoster:
      "https://image.tmdb.org/t/p/w200/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    cinema: "BHD Star",
    cinemaLogo: "https://via.placeholder.com/40/00FF00/FFFFFF?text=BHD",
    room: "Phòng 5",
    date: "2023-06-17",
    startTime: "14:30",
    endTime: "17:45",
    price: 90000,
    status: "Inactive",
    seatsAvailable: 180,
    seatsBooked: 0,
    movieRating: 8.0,
    duration: 155,
  },
];

// Options for dropdowns
const cinemaOptions = [
  { key: "1", label: "CGV Vincom", value: "CGV Vincom" },
  { key: "2", label: "CGV Mipec", value: "CGV Mipec" },
  { key: "3", label: "Lotte Cinema", value: "Lotte Cinema" },
  { key: "4", label: "BHD Star", value: "BHD Star" },
];

const roomOptions = [
  { key: "1", label: "Phòng 1", value: "Phòng 1" },
  { key: "2", label: "Phòng 2", value: "Phòng 2" },
  { key: "3", label: "Phòng 3", value: "Phòng 3" },
  { key: "4", label: "Phòng 4", value: "Phòng 4" },
  { key: "5", label: "Phòng 5", value: "Phòng 5" },
];

const statusOptions = [
  { key: "1", label: "Active", value: "Active" },
  { key: "2", label: "Inactive", value: "Inactive" },
];

const columns = (handleEdit) => [
  {
    title: "Movie",
    dataIndex: "movie",
    key: "movie",
    render: (text, record) => (
      <div className="flex items-center gap-3">
        <Image
          width={60}
          src={record.moviePoster}
          className="rounded-md"
          preview={false}
        />
        <div>
          <div className="font-medium">{text}</div>
          <div className="flex items-center gap-1">
            <Rate
              disabled
              allowHalf
              defaultValue={record.movieRating / 2}
              character={<StarFilled />}
              className="text-xs"
            />
            <span className="text-xs text-gray-500">
              {record.movieRating}/10
            </span>
          </div>
          <div className="text-xs text-gray-500">{record.duration} mins</div>
        </div>
      </div>
    ),
    width: 250,
  },
  {
    title: "Cinema & Room",
    key: "cinema",
    render: (_, record) => (
      <div className="flex items-center gap-2">
        <div>
          <div className="font-medium">{record.cinema}</div>
          <div className="text-sm text-gray-500">{record.room}</div>
        </div>
      </div>
    ),
    width: 150,
  },
  {
    title: "Showtime",
    key: "showtime",
    render: (_, record) => (
      <div>
        <div className="font-medium">
          {dayjs(record.date).format("DD/MM/YYYY")}
        </div>
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-blue-500" />
          <span>
            {record.startTime} - {record.endTime}
          </span>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Seats",
    key: "seats",
    render: (_, record) => (
      <div>
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{
                width: `${(record.seatsBooked / record.seatsAvailable) * 100}%`,
              }}
            ></div>
          </div>
          <span className="text-xs">
            {record.seatsBooked}/{record.seatsAvailable}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {Math.round((record.seatsBooked / record.seatsAvailable) * 100)}%
          booked
        </div>
      </div>
    ),
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
        color={status === "Active" ? "green" : "red"}
        className="flex items-center gap-1"
      >
        {status === "Active" ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Active
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Inactive
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

const ShowTime = () => {
  const [form] = Form.useForm();
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editingShowTime, setEditingShowTime] = useState(null);
  const [data, setData] = useState(showTimeData);
  const [selectedCinema, setSelectedCinema] = useState("All Cinemas");
  const [selectedRoom, setSelectedRoom] = useState("All Rooms");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Filter data based on selections
  const filteredData = data.filter((item) => {
    const cinemaMatch =
      selectedCinema === "All Cinemas" || item.cinema === selectedCinema;
    const roomMatch =
      selectedRoom === "All Rooms" || item.room === selectedRoom;
    const statusMatch =
      selectedStatus === "All Statuses" || item.status === selectedStatus;
    return cinemaMatch && roomMatch && statusMatch;
  });

  const handleAdd = () => {
    setIsModalAddOpen(true);
  };

  const handleEdit = (record) => {
    setEditingShowTime(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
    });
    setIsModalEditOpen(true);
  };

  const handleAddSubmit = (values) => {
    const newId = `ST${String(data.length + 1).padStart(3, "0")}`;
    setData([...data, { ...values, id: newId }]);
    setIsModalAddOpen(false);
  };

  const handleEditSubmit = (values) => {
    setData(
      data.map((item) =>
        item.id === editingShowTime.id
          ? { ...values, id: editingShowTime.id }
          : item
      )
    );
    setIsModalEditOpen(false);
  };

  const handleCancel = () => {
    setIsModalAddOpen(false);
    setIsModalEditOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Card
        title={<span className="text-xl font-bold">Showtime Management</span>}
        extra={
          <Space>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "0",
                    label: "All Cinemas",
                    onClick: () => setSelectedCinema("All Cinemas"),
                  },
                  ...cinemaOptions.map((item) => ({
                    key: item.key,
                    label: item.label,
                    onClick: () => setSelectedCinema(item.value),
                  })),
                ],
              }}
              trigger={["click"]}
            >
              <Button>
                <Space>
                  {selectedCinema}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "0",
                    label: "All Rooms",
                    onClick: () => setSelectedRoom("All Rooms"),
                  },
                  ...roomOptions.map((item) => ({
                    key: item.key,
                    label: item.label,
                    onClick: () => setSelectedRoom(item.value),
                  })),
                ],
              }}
              trigger={["click"]}
              disabled={selectedCinema === "All Cinemas"}
            >
              <Button>
                <Space>
                  {selectedRoom}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "0",
                    label: "All Statuses",
                    onClick: () => setSelectedStatus("All Statuses"),
                  },
                  ...statusOptions.map((item) => ({
                    key: item.key,
                    label: item.label,
                    onClick: () => setSelectedStatus(item.value),
                  })),
                ],
              }}
              trigger={["click"]}
            >
              <Button icon={<FilterOutlined />}>
                <Space>
                  {selectedStatus}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Showtime
            </Button>
          </Space>
        }
        variant="borderless"
        styles={{ header: { borderBottom: "none" } }}
        style={{ boxShadow: "none" }}
      >
        <ShowTimeStatistics data={filteredData} />
        <Table
          columns={columns(handleEdit)}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50 cursor-pointer"
          scroll={{ x: 1200 }}
        />
        <Divider />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total: {filteredData.length} showtimes</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Active:{" "}
              {filteredData.filter((item) => item.status === "Active").length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Inactive:{" "}
              {filteredData.filter((item) => item.status === "Inactive").length}
            </span>
          </div>
        </div>
      </Card>

      <ModalShowTimeAdd
        visible={isModalAddOpen}
        onCancel={handleCancel}
        onSuccess={handleAddSubmit}
        cinemaOptions={cinemaOptions}
        roomOptions={roomOptions}
      />

      <ModalShowTimeEdit
        visible={isModalEditOpen}
        onCancel={handleCancel}
        onSuccess={handleEditSubmit}
        initialValues={editingShowTime}
        form={form}
        cinemaOptions={cinemaOptions}
        roomOptions={roomOptions}
      />
    </>
  );
};

export default ShowTime;
