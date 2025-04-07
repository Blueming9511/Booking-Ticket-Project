// src/components/CancelTicketModal/CancelTicketModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Typography, Spin, message, Descriptions, Tag } from 'antd';
import { WarningFilled } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const CancelTicketModal = ({ visible, onClose, ticketDetails, onConfirmCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!ticketDetails || !ticketDetails.key) return; // Should not happen if used correctly

    setLoading(true);
    console.log("Attempting to cancel ticket:", ticketDetails.key);

    try {
      // --- Simulate API call to cancel the ticket ---
      // In a real app: await api.cancelTicket(ticketDetails.key);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      console.log("Ticket cancellation simulation successful for key:", ticketDetails.key);
      message.success(`Ticket for ${ticketDetails.movie} cancelled successfully.`);
      // -----------------------------------------------

      onConfirmCancel(ticketDetails.key); // Notify parent component to update state/UI
      onClose(); // Close the modal

    } catch (error) {
      console.error("Failed to cancel ticket:", error);
      message.error('Failed to cancel the ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Basic check for details
  if (!visible || !ticketDetails) {
    return null;
  }

  // Safely access details for display
  const { movie = 'N/A', date = 'N/A', time = 'N/A', seats = [], price = 'N/A' } = ticketDetails;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <WarningFilled className="text-yellow-500 text-xl" />
          <span className="font-semibold text-lg">Confirm Cancellation</span>
        </div>
      }
      open={visible}
      onCancel={onClose} // Allow closing via X icon or mask click
      centered
      width={450} // Moderate width
      footer={[
        <Button key="back" onClick={onClose} disabled={loading}>
          Keep Ticket
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger // Use Ant Design's danger style for destructive action
          loading={loading}
          onClick={handleConfirm}
        >
          {loading ? 'Cancelling...' : 'Yes, Cancel Ticket'}
        </Button>,
      ]}
    >
      <Spin spinning={loading} tip="Processing cancellation...">
        <Paragraph className="mb-4">
          Are you sure you want to cancel the following ticket booking? This action might be irreversible depending on the cancellation policy.
        </Paragraph>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Movie">
            <Text strong>{movie}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Showtime">
            {`${date}, ${time}`}
          </Descriptions.Item>
          <Descriptions.Item label="Seats">
            {seats.length > 0 ? seats.map(seat => <Tag key={seat} color="blue">{seat}</Tag>) : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Original Price">
            {price}
          </Descriptions.Item>
        </Descriptions>
        {/* Optional: Add cancellation policy info here */}
        {/* <Paragraph type="secondary" className="mt-3 text-xs">
          Note: Cancellations are subject to the cinema's policy. Refunds may vary.
        </Paragraph> */}
      </Spin>
    </Modal>
  );
};

CancelTicketModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ticketDetails: PropTypes.shape({ // Expect details of the ticket being cancelled
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID for cancellation
    movie: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    seats: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.string,
    // Add other fields if needed for display
  }),
  onConfirmCancel: PropTypes.func.isRequired, // Function to call after successful cancellation
};

export default CancelTicketModal;