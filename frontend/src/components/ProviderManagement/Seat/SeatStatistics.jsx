import React, { useMemo } from 'react';
import { TeamOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import CardStatistics from '../../ui/Card/CardStatistics';

const SeatStatistics = ({ data = [] }) => {
  // Sử dụng useMemo để tối ưu tính toán
  const stats = useMemo(() => {
    const totalSeats = data.length;
    const availableSeats = data.filter(seat => seat.status === "AVAILABLE").length;
    const bookedSeats = data.filter(seat => seat.status === "BOOKED").length; // Chuẩn hóa thành "BOOKED"
    const availabilityRate = totalSeats > 0 ? (availableSeats / totalSeats) * 100 : 0;

    // Phân loại theo loại ghế
    const standardSeats = data.filter(seat => seat.type === "STANDARD").length;
    const vipSeats = data.filter(seat => seat.type === "VIP").length;
    const coupleSeats = data.filter(seat => seat.type === "COUPLE").length;

    return {
      totalSeats,
      availableSeats,
      bookedSeats,
      availabilityRate,
      standardSeats,
      vipSeats,
      coupleSeats
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Seats"
        value={stats.totalSeats}
        icon={<TeamOutlined />}
        color="#1890ff"
        suffix={<span className="text-xs text-gray-500">seats</span>}
      />
      
      <CardStatistics
        title="Available Seats"
        value={stats.availableSeats}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
        suffix={
          stats.totalSeats > 0 && (
            <span className="text-xs text-gray-500">
              ({Math.round(stats.availabilityRate)}%)
            </span>
          )
        }
      />
      
      <CardStatistics
        title="Booked Seats"
        value={stats.bookedSeats}
        icon={<CloseCircleOutlined />}
        color="#ff4d4f"
        suffix={
          stats.totalSeats > 0 && (
            <span className="text-xs text-gray-500">
              ({Math.round((stats.bookedSeats / stats.totalSeats) * 100)}%)
            </span>
          )
        }
      />
      
      <CardStatistics
        title="Availability Rate"
        value={`${Math.round(stats.availabilityRate)}%`}
        icon={<ClockCircleOutlined />}
        color="#faad14"
        showProgress
        progressValue={Math.round(stats.availabilityRate)}
        progressColor={
          stats.availabilityRate > 70 ? "#52c41a" : 
          stats.availabilityRate > 30 ? "#faad14" : "#ff4d4f"
        }
        suffix={
          <span className="text-xs text-gray-500">
            ({stats.availableSeats}/{stats.totalSeats})
          </span>
        }
      />
    </div>
  );
};

export default SeatStatistics;