import React, { useState, useEffect } from "react";
import { Card, Space, Button, Input, message, Table, Badge, Select, Divider } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { Dropdown, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { Rate, Image } from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  StarFilled,
} from "@ant-design/icons";
import TagStatus from "../../components/ui/Tag/TagStatus";
import { MdKeyboardArrowDown } from "react-icons/md";
import MovieEditModal from "../../components/providerManagement/Movie/ModalMovieEdit";

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
            <div className="flex flex-wrap gap-1 w-100 my-2">
              {
                record.genre.map((genre, index) => (
                  <Tag key={index} color="blue">{genre}</Tag>
                ))
              }
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Tag color="purple">{convertDay(record.releaseDate)}</Tag>
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
              <span className="text-gray-600">{record.rating?.toFixed(1)}/10</span>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Director:</span> {record.director}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Distributor:</span>{" "}
            {record.releasedBy}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Owner:</span>{" "}
            {record.owner}
          </p>
        </div>
      </div>
    ),
    width: 300,
  },
  {
    title: "Financials",
    key: "financials",
    render: (_, record) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <span>
            <span className="font-medium">Budget</span>:
            <Badge offset={[2, -4]} count={convertMoney(record.budget)} color="red" overflowCount={10000000000} />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <span><span className="font-medium">Revenue:</span>
            <Badge offset={[2, -4]} count={convertMoney(record.boxOffice)} color="red" overflowCount={10000000000} />

          </span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Released: {convertDay(record.releaseDate)}
          </p>
          <p className="text-sm text-gray-500">Ended: {convertDay(record.endDate)}</p>
        </div>
      </div>
    ),
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
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Button type="dashed" onClick={() => handleEdit(record)}> Edit </Button>
    ),
    width: 100,
  },
];

const { Search } = Input;



const Movies = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
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
      const url = `http://localhost:8080/api/admin/movies?page=${page - 1}&size=${pageSize}`;
      if (selectedOwner) {
        url += `&owner=${selectedOwner}`;
      }
      const response = await axios.get(url, {
        withCredentials: true,
      });
      setMovies(response.data.content);
      setPagination({
        ...pagination,
        current: page,
        pageSize,
        total: response.data.totalElements
      });
    } catch (error) {
      console.error('Error fetching Movies:', error);
      messageApi.error('Failed to fetch Movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, selectedOwner);
  }, [selectedOwner]);

  const handleEdit = (record) => {
    setSelectedMovie(record);
    setIsModalOpen(true);
  }

  const handleSubmit = async (values) => {
    const isEdit = !!selectedMovie;
    const config = {
      method: isEdit ? "put" : "post",
      url: isEdit
        ? `http://localhost:8080/api/admin/movies/${selectedMovie.id}`
        : "http://localhost:8080/api/admin/movies",
      data: values,
      withCredentials: true,
    };

    try {
      setLoading(true);
      await axios(config);
      messageApi.success(`Cinema ${isEdit ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
      setSelectedMovie(null);
    } catch (error) {
      messageApi.error(`Failed to ${isEdit ? 'update' : 'create'} cinema`);
      console.error(`${isEdit ? 'Update' : 'Create'} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/movies/${id}/status`, { status: newStatus }, {
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
            MOVIES MANAGEMENT
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
              placeholder="Search cinema..."
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
          columns={columns(handleEdit, handleStatusChange)}
          dataSource={movies}
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
              setSelectedMovie(record);
              setIsModalDetailOpen(true);
            },
          })}

        />
      </Card>

      <MovieEditModal
        initialValues={selectedMovie}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={handleSubmit}
        loading={loading}
      />
    </>
  );
};

export default Movies;