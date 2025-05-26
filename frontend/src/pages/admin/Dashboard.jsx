import React, { useEffect, useState } from 'react';
import {
    Card,
    Statistic,
    Row,
    Col,
    Table,
    Progress,
    Avatar,
    Tag,
    Space,
    Divider,
    Select,
    Tabs,
    Spin,
    Button
} from 'antd';
import {
    UserOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    LineChartOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    StarFilled
} from '@ant-design/icons';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import axios from 'axios';

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const Dashboard = () => {
    const [revenueTimeframe, setRevenueTimeframe] = useState('monthly');
    const [revenueData, setRevenueData] = useState([]);
    const [topMovies, setTopMovies] = useState([]);
    const [cinemaData, setCinemaData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [salesData, setSalesData] = useState({
        revenues: {},
        newOrders: {},
        newCustomers: {},
        conversionRate: {}
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getAllData = async () => {
            setLoading(true);
            try {
                const [salesResponse, moviesResponse, cinemaResponse, bookingsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/dashboard/sales', { withCredentials: true }),
                    axios.get('http://localhost:8080/api/dashboard/top-movies', { withCredentials: true }),
                    axios.get('http://localhost:8080/api/dashboard/top-cinemas', { withCredentials: true }),
                    axios.get('http://localhost:8080/api/dashboard/recent-bookings', { withCredentials: true }),
                ]);
                setSalesData({
                    revenues: salesResponse.data.revenues,
                    newOrders: salesResponse.data.newOrders,
                    newCustomers: salesResponse.data.newCustomers,
                    conversionRate: salesResponse.data.conversionRates
                });
                setTopMovies(moviesResponse.data);
                setCinemaData(cinemaResponse.data.map((item, index) => ({
                    ...item,
                    color: colors[index]
                })));
                setRecentOrders(bookingsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        getAllData();
    }, []);

    const getTrend = (a, b, total) => {
        const current = a / total || 0;
        const last = b / total || 0;
        console.log(a, b, current, last, total)
        const percent = ((current - last) / Math.max(last, 1)) * 100;
        const isIncrease = current >= last;
        return {
            percent: Math.abs(percent.toFixed(1)),
            isIncrease,
        };
    }

    const customerTrend = getTrend(salesData.newCustomers.thisMoth, salesData.newCustomers.lastMonth, salesData.newCustomers.total);
    const orderTrend = getTrend(salesData.newOrders.thisMoth, salesData.newOrders.lastMonth, salesData.newOrders.total);
    const revenueTrend = getTrend(salesData.revenues.thisMoth, salesData.revenues.lastMonth, salesData.revenues.total);
    const conversionRateTrend = () => {
        const current = salesData.conversionRate.thisMonth;
        const last = salesData.conversionRate.lastMonth;
        const percent = ((current - last) / Math.max(last, 1)) * 100 || 0;
        const isIncrease = current >= last;
        return {
            percent: Math.abs(percent.toFixed(1)),
            isIncrease,
        };
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/api/dashboard/revenue?type=${revenueTimeframe}`, { withCredentials: true })
            .then(response => {
                setRevenueData(response.data);
            })
            .catch(error => {
                console.error('Error fetching revenue data:', error);
            });
    }, [revenueTimeframe]);


    // Columns for recent orders table
    const orderColumns = [
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            render: (text, record) => (
                <div className="flex items-center gap-2">
                    <Avatar size="small" icon={<UserOutlined />} />
                    {record.customerName}
                </div>
            )
        },
        {
            title: 'Movie',
            dataIndex: 'movieTitle',
            key: 'movieTitle',
            render: (text) => (
                <span className="text-gray-800 font-medium">
                    {text}
                </span>
            )
        },
        {
            title: 'Date',
            dataIndex: 'bookingDate',
            key: 'bookingDate'
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (totalAmount) => `$${totalAmount?.toLocaleString() || 0}`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'APPROVED':
                        color = 'green';
                        break;
                    case 'PENDING':
                        color = 'orange';
                        break;
                    case 'CANCELLED':
                        color = 'red';
                        break;
                    default:
                        color = 'gray';
                }
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
        }
    ];

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <Spin size='large' spinning={loading} />
            </div>
        )
    }

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black mb-8 text-gray-800">DASHBOARD OVERVIEW</h1>
                <Divider />
                {/* Stats Cards */}
                <Row gutter={[16, 16]} className="mb-8">
                    <Col md={24} lg={12} xl={6}>
                        <Card className="border-0 hover:shadow-md hover:-translate-y-1 ease-in-out transition-shadow duration-300">
                            <Statistic
                                title={<span className="text-gray-600 font-semibold text-sm">Total Revenue</span>}
                                value={salesData.revenues.total}
                                precision={2}
                                prefix={<DollarOutlined className="text-green-500" />}
                                suffix="USD"
                                valueStyle={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold' }}
                            />
                            {
                                revenueTrend.isIncrease ?
                                    <div className="mt-3 flex items-center text-sm">
                                        <ArrowUpOutlined className="text-green-500 mr-1" />
                                        <span className="text-green-600 font-medium">{revenueTrend.percent}% increase</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                                    :
                                    <div className="mt-3 flex items-center text-sm">
                                        <ArrowDownOutlined className="text-red-500 mr-1" />
                                        <span className="text-red-600 font-medium">{revenueTrend.percent}% decrease</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                            }
                        </Card>
                    </Col>
                    <Col md={24} lg={12} xl={6}>
                        <Card className="border-0 hover:shadow-md hover:-translate-y-1 ease-in-out transition-shadow duration-300">
                            <Statistic
                                title={<span className="text-gray-600 font-semibold text-sm">Total Orders</span>}
                                value={salesData.newOrders.total}
                                prefix={<ShoppingCartOutlined className="text-blue-500" />}
                                valueStyle={{ color: '#2563eb', fontSize: '24px', fontWeight: 'bold' }}
                            />
                            {
                                orderTrend.isIncrease ?
                                    <div className="mt-3 flex items-center text-sm">
                                        <ArrowUpOutlined className="text-green-500 mr-1" />
                                        <span className="text-green-600 font-medium">{orderTrend.percent}% increase</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                                    :
                                    <div className="mt-3 flex items-center text-sm">
                                        <ArrowDownOutlined className="text-red-500 mr-1" />
                                        <span className="text-red-600 font-medium">{orderTrend.percent}% decrease</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                            }
                        </Card>
                    </Col>
                    <Col md={24} lg={12} xl={6}>
                        <Card
                            style={{ boxShadow: "none" }}
                            className="border-0 hover:shadow-md hover:-translate-y-1 ease-in-out transition-shadow duration-300">
                            <Statistic
                                title={<span className="text-gray-600 font-semibold text-sm">New Customers</span>}
                                value={salesData.newCustomers.total}
                                prefix={<UserOutlined className="text-purple-500" />}
                                valueStyle={{ color: '#7c3aed', fontSize: '24px', fontWeight: 'bold' }}
                            />
                            {
                                customerTrend.isIncrease ?
                                    <div className="mt-3 flex items-center text-sm">
                                        <ArrowUpOutlined className="text-green-500 mr-1" />
                                        <span className="text-green-600 font-medium">{customerTrend.percent}% increase</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                                    :
                                    <div className="mt-3 flex items-center text-sm">
                                        <ArrowDownOutlined className="text-red-500 mr-1" />
                                        <span className="text-red-600 font-medium">{customerTrend.percent}% decrease</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                            }
                        </Card>
                    </Col>
                    <Col md={24} lg={12} xl={6}>
                        <Card
                            className="border-0 hover:shadow-md hover:-translate-y-1 ease-in-out transition-shadow duration-300"
                            style={{ boxShadow: "none" }}>
                            <Statistic
                                title={<span className="text-gray-600 font-semibold text-sm">Conversion Rate</span>}
                                value={salesData.conversionRate.total}
                                precision={1}
                                suffix="%"
                                prefix={<LineChartOutlined className="text-orange-500" />}
                                valueStyle={{ color: '#ea580c', fontSize: '24px', fontWeight: 'bold' }}
                            />
                            {
                                conversionRateTrend.isIncrease ?
                                    <div className="mt-3 flex items-center text-sm">
                                        <ArrowUpOutlined className="text-green-500 mr-1" />
                                        <span className="text-green-600 font-medium">{conversionRateTrend.percent || 0}% increase</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                                    :
                                    <div className="mt-3 flex items-center text-sm">
                                        <ArrowDownOutlined className="text-red-500 mr-1" />
                                        <span className="text-red-600 font-medium">{conversionRateTrend.percent || 0}% decrease</span>
                                        <span className="text-gray-500 ml-1">from last month</span>
                                    </div>
                            }
                        </Card>
                    </Col>
                </Row>

                {/* Revenue Chart */}
                <Row gutter={[24, 24]} className="mb-8">
                    <Col span={24}>
                        <Card
                            className="border-0"
                            variant='borderless'
                            style={{ boxShadow: "none" }}
                            title={
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Revenue Overview</span>
                                    <Select
                                        value={revenueTimeframe}
                                        onChange={setRevenueTimeframe}
                                        className="w-32"
                                        options={[
                                            { value: 'weekly', label: 'Weekly' },
                                            { value: 'monthly', label: 'Monthly' },
                                            { value: 'quarterly', label: 'Quarterly' },
                                            { value: 'yearly', label: 'Yearly' }
                                        ]}
                                    />
                                </div>
                            }
                        >
                            <div style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="period"
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            axisLine={{ stroke: '#d1d5db' }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            axisLine={{ stroke: '#d1d5db' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Movies and Cinema Charts */}
                <Row gutter={[24, 24]} className="mb-8">
                    <Col lg={24} xl={12}>
                        <Card
                            title={<span className="text-lg font-bold text-gray-800">Top Performing Movies</span>}
                            className="border-0"
                            variant='borderless'
                            style={{ boxShadow: "none" }}
                            extra={<a href="/admin/movies" className="text-blue-500 hover:text-blue-700">View All</a>}
                        >
                            <div style={{ height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topMovies} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <YAxis
                                            type="number"
                                            tick={{ fontSize: 11, fill: '#6b7280' }}
                                            axisLine={{ stroke: '#d1d5db' }}
                                        />
                                        <XAxis
                                            type="category"
                                            dataKey="title"
                                            tick={{ fontSize: 10, fill: '#6b7280' }}
                                            axisLine={{ stroke: '#d1d5db' }}
                                            width={120}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Bar
                                            dataKey="sales"
                                            fill="#8884d8"
                                            radius={[10, 10, 0, 0]}
                                            name="Tickets Sold"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>

                    <Col lg={24} xl={12}>
                        <div className="rounded-lg">
                            <Card
                                title={<span className="text-lg font-bold text-gray-800">Top Performing Movies</span>}
                                className="border-0"
                                variant='borderless'
                                style={{ boxShadow: "none" }}
                                extra={<a href='/admin/movies' className="text-blue-500 hover:text-blue-700">View All</a>}
                            >
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={topMovies}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="title"
                                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#d1d5db' }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={100}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#d1d5db' }}
                                                label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                                }}
                                                formatter={(value, name) => [`${value}M`, 'Revenue']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#ff7300"
                                                strokeWidth={3}
                                                dot={{ fill: '#ff7300', strokeWidth: 2, r: 6 }}
                                                activeDot={{ r: 8, fill: '#ff7300' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </Col>


                    <Col span={24}>
                        <Card
                            title={<span className="text-lg font-bold text-gray-800">Revenue by Cinema</span>}
                            variant='borderless'
                            style={{ boxShadow: "none" }}
                            className="border-0"
                        >
                            <div style={{ height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={cinemaData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="revenue"
                                        >
                                            {cinemaData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={(value, entry) => `${entry.payload.cinemaName}: $${entry.payload.revenue.toLocaleString()}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Recent Orders */}
                <Row gutter={[24, 24]} className="mb-8">
                    <Col span={24}>
                        <Card
                            title={<span className="text-lg font-bold text-gray-800">Recent Orders</span>}
                            extra={<a href="/admin/bookings" className="text-blue-500 hover:text-blue-700">View All</a>}
                            variant='borderless'
                            style={{ boxShadow: "none" }}
                            className="border-0"
                        >
                            <Table
                                columns={orderColumns}
                                dataSource={recentOrders}
                                size="large"
                                rowKey="id"
                                scroll={{ x: "max-content" }}
                                className="border border-gray-100 rounded-lg"
                            />
                        </Card>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default Dashboard;