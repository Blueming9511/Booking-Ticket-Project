import React from "react";
import { Badge, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const TagStatus = ({ status, config, showText = true, size = "default" }) => {
  // Config mặc định
  const defaultConfig = {
    Active: { icon: <CheckCircleOutlined />, color: "success", text: "Active" },
    Available: {
      icon: <CheckCircleOutlined />,
      color: "success",
      text: "Available",
    },
    Booked: { icon: <CloseCircleOutlined />, color: "error", text: "Booked" },
    Maintenance: {
      icon: <ExclamationCircleOutlined />,
      color: "warning",
      text: "Maintenance",
    },
    Reserved: {
      icon: <InfoCircleOutlined />,
      color: "reminder",
      text: "Reserved",
    },
    Closed: { icon: <CloseCircleOutlined />, color: "error", text: "Closed" },
    Renovating: {
      icon: <SyncOutlined />,
      color: "warning",
      text: "Renovating",
    },
    Inactive: {
      icon: <CloseCircleOutlined />,
      color: "default",
      text: "Inactive",
    },
  };

  const mergedConfig = { ...defaultConfig, ...config };
  const currentConfig = mergedConfig[status] || {
    icon: null,
    color: "default",
    text: status,
  };
  return (
    <Tag color={currentConfig.color}>
      {currentConfig.icon && <span className="mr-2">{currentConfig.icon}</span>}
      {showText && <span>{currentConfig.text}</span>}
    </Tag>
  );
};

export default TagStatus;
