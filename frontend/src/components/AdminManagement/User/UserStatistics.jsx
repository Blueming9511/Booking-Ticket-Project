import React from 'react';
import { Card, Avatar, Progress } from 'antd';
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import CardStatistics from '../../ui/Card/CardStatistics';

const UserStatistics = ({ data }) => {
  const totalUsers = data.length;
  const adminUsers = data.filter(u => u.role === "ADMIN").length;
  const staffUsers = data.filter(u => u.role === "PROVIDER").length;
  const regularUsers = data.filter(u => u.role === "USER").length;
  const adminRate = totalUsers > 0 ? (adminUsers / totalUsers) * 100 : 0;

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Users"
        value={totalUsers}
        icon={<UserOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Admin Users"
        value={adminUsers}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
      />
      
      <CardStatistics
        title="Provider Users"
        value={staffUsers}
        icon={<UserOutlined />}
        color="#722ed1"
      />
      
      <CardStatistics
        title="Admin Rate"
        value={`${Math.round(adminRate)}%`}
        showProgress
        progressValue={Math.round(adminRate)}
        progressColor="#52c41a"
      />
    </div>
  );
};

export default UserStatistics;