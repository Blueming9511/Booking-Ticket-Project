// src/components/TicketTable.jsx
import React, { useState } from 'react'; // <-- Import useState
import PropTypes from 'prop-types'; // <-- Import PropTypes
import { Table, Tag, Button, message } from 'antd'; // <-- Import message
import CancelTicketModal from './CancelTicketModal'; // <-- 1. Import the modal component (adjust path)

const TicketTable = ({ data, onCancelTicket }) => {
  // --- 2. Add State for Modal ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null); // Store details of the ticket for the modal
  // -----------------------------

  // --- 3. Handler to Show Modal ---
  const showCancelModal = (ticketRecord) => {
    console.log("Requesting cancel for:", ticketRecord);
    setTicketToCancel(ticketRecord); // Store the specific ticket's data
    setIsModalVisible(true);        // Show the modal
  };
  // -------------------------------

  // --- 4. Handler to Close Modal ---
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTicketToCancel(null); // Clear the ticket data when modal closes
  };
  // --------------------------------

  // --- 5. Handler after Confirmation ---
  // This function is passed to the modal and called by it upon successful cancellation simulation
  const handleConfirmCancellation = (ticketKey) => {
     console.log("Modal confirmed cancellation for key:", ticketKey);
     // Now call the original prop function passed from the parent component
     // This function should handle the actual state update (e.g., removing/updating the ticket in the parent's list)
     onCancelTicket(ticketKey);
     // The modal closes itself, but we ensure state is clean here too
     handleCloseModal();
  };
  // ------------------------------------

  const columns = [
    { title: 'Movie', dataIndex: 'movie', key: 'movie', sorter: (a, b) => a.movie.localeCompare(b.movie), sortDirections: ['ascend', 'descend'] },
    { title: 'Date', dataIndex: 'date', key: 'date', sorter: (a, b) => new Date(a.date) - new Date(b.date), sortDirections: ['ascend', 'descend'], defaultSortOrder: 'ascend' },
    { title: 'Time', dataIndex: 'time', key: 'time', sorter: (a, b) => a.time.localeCompare(b.time), sortDirections: ['ascend', 'descend'] },
    { title: 'Seats', dataIndex: 'seats', key: 'seats', render: seats => (<>{seats.map(seat => (<Tag color="blue" key={seat}>{seat}</Tag>))}</>), sorter: (a, b) => a.seats.length - b.seats.length, sortDirections: ['ascend', 'descend'] },
    { title: 'Price', dataIndex: 'price', key: 'price', sorter: (a, b) => parseFloat(a.price.replace(/[$,]/g, '')) - parseFloat(b.price.replace(/[$,]/g, '')), sortDirections: ['ascend', 'descend'] }, // Improved price parsing
    { title: 'Status', dataIndex: 'status', key: 'status', render: status => { let color = status === 'Completed' ? 'green' : status === 'Cancelled' ? 'volcano' : 'orange'; return (<Tag color={color} key={status}>{status.toUpperCase()}</Tag>); }, sorter: (a, b) => a.status.localeCompare(b.status), sortDirections: ['ascend', 'descend'] }, // Use 'volcano' for better red contrast
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        // Only show Cancel button for 'Upcoming' tickets
        record.status === 'Upcoming' ? (
          <Button
            type="link"
            danger
            // --- 6. Update onClick to show the modal ---
            onClick={() => showCancelModal(record)} // Pass the whole record
          >
            Cancel
          </Button>
        ) : null // No action for other statuses
    }
  ];

  return (
    <> {/* Use Fragment to render Table and Modal */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }} // Enhanced pagination
        showSorterTooltip={true} // Keep sorter tooltip
        rowKey="key" // Ensure rowKey is set if 'key' is the unique identifier
        scroll={{ x: 'max-content' }} // Add horizontal scroll if needed
      />

      {/* --- 7. Render the Modal Conditionally --- */}
      {ticketToCancel && ( // Only render modal if there's a ticket selected for cancellation
        <CancelTicketModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          ticketDetails={ticketToCancel} // Pass the stored ticket details
          onConfirmCancel={handleConfirmCancellation} // Pass the confirmation handler
        />
      )}
    </>
  );
};

// --- 8. Add PropTypes for TicketTable ---
TicketTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        movie: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        seats: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.string,
        status: PropTypes.oneOf(['Upcoming', 'Completed', 'Cancelled']),
    })).isRequired,
    onCancelTicket: PropTypes.func.isRequired, // Function expected from parent
};
// --- End PropTypes ---

export default TicketTable;