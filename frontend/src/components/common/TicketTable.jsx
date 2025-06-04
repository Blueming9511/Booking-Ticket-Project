// src/components/TicketTable.jsx
import React, { useState } from 'react'; // <-- Import useState
import PropTypes from 'prop-types'; // <-- Import PropTypes
import { Table, Tag, Button, message, Image, Badge, Divider} from 'antd'; // <-- Import message
import { UserOutlined, MailOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import CancelTicketModal from './CancelTicketModal'; // <-- 1. Import the modal component (adjust path)
import dayjs from 'dayjs';
import TagStatus from '../ui/Tag/TagStatus';
const columns = [
  {
    title: "Booking Info",
    dataIndex: "bookingCode",
    key: "bookingCode",
    render: (_, record) => (
      <div className="flex flex-col">
        <div className="font-bold text-lg">{record.bookingCode}</div>
        <div className="text-gray-500 text-sm">
          {dayjs.utc(record.createdAt).format('YYYY-MM-DD HH:mm')}
        </div>
        <div className="mt-2">
          <TagStatus status={record.status} />
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Movie & Showtime",
    key: "movie",
    render: (_, record) => (
      <div className="flex gap-3">
        <Image
          width={60}
          height={120}
          src={record.movie.thumbnail}
          className="rounded-md object-cover"
          preview={false}
        />
        <div className="flex-1">
          <div className="font-bold">{record.movie.title}</div>
          <div className="text-sm text-gray-500 flex flex-wrap gap-1">
            {record.movie.genre.map(g => (
              <Tag key={g} className="text-xs">{g}</Tag>
            ))}
          </div>
          <div className="flex gap-2 items-center mt-1">
            <UserOutlined />
            <span className="font-bold text-xs">Owner: </span> <span>{record.showtime.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-blue-500" />
            <span>
              {dayjs.utc(record.showtime.startTime).format('YYYY-MM-DD HH:mm')}
              {" - "}
              {dayjs.utc(record.showtime.endTime).format('HH:mm')}
            </span>
          </div>
          <div className="text-sm mt-1">
            <span className="font-medium">Screen:</span> {record.showtime.screenCode}
          </div>
        </div>
      </div>
    ),
    width: 300,
  },
  {
    title: "User Info",
    key: "user",
    render: (_, record) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-500" />
          <span className="font-medium">{record?.user?.name}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <MailOutlined className="text-gray-500" />
          <span>{record?.user?.email}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <PhoneOutlined className="text-gray-500" />
          <span>{record?.user?.phoneNumber}</span>
        </div>
      </div>
    ),
    width: 250,
  },
  {
    title: "Seats & Price",
    key: "seats",
    render: (_, record) => (
      <div>
        <div className="font-medium mb-2">Seats:</div>
        <div className="flex flex-wrap gap-2">
          {record.bookingDetails.map(detail => (
            <Badge
              key={detail.seatCode}
              count={detail.seatCode}
              color="blue"
              className="bg-blue-100 text-blue-800 rounded px-2 py-1"
            />
          ))}
        </div>
        <Divider className="my-2" />
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{(record.totalAmount / (1 + record.taxAmount)).toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({record.taxAmount * 100}%):</span>
          <span>{(record.totalAmount - (record.totalAmount / (1 + record.taxAmount))).toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between font-bold mt-1">
          <span>Total:</span>
          <span className="text-green-600">{record.totalAmount.toLocaleString()} VND</span>
        </div>
      </div>
    ),
    width: 250,
  }
];

const TicketTable = ({ data, onCancelTicket, pagination, setPagination, loading }) => {
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

  return (
    <> {/* Use Fragment to render Table and Modal */}
      <Table
        columns={columns}
        dataSource={data}
        showSorterTooltip={true} // Keep sorter tooltip
        rowKey="key" // Ensure rowKey is set if 'key' is the unique identifier
        scroll={{ x: 'max-content' }} // Add horizontal scroll if needed
        pagination={pagination} // Use pagination prop
        onChange={(pagination) => setPagination(pagination)} // Update pagination state on change
        loading={loading} // Show loading state if provided
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