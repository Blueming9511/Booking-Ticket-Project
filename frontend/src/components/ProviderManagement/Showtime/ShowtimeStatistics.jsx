import React from 'react';
import { Card, Avatar, Progress, Tag } from 'antd';
import { 
  VideoCameraOutlined, 
  DollarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import CardStatistics from '../../ui/Card/CardStatistics';

const ShowTimeStatistics = ({ data }) => {
  // Tính toán các thống kê
  const totalShowTimes = data.length;
  const activeShowTimes = data.filter(st => st.status === "Active").length;
  const inactiveShowTimes = data.filter(st => st.status === "Inactive").length;
  
  // Tính tổng doanh thu ước tính (giả sử tất cả ghế đã đặt sẽ được bán)
  const totalPotentialRevenue = data.reduce((sum, showtime) => {
    return sum + (showtime.price * showtime.seatsBooked);
  }, 0);
  
  // Tính tỷ lệ ghế đã đặt
  const totalSeatsAvailable = data.reduce((sum, showtime) => sum + showtime.seatsAvailable, 0);
  const totalSeatsBooked = data.reduce((sum, showtime) => sum + showtime.seatsBooked, 0);
  const bookingRate = totalSeatsAvailable > 0 ? (totalSeatsBooked / totalSeatsAvailable) * 100 : 0;

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Showtimes"
        value={totalShowTimes}
        icon={<VideoCameraOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Active Showtimes"
        value={activeShowTimes}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
      />
      
      <CardStatistics
        title="Potential Revenue"
        value={`$${(totalPotentialRevenue / 1000000).toFixed(1)}M`}
        icon={<DollarOutlined />}
        color="#722ed1"
      />
      
      <CardStatistics
        title="Booking Rate"
        value={`${Math.round(bookingRate)}%`}
        icon={<ClockCircleOutlined />}
        color="#faad14"
        showProgress
        progressValue={Math.round(bookingRate)}
        progressColor={bookingRate > 70 ? "#52c41a" : bookingRate > 30 ? "#faad14" : "#ff4d4f"}
      />
    </div>
  );
};

export default ShowTimeStatistics;