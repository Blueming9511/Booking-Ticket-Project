import React from "react";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  StopOutlined,
  PauseCircleOutlined
} from "@ant-design/icons";

const TagStatus = ({ status, config, showText = true, size = "default" }) => {
  console.log(status)
  // Cấu hình màu sắc và icon theo status
  const statusConfig = {
    NOW_SHOWING: {
      icon: <CheckCircleOutlined />,
      color: "success",
      text: "Now Showing",
      className: "text-green-500"
    },
    COMING_SOON: {
      icon: <ClockCircleOutlined />,
      color: "processing",
      text: "Coming Soon",
      className: "text-blue-500"
    },
    ENDED: {
      icon: <StopOutlined />,
      color: "red",
      text: "Ended",
      className: "text-gray-500"
    },
    PENDING: {
      icon: <ClockCircleOutlined />,
      color: "processing",
      text: "Pending",
      className: "text-blue-500"
    },
    APPROVED: {
      icon: <CheckCircleOutlined />,
      color: "success",
      text: "Approved",
      className: "text-green-500"
    },
    REJECTED: {
      icon: <CloseCircleOutlined />,
      color: "error",
      text: "Rejected",
      className: "text-red-500"
    },
    ACTIVE: {
      icon: <CheckCircleOutlined />,
      color: "success",
      text: "Active",
      className: "text-green-500"
    },
    OPEN: {
      icon: <CheckCircleOutlined />,
      color: "success",
      text : "Open",
      className: "text-green-500"
    },
    MAINTAINED: {
      icon: <InfoCircleOutlined />,
      color: "warning",
      text: "Maintained",
      className: "text-green-500"
    },
    INACTIVE: {
      icon: <StopOutlined />,
      color: "default",
      text: "Inactive",
      className: "text-gray-500"
    },
    SUSPENDED: {
      icon: <PauseCircleOutlined />,
      color: "warning",
      text: "Suspended",
      className: "text-orange-500"
    },
    AVAILABLE: {
      icon: <CheckCircleOutlined />,
      color: "success",
      text: "Available",
      className: "text-green-500"
    },
    BOOKED: {
      icon: <CloseCircleOutlined />,
      color: "error",
      text: "Booked",
      className: "text-red-500"
    },
    MAINTENANCE: {
      icon: <ExclamationCircleOutlined />,
      color: "warning",
      text: "Maintenance",
      className: "text-yellow-500"
    },
    RESERVED: {
      icon: <InfoCircleOutlined />,
      color: "processing",
      text: "Reserved",
      className: "text-blue-500"
    },
    CLOSED: {
      icon: <CloseCircleOutlined />,
      color: "error",
      text: "Closed",
      className: "text-red-500"
    },
    RENOVATING: {
      icon: <SyncOutlined spin />,
      color: "warning",
      text: "Renovating",
      className: "text-yellow-500"
    },
    UNDER_MAINTENANCE: {
      icon: <ExclamationCircleOutlined />,
      color: "warning",
      text: "Under Maintenance",
      className: "text-yellow-500"
    },
    // Fallback cho các status không xác định
    UNKNOWN: {
      icon: <InfoCircleOutlined />,
      color: "default",
      text: status || "Unknown",
      className: "text-gray-500"
    }
  };

  // Merge với config từ props nếu có
  const mergedConfig = { ...statusConfig, ...config };
  const currentStatus = status?.toUpperCase() || "UNKNOWN";
  const currentConfig = mergedConfig[currentStatus] || mergedConfig.UNKNOWN;

  // Kích thước tag
  const sizeClasses = {
    small: "text-xs py-0 px-2",
    default: "text-sm py-1 px-3",
    large: "text-base py-1 px-4"
  };

  return (
    <Tag
      color={currentConfig.color}
      className={`
        ${sizeClasses[size]} 
        ${currentConfig.className}
        flex items-center
        border border-opacity-20
        ${showText ? 'min-w-[80px]' : 'min-w-[24px] justify-center'}
        transition-all duration-200
        hover:shadow-md
      `}
      icon={currentConfig.icon}
    >
      {showText && (
        <span className="font-medium">{currentConfig.text}</span>
      )}
    </Tag>
  );
};

export default TagStatus;