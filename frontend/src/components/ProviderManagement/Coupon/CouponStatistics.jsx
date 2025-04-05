import React from 'react';
import { Card, Avatar, Progress, Tag } from 'antd';
import { 
  FireOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import CardStatistics from '../../ui/Card/CardStatistics';

const CouponStatistics = ({ data }) => {
  // Tính toán các thống kê
  const totalCoupons = data.length;
  const activeCoupons = data.filter(c => c.status === "Active").length;
  const expiredCoupons = data.filter(c => c.status === "Expired").length;
  const inactiveCoupons = data.filter(c => c.status === "Inactive").length;
  
  // Tính tỷ lệ coupon đang hoạt động
  const activeRate = totalCoupons > 0 ? (activeCoupons / totalCoupons) * 100 : 0;
  
  // Phân loại coupon theo loại giảm giá
  const percentCoupons = 0;
  const fixedCoupons = 0;

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Coupons"
        value={totalCoupons}
        icon={<GiftOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Active Coupons"
        value={activeCoupons}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
      />
      
      <CardStatistics
        title="Discount Types"
        value={`${percentCoupons}% / ${fixedCoupons} fixed`}
        icon={<FireOutlined />}
        color="#722ed1"
      />
      
      <CardStatistics
        title="Active Rate"
        value={`${Math.round(activeRate)}%`}
        icon={<ClockCircleOutlined />}
        color="#faad14"
        showProgress
        progressValue={Math.round(activeRate)}
        progressColor={activeRate > 70 ? "#52c41a" : activeRate > 30 ? "#faad14" : "#ff4d4f"}
      />
    </div>
  );
};

export default CouponStatistics;