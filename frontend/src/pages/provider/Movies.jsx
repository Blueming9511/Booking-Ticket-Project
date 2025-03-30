import React, {useState} from "react";
import { Tag, Card, Space, Button, Badge, Table, Divider, Dropdown, Image, Rate, Form, Tooltip } from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  StarFilled,
  FilterOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import ModalMovie from "../../components/ui/ModalMovie";

const columns = (handleEdit) => [
  {
    title: "Poster",
    dataIndex: "thumbnail",
    key: "thumbnail",
    render: (src) => (
      <Image
        width={100}
        src={src}
        className="rounded-lg shadow-md hover:shadow-lg transition-all"
      />
    ),
    width: 150,
  },
  {
    title: "Movie Information",
    key: "info",
    render: (_, record) => (
      <div className="flex flex-col">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{record.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Tag color="blue">{record.genre}</Tag>
              <Tag color="purple">{record.releaseYear}</Tag>
              <Tag icon={<ClockCircleOutlined />}>{record.duration} mins</Tag>
            </div>
            <div className="flex items-center gap-2">
              <Rate
                disabled
                allowHalf
                defaultValue={record.rating / 2}
                character={<StarFilled />}
                className="text-sm"
              />
              <span className="text-gray-600">{record.rating}/10</span>
            </div>
          </div>
          <Tooltip title="Box Office">
            <Badge
              count={record.boxOffice}
              className="bg-green-100 text-green-800 px-2 py-1 rounded-full"
            />
          </Tooltip>
        </div>
        <div className="mt-2">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Director:</span> {record.director}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Distributor:</span>{" "}
            {record.releasedBy}
          </p>
        </div>
      </div>
    ),
    width: 400,
  },
  {
    title: "Financials",
    key: "financials",
    render: (_, record) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <span>Budget: {record.budget}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <span>Revenue: {record.boxOffice}</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Released: {record.releaseDate}
          </p>
          <p className="text-sm text-gray-500">Ended: {record.endDate}</p>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={status === "Ended" ? "red" : "green"}
        className="flex items-center gap-1"
      >
        {status === "Ended" ? (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Ended
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Now Showing
          </>
        )}
      </Tag>
    ),
    align: "center",
    width: 200,
  },
  {
    title: "Actions",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Edit",
              onClick: () => handleEdit(record),
            },
            {
              key: "delete",
              label: "Delete",
            },
          ],
        }}
        trigger={["click"]}

      >
        <Button
          icon={<EllipsisOutlined />}
          shape="default"
          style={{ padding: "0" }}
        />
      </Dropdown>
    ),
    width: 100,
  },
];

const initData = [
  {
    key: "1",
    thumbnail:
      "https://image.tmdb.org/t/p/w200/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi",
    releaseYear: "2022",
    director: "James Cameron",
    rating: "7.8",
    duration: "192",
    language: "English",
    budget: "$250M",
    boxOffice: "$2.320B",
    casts: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    releasedBy: "CGV",
    releaseDate: "2022-12-16",
    endDate: "2023-03-15",
    status: "Ended",
  },
  {
    key: "2",
    thumbnail:
      "https://image.tmdb.org/t/p/w200/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    title: "Titanic",
    genre: "Romance",
    releaseYear: "1997",
    director: "James Cameron",
    rating: "7.9",
    duration: "195",
    language: "English",
    budget: "$200M",
    boxOffice: "$2.202B",
    casts: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
    releasedBy: "Cinestar",
    releaseDate: "1997-12-19",
    endDate: "1998-04-20",
    status: "Ended",
  },
  {
    key: "3",
    thumbnail:
      "https://image.tmdb.org/t/p/w200/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    title: "Avengers: Endgame",
    genre: "Action",
    releaseYear: "2019",
    director: "Anthony & Joe Russo",
    rating: "8.4",
    duration: "181",
    language: "English",
    budget: "$356M",
    boxOffice: "$2.798B",
    casts: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    releasedBy: "BHD",
    releaseDate: "2019-04-26",
    endDate: "2019-09-10",
    status: "Ended",
  },
  {
    key: "4",
    thumbnail:
      "https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    title: "Joker",
    genre: "Drama",
    releaseYear: "2019",
    director: "Todd Phillips",
    rating: "8.4",
    duration: "122",
    language: "English",
    budget: "$55M",
    boxOffice: "$1.074B",
    casts: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
    releasedBy: "Lotte Cinema",
    releaseDate: "2019-10-04",
    endDate: "2020-01-15",
    status: "Ended",
  },
  {
    key: "5",
    thumbnail:
      "https://image.tmdb.org/t/p/w200/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    title: "The Shawshank Redemption",
    genre: "Drama",
    releaseYear: "1994",
    director: "Frank Darabont",
    rating: "9.3",
    duration: "142",
    language: "English",
    budget: "$25M",
    boxOffice: "$73.3M",
    casts: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    releasedBy: "Galaxy Cinema",
    releaseDate: "1994-09-23",
    endDate: "1995-01-10",
    status: "Ended",
  },
];

const Movies = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);

  const handleEdit = (record) => {
    setEditingCinema(record);
    console.log(editingCinema)
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        console.log("Saved values:", values);
        setIsModalOpen(false);
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <>
      <Card
        title={<span className="text-xl font-bold">Mangement Cinema</span>}
        extra={
          <Space>
            <Button icon={<FilterOutlined />}>Lọc</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm rạp mới
            </Button>
          </Space>
        }
        variant="borderless"
        styles={{ header: { borderBottom: "none" } }}
        style={{ boxShadow: "none" }}
      >
        <Table
          columns={columns(handleEdit)}
          dataSource={initData}
          pagination={{ pageSize: 5 }}
          borderless
          className="rounded-lg"
          rowClassName="hover:bg-gray-50 cursor-pointer"
        />
        <Divider />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total: {initData.length} movies</span>
        </div>
      </Card>
      <ModalMovie
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        form={form}
        initialValues={editingCinema}
      />
    </>
  );
};

export default Movies;
