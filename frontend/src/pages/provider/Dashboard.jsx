import React from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Tag,
  Avatar,
  Divider,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  LineChartOutlined,
  StarOutlined,
  FireOutlined,
  CalendarOutlined,
  TeamOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import MiniChart from "../../components/ui/Charts/MiniChart";

// Dữ liệu mẫu
const revenueData = [
  { month: "Jan", value: 12000 },
  { month: "Feb", value: 19000 },
  { month: "Mar", value: 8000 },
  { month: "Apr", value: 16000 },
  { month: "May", value: 25000 },
  { month: "Jun", value: 18000 },
];

const topMovies = [
  { id: 1, title: "Avengers: Endgame", sales: 1250, rating: 4.8 },
  { id: 2, title: "Spider-Man: No Way Home", sales: 980, rating: 4.7 },
  { id: 3, title: "The Batman", sales: 870, rating: 4.5 },
  { id: 4, title: "Doctor Strange 2", sales: 760, rating: 4.3 },
  { id: 5, title: "Top Gun: Maverick", sales: 680, rating: 4.9 },
];

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "purchased ticket",
    movie: "The Batman",
    time: "10 mins ago",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "wrote review",
    movie: "Doctor Strange 2",
    time: "25 mins ago",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "rated",
    movie: "Top Gun: Maverick",
    time: "1 hour ago",
  },
  {
    id: 4,
    user: "Sarah Williams",
    action: "booked seats",
    movie: "Jurassic World",
    time: "2 hours ago",
  },
  {
    id: 5,
    user: "David Brown",
    action: "cancelled booking",
    movie: "Lightyear",
    time: "3 hours ago",
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Phần thống kê tổng quan */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={12543}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff", fontWeight: "bolder" }}
            />
            <Progress percent={72} status="active" showInfo={false} />
            <div className="text-sm text-gray-500 mt-2">
              +12% from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Tickets Sold"
              value={8562}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#52c41a", fontWeight: "bolder" }}
            />
            <Progress
              percent={85}
              status="active"
              showInfo={false}
              strokeColor="#52c41a"
            />
            <div className="text-sm text-gray-500 mt-2">
              +24% from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={125800}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#722ed1", fontWeight: "bolder" }}
              precision={2}
              formatter={(value) => `$${value}`}
            />
            <Progress
              percent={65}
              status="active"
              showInfo={false}
              strokeColor="#722ed1"
            />
            <div className="text-sm text-gray-500 mt-2">
              +18% from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Rating"
              value={4.6}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#faad14", fontWeight: "bolder" }}
              precision={1}
            />
            <Progress
              percent={92}
              status="active"
              showInfo={false}
              strokeColor="#faad14"
            />
            <div className="text-sm text-gray-500 mt-2">
              +0.2 from last month
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} md={24}>
          <Card
            title="Revenue Overview"
            extra={
              <Tag icon={<LineChartOutlined />} color="blue">
                Last 6 Months
              </Tag>
            }
          >
            <MiniChart data={revenueData} height={250} />
          </Card>
        </Col>
      </Row>

      {/* Phần hoạt động gần đây và thống kê phụ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Top Performing Movies"
            extra={
              <Tag icon={<FireOutlined />} color="red">
                This Month
              </Tag>
            }
          >
            <div className="space-y-5">
              {topMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Avatar
                      size="small"
                      style={{ backgroundColor: "#f56a00", marginRight: 8 }}
                    >
                      {movie.id}
                    </Avatar>
                    <span className="font-medium text-sm">{movie.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Tag color="blue">{movie.sales} tickets</Tag>
                    <Tag icon={<StarOutlined />} color="gold">
                      {movie.rating}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="System Overview">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  size="small"
                  title="Cinemas"
                  extra={<VideoCameraOutlined />}
                >
                  <Statistic value={24} style={{ fontWeight: "bolder" }} />
                  <div className="text-sm text-gray-500 mt-2">8 active now</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  size="small"
                  title="Screens"
                  extra={<VideoCameraOutlined />}
                >
                  <Statistic value={156} style={{ fontWeight: "bolder" }} />
                  <div className="text-sm text-gray-500 mt-2">72% occupied</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Staff" extra={<TeamOutlined />}>
                  <Statistic value={83} style={{ fontWeight: "bolder"}} />
                  <div className="text-sm text-gray-500 mt-2">12 on duty</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Coupons" extra={<FireOutlined />}>
                  <Statistic value={15} style={{ fontWeight: "bolder" }} />
                  <div className="text-sm text-gray-500 mt-2">8 active</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Phần footer dashboard */}
      <Divider />
      <div className="text-center text-gray-500 text-sm">
        Last updated: {new Date().toLocaleString()} | System version: 2.4.1
      </div>
    </div>
  );
};

export default Dashboard;
