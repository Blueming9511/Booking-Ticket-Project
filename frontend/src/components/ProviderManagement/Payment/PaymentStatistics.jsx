import React, { useMemo } from 'react';
import CardStatistics from "../../ui/Card/CardStatistics";
import { 
  CreditCardOutlined, 
  CheckCircleOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  CloseCircleOutlined 
} from "@ant-design/icons";

const PaymentStatistics = ({ data = [] }) => {
  // Sử dụng useMemo để tối ưu tính toán
  const stats = useMemo(() => {
    const totalPayments = data.length;
    const approvedPayments = data.filter(p => p.status === "APPROVED").length;
    const pendingPayments = data.filter(p => p.status === "PENDING").length;
    const rejectedPayments = data.filter(p => p.status === "REJECTED").length;

    const totalAmount = data.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const approvedAmount = data
      .filter(p => p.status === "APPROVED")
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    const successRate = totalPayments > 0 
      ? Math.round((approvedPayments / totalPayments) * 100) 
      : 0;

    return {
      totalPayments,
      approvedPayments,
      pendingPayments,
      rejectedPayments,
      totalAmount,
      approvedAmount,
      successRate
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Payments"
        value={stats.totalPayments}
        icon={<CreditCardOutlined />}
        color="#1890ff"
        suffix={<span className="text-xs text-gray-500">transactions</span>}
      />
      
      <CardStatistics
        title="Approved Payments"
        value={stats.approvedPayments}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
        suffix={
          stats.totalPayments > 0 && (
            <span className="text-xs text-gray-500">
              ({stats.successRate}%)
            </span>
          )
        }
      />
      
      <CardStatistics
        title="Total Revenue"
        value={new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(stats.approvedAmount)}
        icon={<DollarOutlined />}
        color="#722ed1"
      />
      
      <CardStatistics
        title="Success Rate"
        value={`${stats.successRate}%`}
        icon={<ClockCircleOutlined />}
        color="#faad14"
        showProgress
        progressValue={stats.successRate}
        progressColor={
          stats.successRate > 70 ? "#52c41a" : 
          stats.successRate > 30 ? "#faad14" : "#ff4d4f"
        }
        suffix={
          <span className="text-xs text-gray-500">
            ({stats.approvedPayments}/{stats.totalPayments})
          </span>
        }
      />
    </div>
  );
};

export default PaymentStatistics;