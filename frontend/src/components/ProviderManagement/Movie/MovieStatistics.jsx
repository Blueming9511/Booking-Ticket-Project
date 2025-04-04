import React from 'react';
import { Card, Avatar, Tag } from 'antd';
import { 
  VideoCameraOutlined, 
  DollarOutlined,
  StarOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons';
import CardStatistics from '../../ui/Card/CardStatistics';
import { convertMoney } from '../../utils/Converter';

const MovieStatistics = ({ data }) => {
  // Tính toán các thống kê
  const totalMovies = data.length;
  const nowShowing = data.filter(m => m.status === "Now Showing").length;
  const endedMovies = data.filter(m => m.status === "Ended").length;
  
  // Tính tổng doanh thu và ngân sách
  const totalRevenue = data.reduce((sum, movie) => {
    return sum + movie.boxOffice;
  }, 0);
  
  const totalBudget = data.reduce((sum, movie) => {
    return sum + movie.budget;
  }, 0);
  
  // Tính rating trung bình
  const averageRating = data.reduce((sum, movie) => {
    return sum + movie.rating;
  }, 0) / totalMovies;

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Movies"
        value={totalMovies}
        icon={<VideoCameraOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Now Showing"
        value={nowShowing}
        icon={<FireOutlined />}
        color="#52c41a"
      />
      
      <CardStatistics
        title="Average Rating"
        value={averageRating.toFixed(1)}
        icon={<StarOutlined />}
        color="#faad14"
        suffix="/10"
      />
      
      <CardStatistics
        title="Total Revenue"
        value={`${convertMoney(totalRevenue)}`}
        icon={<DollarOutlined />}
        color="#722ed1"
      />
    </div>
  );
};

export default MovieStatistics;