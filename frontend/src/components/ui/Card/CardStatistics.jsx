import React from 'react';
import { Card, Avatar, Progress } from 'antd';

const CardStatistics = ({
  title,
  value,
  icon,
  color = '#1890ff',
  showProgress = false,
  progressValue = 0,
  progressColor,
  className = ''
}) => {
  return (
    <Card className={`shadow-none hover:shadow-md ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-500">{title}</div>
          <div className="text-2xl font-bold" style={{ color }}>
            {value}
          </div>
        </div>
        {showProgress ? (
          <Progress
            type="circle"
            percent={progressValue}
            width={40}
            strokeColor={progressColor || color}
            format={() => null}
          />
        ) : (
          <Avatar size="large" style={{ backgroundColor: `${color}10`, color }}>
            {icon}
          </Avatar>
        )}
      </div>
    </Card>
  );
};

export default CardStatistics;