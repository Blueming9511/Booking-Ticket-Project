import React from 'react';
import { Card, Avatar, Progress } from 'antd';
import { VideoCameraOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import CardStatistics from './CardStatistics';

const CinemaStatistics = ({ data }) => {
  const totalCinemas = data.length;
  const activeCinemas = data.filter(c => c.status === "Active").length;
  const closedCinemas = data.filter(c => c.status === "Closed").length;
  const activeRate = totalCinemas > 0 ? (activeCinemas / totalCinemas) * 100 : 0;
  const totalScreens = data.reduce((sum, cinema) => sum + cinema.screens, 0);

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Cinemas"
        value={totalCinemas}
        icon={<VideoCameraOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Active Cinemas"
        value={activeCinemas}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
      />
      
      <CardStatistics
        title="Total Screens"
        value={totalScreens}
        icon={<VideoCameraOutlined />}
        color="#722ed1"
      />
      
      <CardStatistics
        title="Active Rate"
        value={`${Math.round(activeRate)}%`}
        showProgress
        progressValue={Math.round(activeRate)}
        progressColor="#52c41a"
      />
    </div>
  );
};

export default CinemaStatistics;