import React from 'react';
import { TeamOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import CardStatistics from './CardStatistics';

const SeatStatistics = ({ data }) => {
  const totalSeats = data.length;
  const availableSeats = data.filter(seat => seat.status === "Available").length;
  const bookedSeats = data.filter(seat => seat.status === "Booked").length;
  const availabilityRate = totalSeats > 0 ? (availableSeats / totalSeats) * 100 : 0;

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Seats"
        value={totalSeats}
        icon={<TeamOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Available"
        value={availableSeats}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
      />
      
      <CardStatistics
        title="Booked"
        value={bookedSeats}
        icon={<CloseCircleOutlined />}
        color="#ff4d4f"
      />
      
      <CardStatistics
        title="Availability"
        value={`${Math.round(availabilityRate)}%`}
        showProgress
        progressValue={Math.round(availabilityRate)}
        progressColor="#52c41a"
      />
    </div>
  );
};

export default SeatStatistics;