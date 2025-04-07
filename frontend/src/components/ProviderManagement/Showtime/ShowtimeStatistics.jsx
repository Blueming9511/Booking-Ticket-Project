import React, { useMemo } from 'react';
import { Card } from 'antd';
import { 
  VideoCameraOutlined, 
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import CardStatistics from '../../ui/Card/CardStatistics';

const ShowTimeStatistics = ({ data = [], bookings = [] }) => {
  const stats = useMemo(() => {
    const totalShowTimes = data.length;
    const activeShowTimes = data.filter(st => st.status === "AVAILABLE").length;
    const inactiveShowTimes = data.filter(st => st.status === "FULL").length;

    const totalRevenue = bookings.reduce((sum, booking) => {
      const showtime = data.find(st => st.showtimeCode === booking.showtimeCode);
      return sum + (showtime ? (booking.totalAmount || showtime.price * booking.seatCode?.length || 0) : 0);
    }, 0);

    const totalSeatsAvailable = data.reduce((sum, showtime) => 
      sum + 200, 0);
    const totalSeatsBooked = bookings.reduce((sum, booking) => 
      sum + (Array.isArray(booking.seatCode) ? booking.seatCode.length : 0), 0);
    const bookingRate = totalSeatsAvailable > 0 
      ? Math.round((totalSeatsBooked / totalSeatsAvailable) * 100) 
      : 0;

    return {
      totalShowTimes,
      activeShowTimes,
      inactiveShowTimes,
      totalRevenue,
      bookingRate,
      totalSeatsBooked,
      totalSeatsAvailable
    };
  }, [data, bookings]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Showtimes"
        value={stats.totalShowTimes}
        icon={<VideoCameraOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Active Showtimes"
        value={stats.activeShowTimes}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
        suffix={stats.totalShowTimes > 0 && (
          <span className="text-xs text-gray-500">
            ({Math.round((stats.activeShowTimes / stats.totalShowTimes) * 100)}%)
          </span>
        )}
      />
      
      <CardStatistics
        title="Total Revenue"
        value={stats.totalRevenue >= 1000000 
          ? `$${(stats.totalRevenue / 1000000).toFixed(1)}M`
          : stats.totalRevenue >= 1000 
            ? `$${(stats.totalRevenue / 1000).toFixed(1)}K`
            : `$${stats.totalRevenue.toLocaleString()}`
        }
        icon={<DollarOutlined />}
        color="#722ed1"
      />
      
      <CardStatistics
        title="Booking Rate"
        value={`${stats.bookingRate}%`}
        icon={<ClockCircleOutlined />}
        color="#faad14"
        showProgress
        progressValue={stats.bookingRate}
        progressColor={stats.bookingRate > 70 ? "#52c41a" : stats.bookingRate > 30 ? "#faad14" : "#ff4d4f"}
        suffix={
          <span className="text-xs text-gray-500">
            ({stats.totalSeatsBooked}/{stats.totalSeatsAvailable})
          </span>
        }
      />
    </div>
  );
};

export default ShowTimeStatistics;