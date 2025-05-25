// src/components/BookingModal/BookingModal.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Modal, Button, Divider, message, Tag } from 'antd'; // Added message, Tag
import { CloseCircleFilled } from '@ant-design/icons';
import { getAgeLimitColor, getEndTime, formatPrice } from '../../utils/dateUtils'; // Import helpers
import PaymentModal from '../common/PaymentModal'; // <-- 1. Import PaymentModal (Adjust path if needed)

// --- Helper Functions (Moved outside component for better practice) ---
const generateSeatGrid = (totalSeats, columns, startRow = 0) => {
  const seatGrid = [];
  let rowIndex = startRow;
  if (totalSeats <= 0 || columns <= 0) return []; // Guard
  for (let i = 0; i < totalSeats; i++) {
    const rowLabel = String.fromCharCode(65 + rowIndex);
    const seatLabel = `${rowLabel}${(i % columns) + 1}`;
    seatGrid.push(seatLabel);
    if ((i + 1) % columns === 0) rowIndex++;
  }
  return seatGrid;
};

const generateCoupleSeatGrid = totalSeats => {
  if (!totalSeats || totalSeats <= 0) return [];
  return Array.from(
    { length: totalSeats },
    (_, i) => `CP${(i + 1).toString().padStart(2, '0')}`
  );
};
// --- End Helper Functions ---


const BookingModal = ({ visible, onClose, showtime }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  // --- 2. Add state for Payment Modal ---
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [currentBookingDetails, setCurrentBookingDetails] = useState(null);
  // ------------------------------------

  useEffect(() => {
    // Reset state when modal becomes visible to ensure clean state
    // and when the underlying showtime data changes
    if (visible) {
        setSelectedSeats([]);
        setCurrentBookingDetails(null);
        setPaymentModalVisible(false);
    }
  }, [visible, showtime]); // Depend on visibility and showtime change

  // --- Guards and Safe Data Access ---
  if (!visible || !showtime) return null; // Guard if not visible or no showtime

  // Safely destructure showtime, providing defaults
  const {
    seats = {}, // Default seats to {}
    movieTitle = 'N/A',
    time = 'N/A',
    room = 'N/A',
    ageLimit = 'N/A',
    duration = 0,
    date = '',
    cinemaId = null, // Expect cinemaId or similar identifier
    id: showtimeId = null // Expect showtimeId
  } = showtime;

  const bookedSeats = seats.bookedSeats || [];
  const standardSeatsData = seats.types?.Standard || { available: 0, price: 0 };
  const vipSeatsData = seats.types?.VIP || { available: 0, price: 0 };
  const coupleSeatsData = seats.types?.Couple || { available: 0, price: 0 };

  const totalStandardVIP = (standardSeatsData.available || 0) + (vipSeatsData.available || 0);
  const gridColumns = totalStandardVIP > 100 ? 20 : (totalStandardVIP > 0 ? 10 : 1);

  const seatGrid = generateSeatGrid(totalStandardVIP, gridColumns);
  const coupleSeatGrid = generateCoupleSeatGrid(coupleSeatsData.available || 0);
  // --- End Data Prep ---

  // --- Component Internal Functions ---
  const getSeatType = (seatId, isCouple) => {
    if (isCouple) return 'Couple';
    const standardCount = standardSeatsData.available || 0;
    // Simple check based on position relative to standard count
    return seatGrid.indexOf(seatId) >= standardCount ? 'VIP' : 'Standard';
  };

  const handleSeatSelection = seatId => {
    if (bookedSeats.includes(seatId)) return; // Don't select booked seats
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const removeSeat = seatId => {
    setSelectedSeats(prev => prev.filter(s => s !== seatId));
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const isCouple = coupleSeatGrid.includes(seatId);
    const seatType = getSeatType(seatId, isCouple);
    const price = seats.types?.[seatType]?.price || 0; // Safe access price
    return total + price;
  }, 0);

  // --- Render Seat ---
  const renderSeat = (seatId, isCouple = false) => {
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);
    const seatType = getSeatType(seatId, isCouple);

    // Using the exact style structure from the original code
     const seatColors = {
       Standard: { available: 'bg-purple-600 hover:bg-purple-700', selected: 'bg-blue-900 border-2 border-white text-white' },
       VIP: { available: 'bg-red-600 hover:bg-red-700', selected: 'bg-blue-900 border-2 border-white text-white' },
       Couple: { available: 'bg-pink-600 hover:bg-pink-700', selected: 'bg-blue-900 border-2 border-white text-white' } // Removed col-span, adjust width below if needed
     };

    const colors = seatColors[seatType] || seatColors.Standard;

    const baseClasses = 'h-10 text-white flex items-center justify-center rounded cursor-pointer text-xs sm:text-sm font-bold transition-colors';
    // Adjust width based on whether it's a couple seat (maintain original logic)
    const widthClass = isCouple ? 'w-20' : 'w-10';
    const stateClasses = isBooked
      ? 'bg-gray-500 text-gray-300 cursor-not-allowed' // Use gray-500 for booked
      : isSelected
      ? colors.selected
      : colors.available;

    // Combine classes carefully with spaces
    const finalClassName = `${baseClasses} ${widthClass} ${stateClasses}`;

    return (
      <div
        key={seatId}
        onClick={() => !isBooked && handleSeatSelection(seatId)} // Prevent clicking booked seats
        className={finalClassName}
        aria-disabled={isBooked}
        role="checkbox"
        aria-checked={isSelected}
      >
        {seatId}
      </div>
    );
  };
  // --- End Render Seat ---

  // Format date for display
  const displayDate = React.useMemo(() => {
    if (!date) return 'N/A'; // Handle missing date
    try {
        const d = new Date(date + 'T00:00:00'); // Ensure consistent time for date part
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch(e) {
        console.error("Error parsing date:", date, e);
        return 'Invalid Date';
    }
  }, [date]);

  // --- 3. Handler to Open Payment Modal ---
  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      message.warning('Please select at least one seat.');
      return;
    }
    const details = {
      showtimeId,
      movieTitle,
      cinemaId, // Pass necessary IDs (make sure they exist in 'showtime')
      room,
      date,
      time,
      seats: selectedSeats,
      totalPrice,
      duration,
      ageLimit
      // Add other necessary details...
    };
    setCurrentBookingDetails(details); // Set details for payment modal
    setPaymentModalVisible(true);   // Open payment modal
  };
  // -------------------------------------

  // --- 4. Handler for Payment Success ---
  const handleFinalBookingSuccess = (paidBookingDetails) => {
    console.log('Payment successful, booking confirmed for:', paidBookingDetails);
    message.success('Booking and payment successful!'); // Give user feedback
    setPaymentModalVisible(false); // Close payment modal
    onClose(); // Close the booking modal
    // Optionally: Trigger data refresh or navigate to a success page
    // navigate('/booking-success');
  };
  // ------------------------------------

  return (
    <> {/* Use Fragment to hold both modals */}
      <Modal
        // title='Select Your Seats' // Removed title for cleaner look maybe?
        open={visible}
        onCancel={onClose}
        footer={null} // Custom footer area below
        width='auto' // Adapts to content
        // Style remains the same as original example
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        bodyStyle={{ padding: '15px', overflowY: 'auto' }}
        centered
      >
        {/* Seat Selection Area - Structure remains the same */}
        <div className='gap-4 p-4 bg-gray-900 text-white rounded-xl w-full flex flex-col justify-center items-center mb-4'>
          {/* Screen */}
          <div className='screen flex flex-col justify-center items-center w-full mb-4'>
            <div className='w-3/4 h-2 bg-white rounded-t-lg shadow-lg shadow-white/30'></div>
            <span className='text-white text-sm tracking-widest'>SCREEN</span>
          </div>

          {/* Standard & VIP Seats */}
          {seatGrid.length > 0 && (
            <div
              className='gap-2 justify-center'
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridColumns}, minmax(2.2rem, 1fr))`
              }}
            >
              {seatGrid.map(seat => renderSeat(seat, false))}
            </div>
          )}

          {/* Couple Seats Section */}
          {coupleSeatGrid.length > 0 && (
             <div className='w-full flex justify-center items-center mt-4'>
               <div className='flex gap-3 flex-wrap justify-center'>
                 {coupleSeatGrid.map(seat => renderSeat(seat, true))}
               </div>
             </div>
           )}

          {/* Legend - Structure remains the same */}
          <div className='w-full px-1 sm:px-3 flex flex-wrap gap-x-3 gap-y-1 justify-center mt-4 text-xs sm:text-sm'>
            <div className='flex gap-1 items-center'><div className='w-4 h-4 rounded bg-gray-500'></div><span>Booked</span></div>
            {standardSeatsData.available > 0 && <div className='flex gap-1 items-center'><div className='w-4 h-4 rounded bg-purple-600'></div><span>Standard</span></div>}
            {vipSeatsData.available > 0 && <div className='flex gap-1 items-center'><div className='w-4 h-4 rounded bg-red-600'></div><span>VIP</span></div>}
            {coupleSeatsData.available > 0 && <div className='flex gap-1 items-center'><div className='w-4 h-4 rounded bg-pink-600'></div><span>Couple</span></div>}
            <div className='flex gap-1 items-center'><div className='w-4 h-4 rounded bg-blue-900 border border-white'></div><span>Selected</span></div>
          </div>
        </div>

        {/* Booking Summary Area - Structure remains the same */}
        <div className='mt-4 flex flex-col'>
          {/* Movie Info */}
          <div className='flex flex-col sm:flex-row w-full justify-between items-start sm:items-center mb-2'>
            <div className='flex gap-2 items-center mb-1 sm:mb-0'>
              <span className={`px-2 py-0.5 text-xs rounded text-white ${getAgeLimitColor(ageLimit)}`}>
                {ageLimit}
              </span>
              <span className='font-bold text-base sm:text-lg'>{movieTitle}</span>
            </div>
            <span className='info flex flex-wrap gap-x-2 text-xs sm:text-sm text-gray-600'>
              <span>{time} ~ {getEndTime(time, duration)}</span>
              <span>·</span>
              <span>{displayDate}</span>
              <span>·</span>
              <span>{room}</span>
            </span>
          </div>
          <Divider className="my-2" />

          {/* Selected Seats - Using Ant Design Tag for consistency */}
           <div className='flex w-full items-start mb-2 min-h-[30px]'>
             <span className='text-gray-500 text-sm flex-shrink-0 mr-2 pt-0.5'>Selected:</span>
             <div className='flex gap-1 flex-wrap justify-end flex-grow'> {/* Changed justify-end to justify-start */}
               {selectedSeats.length === 0 && <span className="text-gray-400 text-sm italic pt-0.5">No seats selected</span>}
               {selectedSeats.map(seat => (
                 <Tag
                     key={seat}
                     closable
                     onClose={(e) => { e.preventDefault(); removeSeat(seat); }}
                     color="red" // Or customize color
                     style={{ marginRight: 3, marginBottom: 3 }} // Add spacing
                 >
                   {seat}
                 </Tag>
               ))}
             </div>
           </div>
          <Divider className="my-2" />

          {/* Total Price & Book Button */}
          <div className='flex w-full justify-between items-center'>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Total:</span>
              {/* Apply red color directly if 'text-primary' doesn't work or is not defined */}
              <span className='font-bold text-xl sm:text-2xl text-red-600'>
                {formatPrice(totalPrice)} đ
              </span>
            </div>
            <Button
              type='primary'
              danger // Use AntD red theme
              disabled={selectedSeats.length === 0}
              // --- 5. Update onClick to trigger payment flow ---
              onClick={handleProceedToPayment}
              // -------------------------------------------------
              // Apply explicit red styling for consistency
              className='!bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700'
              style={{
                padding: '10px 20px', // Maintain original style
                height: 'auto',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Book Ticket{selectedSeats.length > 0 ? ` (${selectedSeats.length})` : ''}
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- 6. Render PaymentModal Conditionally --- */}
      {currentBookingDetails && (
        <PaymentModal
          visible={paymentModalVisible}
          onClose={() => setPaymentModalVisible(false)} // Allow closing payment modal independently
          bookingDetails={currentBookingDetails}
          onPaymentSuccess={handleFinalBookingSuccess} // Pass success handler
        />
      )}
      {/* ----------------------------------------- */}
    </>
  );
};

// --- PropTypes ---
BookingModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showtime: PropTypes.shape({
    id: PropTypes.any,
    movieTitle: PropTypes.string,
    time: PropTypes.string,
    room: PropTypes.string,
    ageLimit: PropTypes.string,
    duration: PropTypes.number,
    date: PropTypes.string,
    cinemaId: PropTypes.any,
    seats: PropTypes.shape({
      bookedSeats: PropTypes.arrayOf(PropTypes.string),
      types: PropTypes.shape({
        Standard: PropTypes.shape({ available: PropTypes.number, price: PropTypes.number }),
        VIP: PropTypes.shape({ available: PropTypes.number, price: PropTypes.number }),
        Couple: PropTypes.shape({ available: PropTypes.number, price: PropTypes.number }),
      })
    })
  })
};
// --- End PropTypes ---

export default BookingModal;