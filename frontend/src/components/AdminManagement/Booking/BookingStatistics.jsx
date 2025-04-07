import React from 'react';
import { Card } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined } from '@ant-design/icons';
import CardStatistics from '../../ui/Card/CardStatistics';

const BookingStatistics = ({ data }) => {
  const totalBookings = data.length;
  const confirmedBookings = data.filter(b => b.status === "CONFIRMED").length;
  const cancelledBookings = data.filter(b => b.status === "CANCELLED").length;
  const totalRevenue = data.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Bookings"
        value={totalBookings}
        icon={<ClockCircleOutlined />}
        color="#1890ff"
      />
      <CardStatistics
        title="Confirmed Bookings"
        value={confirmedBookings}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
      />
      <CardStatistics
        title="Cancelled Bookings"
        value={cancelledBookings}
        icon={<CloseCircleOutlined />}
        color="#ff4d4f"
      />
      <CardStatistics
        title="Total Revenue"
        value={totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        icon={<DollarOutlined />}
        color="#fa8c16"
      />
    </div>
  );
};

export default BookingStatistics;