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
    ACTIVE: { icon: <CheckCircleOutlined />, color: "success", text: "Active" },
    AVAILABLE: {
      icon: <CheckCircleOutlined />,
      color: "success",
      text: "Available",
    },
    BOOKED: { icon: <CloseCircleOutlined />, color: "error", text: "Booked" },
    MAINTENANCE: {
      icon: <ExclamationCircleOutlined />,
      color: "warning",
      text: "Maintenance",
    },
    MAINTAINED: {
      icon: <ExclamationCircleOutlined />,
      color: "warning",
      text: "Maintenance",
    },
    RESERVED: {
      icon: <InfoCircleOutlined />,
      color: "reminder",
      text: "Reserved",
    },
    CLOSED: { icon: <CloseCircleOutlined />, color: "error", text: "Closed" },
    Renovating: {
      icon: <SyncOutlined />,
      color: "warning",
      text: "Renovating",
    },
    INACTIVE: {
      icon: <CloseCircleOutlined />,
      color: "default",
      text: "Inactive",
    },
    OPEN: {
      icon: <CheckCircleOutlined />,
      color: "success",
      text: "Open",
    },
    UNDER_MAINTENANCE: {
      icon: <ExclamationCircleOutlined />,
      color: "warning",
      text: "Under Maintenance",
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
