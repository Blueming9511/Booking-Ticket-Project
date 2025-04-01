import React from 'react';
import { Tag } from 'antd';
import {
  CrownOutlined,
  TeamOutlined,
  StarOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const TagType = ({ 
  type, 
  customConfig = {}, 
  className = '', 
  showIcon = true,
  showText = true,
  size = 'default'
}) => {
  const defaultSeatConfig = {
    VIP: { icon: <CrownOutlined />, color: "gold", text: "VIP" },
    Standard: { icon: <TeamOutlined />, color: "blue", text: "Standard" },
    Couple: { icon: <StarOutlined />, color: "purple", text: "Couple" },
    Disabled: { icon: <CloseCircleOutlined />, color: "gray", text: "Disabled" },
  };

  const mergedConfig = { ...defaultSeatConfig, ...customConfig };
  const config = mergedConfig[type] || mergedConfig.Standard;

  const sizeClass = {
    small: 'text-xs py-0 px-2',
    default: 'text-sm py-1 px-3',
    large: 'text-base py-1 px-4'
  }[size];

  return (
    <Tag
      color={config.color}
      className={`flex items-center gap-1 ${sizeClass} ${className}`}
      icon={showIcon ? config.icon : null}
    >
      {showText ? config.text : null}
    </Tag>
  );
};

export default TagType;