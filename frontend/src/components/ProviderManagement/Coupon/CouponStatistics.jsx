import React, { useMemo } from 'react';
import { Card } from 'antd';
import { 
  GiftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import CardStatistics from '../../ui/Card/CardStatistics';
import dayjs from 'dayjs';

const CouponStatistics = ({ data = [] }) => {
  // Sử dụng useMemo để tối ưu tính toán
  const stats = useMemo(() => {
    const totalCoupons = data.length;
    
    // Xác định trạng thái dựa trên ngày hết hạn và discountValue
    const now = dayjs();
    const activeCoupons = data.filter(coupon => 
      coupon.expiryDate && 
      dayjs(coupon.expiryDate).isAfter(now) && 
      dayjs(coupon.startDate).isBefore(now)
    ).length;
    const expiredCoupons = data.filter(coupon => 
      coupon.expiryDate && 
      dayjs(coupon.expiryDate).isBefore(now)
    ).length;
    const inactiveCoupons = data.filter(coupon => 
      !coupon.expiryDate || 
      dayjs(coupon.startDate).isAfter(now)
    ).length;

    // Tính tỷ lệ coupon đang hoạt động
    const activeRate = totalCoupons > 0 ? (activeCoupons / totalCoupons) * 100 : 0;

    // Phân loại coupon theo loại giảm giá
    const percentCoupons = data.filter(coupon => 
      coupon.discountValue > 0 && coupon.discountValue <= 100
    ).length;
    const fixedCoupons = data.filter(coupon => 
      coupon.discountValue === 0
    ).length;

    // Tổng giá trị giảm giá tiềm năng
    const totalDiscountPotential = data.reduce((sum, coupon) => {
      return sum + (coupon.discountValue || 0);
    }, 0);

    return {
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      inactiveCoupons,
      activeRate,
      percentCoupons,
      fixedCoupons,
      totalDiscountPotential
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Coupons"
        value={stats.totalCoupons}
        icon={<GiftOutlined />}
        color="#1890ff"
        suffix={<span className="text-xs text-gray-500">coupons</span>}
      />
      
      <CardStatistics
        title="Active Coupons"
        value={stats.activeCoupons}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
        suffix={
          stats.totalCoupons > 0 && (
            <span className="text-xs text-gray-500">
              ({Math.round(stats.activeRate)}%)
            </span>
          )
        }
      />
      
      <CardStatistics
        title="Discount Types"
        value={`${stats.percentCoupons} % / ${stats.fixedCoupons} free`}
        icon={<DollarOutlined />}
        color="#722ed1"
        suffix={
          <span className="text-xs text-gray-500">
            ({stats.percentCoupons + stats.fixedCoupons} total)
          </span>
        }
      />
      
      <CardStatistics
        title="Active Rate"
        value={`${Math.round(stats.activeRate)}%`}
        icon={<ClockCircleOutlined />}
        color="#faad14"
        showProgress
        progressValue={Math.round(stats.activeRate)}
        progressColor={
          stats.activeRate > 70 ? "#52c41a" : 
          stats.activeRate > 30 ? "#faad14" : "#ff4d4f"
        }
        suffix={
          <span className="text-xs text-gray-500">
            ({stats.activeCoupons}/{stats.totalCoupons})
          </span>
        }
      />
    </div>
  );
};

export default CouponStatistics;