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
import dayjs from 'dayjs';

const CouponStatistics = ({ data }) => {
  const coupons = data || [];

  // Tính toán các thống kê
  const now = dayjs();
  const activeCoupons = data.filter(c => dayjs(c.expiryDate).isAfter(now)).length;
  const totalCoupons = data.length;
  
  
  // Tính tỷ lệ coupon đang hoạt động
  const activeRate = totalCoupons > 0 ? (activeCoupons / totalCoupons) * 100 : 0;
  
  // Phân loại coupon theo loại giảm giá
  const freeCoupons = data.filter(c => c.discountValue == 0).length;

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
        title="Free Coupons"
        value={`${freeCoupons}`}
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