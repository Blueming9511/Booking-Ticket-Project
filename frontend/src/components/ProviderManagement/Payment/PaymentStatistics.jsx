import CardStatistics from "../../ui/Card/CardStatistics";
import { CreditCardOutlined, CheckCircleOutlined, DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";

const PaymentStatistics = ({ data }) => {
  const totalPayments = data.length;
  const completedPayments = data.filter(p => p.status === "APPROVED").length;
  const pendingPayments = data.filter(p => p.status === "PENDING").length;
  const failedPayments = data.filter(p => p.status === "REJECTED").length;
  
  const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = data
    .filter(p => p.status === "APPROVED")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardStatistics
        title="Total Payments"
        value={totalPayments}
        icon={<CreditCardOutlined />}
        color="#1890ff"
      />
      
      <CardStatistics
        title="Completed Payments"
        value={completedPayments}
        icon={<CheckCircleOutlined />}
        color="#52c41a"
      />
      
      <CardStatistics
        title="Total Revenue"
        value={new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        }).format(completedAmount)}
        icon={<DollarOutlined />}
        color="#722ed1"
      />
      
      <CardStatistics
        title="Success Rate"
        value={`${Math.round((completedPayments / totalPayments) * 100)}%`}
        icon={<ClockCircleOutlined />}
        color="#faad14"
        showProgress
        progressValue={Math.round((completedPayments / totalPayments) * 100)}
        progressColor="#52c41a"
      />
    </div>
  );
};

export default PaymentStatistics;