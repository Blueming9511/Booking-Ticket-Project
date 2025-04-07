// src/components/PaymentModal/PaymentModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Import ConfigProvider to apply theme if needed, though explicit styling is used here
import { Modal, Button, Typography, Spin, message, Image, Descriptions, Tag, ConfigProvider } from 'antd';
// Assuming formatPrice is correctly located relative to this file
import { formatPrice } from '../utils/dateUtils'; // Corrected path assumption

// VNPay logo URL (ensure this is accessible)
const vnpayLogoUrl = 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg'; // Using the new URL

const { Title, Text, Paragraph } = Typography;

const PaymentModal = ({ visible, onClose, bookingDetails, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    console.log("Processing VNPay payment for:", bookingDetails);
    try {
      // --- Real VNPay Integration Logic Here ---
      await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate delay
      console.log("Payment Simulation Successful!");
      message.success('Payment successful! Your tickets are booked.');
      onPaymentSuccess(bookingDetails); // Notify parent
      onClose(); // Close modal
    } catch (error) {
      console.error("Payment failed:", error);
      message.error('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingDetails) {
    return null;
  }

  const { movieTitle = 'N/A', seats = [], totalPrice = 0, time = 'N/A', date = 'N/A', room = 'N/A' } = bookingDetails;
  const displayDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'N/A';

  // --- Ant Design Theme Configuration (Red Primary Color for consistency) ---
  // This ensures internal AntD elements (like Spin color, potentially) match if not overridden
  const themeConfig = {
    token: {
      colorPrimary: '#dc2626', // Tailwind red-600
    },
  };

  return (
    // Wrap with ConfigProvider if you want AntD elements inside to inherit the red theme potentially
    <ConfigProvider theme={themeConfig}>
        <Modal
          title={<Title level={4} style={{ margin: 0, color: '#1f2937' /* Dark Gray */ }}>Confirm Payment</Title>}
          open={visible}
          onCancel={onClose}
          width={550}
          centered
          bodyStyle={{ background: '#ffffff' }} // Ensure white body background
          footer={[
            // Cancel Button (Standard AntD style)
            <Button key="back" onClick={onClose} disabled={processing} className="hover:!border-gray-400 hover:!text-gray-700">
              Cancel
            </Button>,
            // Pay Button (Explicit Red & White Theme)
            <Button
              key="submit"
              // type="primary" // Remove if fully overriding
              // danger // Remove if fully overriding
              loading={processing}
              onClick={handlePayment}
              // Explicit Red background, White text
              className="!bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700 !text-white"
            >
              {processing ? 'Processing...' : 'Pay with VNPay'}
            </Button>,
          ]}
        >
          <Spin spinning={processing} tip="Connecting to VNPay...">
            {/* Descriptions with adjusted text colors */}
            <Descriptions bordered column={1} size="small" className="mb-6 [&_.ant-descriptions-item-label]:!bg-gray-50 [&_.ant-descriptions-item-label]:!text-gray-600 [&_.ant-descriptions-item-content]:!text-gray-800">
              <Descriptions.Item label="Movie">{movieTitle}</Descriptions.Item>
              <Descriptions.Item label="Showtime">{`${displayDate}, ${time}`}</Descriptions.Item>
              <Descriptions.Item label="Room">{room}</Descriptions.Item>
              <Descriptions.Item label="Seats">
                {seats.length > 0 ? seats.map(seat => <Tag key={seat} color="red">{seat}</Tag>) : 'N/A'} {/* Red Tags */}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                {/* Explicit Red Color */}
                <Text strong style={{ fontSize: '1.1em', color: '#dc2626' }}>
                  {formatPrice(totalPrice)} đ
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {/* Payment Method Section - Lighter Theme */}
            <Paragraph strong className="!text-gray-700">Payment Method:</Paragraph>
            <div
                // Lighter border, slightly red tint on hover maybe?
                className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-white cursor-default hover:border-red-200 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {/* Adjusted logo size */}
                    <Image src={vnpayLogoUrl} alt="VNPay Logo" width={60} preview={false} />
                    {/* Darker text */}
                    <Text strong className="text-base text-gray-800">Pay via VNPay QR</Text>
                </div>
                {/* Optional checkmark styling could be added */}
            </div>

            {/* Secondary text - slightly darker gray */}
            <Paragraph type="secondary" className="!text-gray-500" style={{ marginTop: '15px', fontSize: '12px' }}>
              You will be redirected to VNPay to complete the payment securely.
            </Paragraph>
          </Spin>
        </Modal>
    </ConfigProvider>
  );
};

// PropTypes remain the same
PaymentModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingDetails: PropTypes.shape({
    movieTitle: PropTypes.string,
    cinema: PropTypes.any,
    room: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    seats: PropTypes.arrayOf(PropTypes.string),
    totalPrice: PropTypes.number,
  }),
  onPaymentSuccess: PropTypes.func.isRequired,
};

export default PaymentModal;