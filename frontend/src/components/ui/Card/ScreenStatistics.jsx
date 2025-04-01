import React from 'react';
import { Card, Avatar } from 'antd';
import { 
  VideoCameraOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  StarOutlined,
  ThunderboltOutlined 
} from '@ant-design/icons';
import CardStatistics from './CardStatistics';

const ScreenStatistics = ({ data }) => {
  const totalScreens = data.length;
  const activeScreens = data.filter(s => s.status === "Active").length;
  const premiumScreens = data.filter(s => 
    s.type === "VIP" || s.type === "IMAX" || s.type === "4DX" || s.type === "Premium"
  ).length;
  const activeRate = totalScreens > 0 ? (activeScreens / totalScreens) * 100 : 0;
  const totalCapacity = data.reduce((sum, screen) => sum + screen.capacity, 0);

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Screens"
        value={totalScreens}
        icon={<VideoCameraOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Active Screens"
        value={activeScreens}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
      />
      
      <CardStatistics
        title="Premium Screens"
        value={premiumScreens}
        icon={<StarOutlined />}
        color="#faad14"
      />
      
      <CardStatistics
        title="Total Capacity"
        value={totalCapacity}
        icon={<ThunderboltOutlined />}
        color="#722ed1"
        suffix="seats"
      />
    </div>
  );
};

export default ScreenStatistics;