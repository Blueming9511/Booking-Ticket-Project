import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Divider,
  Spin,
  DatePicker,
  Progress,
  Alert,
} from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import RevenueChart from "../../components/ui/Charts/RevenueChart";

const { RangePicker } = DatePicker;

const STATUS_CONFIG = {
  CONFIRMED: { color: "green", icon: <CheckCircleOutlined /> },
  PENDING: { color: "orange", icon: <ClockCircleOutlined /> },
  CANCELLED: { color: "red", icon: <CloseCircleOutlined /> },
  COMPLETED: { color: "blue", icon: <CheckCircleOutlined /> },
};

const STATUS_COLORS = {
  CONFIRMED: "#52c41a",
  PENDING: "#faad14",
  CANCELLED: "#f5222d",
  COMPLETED: "#1890ff",
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, "days"),
    dayjs(),
  ]);
  const [data, setData] = useState({ bookingDetails: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [detailsRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:8080/api/bookingdetails"),
          fetch("http://localhost:8080/api/bookings"),
        ]);

        if (!detailsRes.ok || !bookingsRes.ok) {
          throw new Error("Network response was not ok");
        }

        const [bookingDetails, bookings] = await Promise.all([
          detailsRes.json(),
          bookingsRes.json(),
        ]);

        setData({ bookingDetails, bookings });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!data.bookingDetails.length) return { bookingDetails: [], bookings: [] };

    const startDate = dateRange ? dateRange[0] : dayjs().startOf("year");
    const endDate = dateRange ? dateRange[1] : dayjs().endOf("year");

    const filteredDetails = data.bookingDetails.filter((detail) => {
      const bookingDate = dayjs(
        detail.createdAt || 
        data.bookings.find(b => b.bookingCode === detail.bookingCode)?.createdAt
      );
      return (
        bookingDate.isSame(startDate, "day") || 
        bookingDate.isAfter(startDate.startOf("day")) &&
        bookingDate.isSame(endDate, "day") || 
        bookingDate.isBefore(endDate.endOf("day"))
      );
    });

    return {
      bookingDetails: filteredDetails,
      bookings: data.bookings,
    };
  }, [data, dateRange]);

  // Process statistics
  const stats = useMemo(() => {
    const { bookingDetails } = filteredData;
    if (!bookingDetails?.length) return {};

    const totalBookings = bookingDetails.length;
    const totalRevenue = bookingDetails.reduce(
      (sum, d) => sum + (d.totalAmount || 0),
      0
    );
    const statusCounts = bookingDetails.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {});
    const recentBookings = [...bookingDetails]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totalBookings,
      totalRevenue,
      statusCounts,
      recentBookings,
    };
  }, [filteredData]);

  const tableColumns = useMemo(
    () => [
      { title: "Booking Code", dataIndex: "bookingCode", key: "bookingCode" },
      {
        title: "Customer",
        dataIndex: "userCode",
        key: "user",
        render: (userId) => `User ${userId?.slice(-4) || "N/A"}`,
      },
      { title: "Showtime", dataIndex: "showTimeCode", key: "showTime" },
      {
        title: "Seat",
        dataIndex: "seatCode",
        key: "seats",
        render: (seats) => seats?.join(", ") || "N/A",
      },
      {
        title: "Amount",
        dataIndex: "totalAmount",
        key: "amount",
        render: (amount) => (amount ? `${amount.toLocaleString()} VND` : "N/A"),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const config = STATUS_CONFIG[status] || { color: "gray" };
          return (
            <Tag color={config.color}>
              {config.icon} {status}
            </Tag>
          );
        },
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "time",
        render: (_, record) => {
          const relatedBooking = data.bookings.find(
            (b) => b.bookingCode === record.bookingCode
          );
          const createdAt = relatedBooking?.createdAt || record.createdAt;
          return createdAt ? dayjs(createdAt).format("DD/MM/YYYY HH:mm") : "N/A";
        },
      },
    ],
    [data.bookings]
  );

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    } else {
      setDateRange(null); // Clear to show full year
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Error loading data"
          description={`Failed to connect to API: ${error}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return <Spin size="large" className="flex justify-center mt-10" />;
  }

  const {
    totalBookings = 0,
    totalRevenue = 0,
    statusCounts = {},
    recentBookings = [],
  } = stats;

  return (
    <div className="dashboard-container p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Revenue Dashboard</h2>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={totalBookings}
              valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
              formatter={(value) => `${value.toLocaleString()} USD`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Approved Bookings"
              value={statusCounts.CONFIRMED || 0}
              valueStyle={{ color: "#722ed1", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Canceled Bookings"
              value={statusCounts.CANCELLED || 0}
              valueStyle={{ color: "#f5222d", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} md={16}>
          <Card
            title="Revenue Trend"
            extra={<Tag icon={<LineChartOutlined />}>Daily</Tag>}
          >
            <RevenueChart 
              data={[filteredData.bookingDetails, filteredData.bookings]} 
              height={400} 
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Booking Status" extra={<Tag color="purple">%</Tag>}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span>{status}</span>
                  <span>{((count / totalBookings) * 100).toFixed(1)}%</span>
                </div>
                <Progress
                  percent={(count / totalBookings) * 100}
                  strokeColor={STATUS_COLORS[status]}
                  showInfo={false}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div className="flex items-center">
            <FireOutlined className="mr-2" />
            Recent Bookings
          </div>
        }
      >
        <Table
          columns={tableColumns}
          dataSource={recentBookings}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
          locale={{ emptyText: "No booking data available" }}
        />
      </Card>

      <Divider />
    </div>
  );
};

export default Dashboard;