// src/components/BookingModal/BookingModal.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Modal, Button, Divider, message, Tag } from 'antd'; // Added message, Tag
import { CloseCircleFilled } from '@ant-design/icons';
import { getAgeLimitColor, getEndTime, formatPrice } from '../../utils/dateUtils'; // Import helpers
import PaymentModal from '../common/PaymentModal'; // <-- 1. Import PaymentModal (Adjust path if needed)
import TheaterLayoutView from '../ProviderManagement/Layout/TheaterLayoutView';
import TheaterLayoutViewSelection from './TheaterLayoutViewSelection';

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
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [currentBookingDetails, setCurrentBookingDetails] = useState(null);
  const [screenData, setScreenData] = useState(null);
  console.log(showtime)
  useEffect(() => {
    if (visible && showtime) {
      setSelectedSeats([]);
      setCurrentBookingDetails(null);
      setPaymentModalVisible(false);

      setScreenData({
        screenCode: showtime.room,
        cinemaCode: showtime.cinema
      });
    }
  }, [visible, showtime]);

  // --- Guards and Safe Data Access ---
  if (!visible || !showtime) return null;

  const {
    seats = {},
    movieTitle = 'N/A',
    time = 'N/A',
    room = 'N/A',
    ageLimit = 'N/A',
    duration = 0,
    date = '',
    cinemaId = null,
    id: showtimeId = null
  } = showtime;

  const handleSeatClick = (seatId) => {
    if (seats.bookedSeats?.includes(seatId)) return;

    setSelectedSeats(prev => {
      const isSelected = prev.includes(seatId);
      if (isSelected) {
        return prev.filter(s => s !== seatId);
      } else {
        if (prev.length >= 8) {
          message.warning('You can only select up to 8 seats.');
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const totalPrice = selectedSeats.reduce((total, seat) => {
    console.log(seat, 12312)
    return total + (showtime.price * seat.multipler);
  }, 0);

  // Format date for display
  const displayDate = React.useMemo(() => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch(e) {
      console.error("Error parsing date:", date, e);
      return 'Invalid Date';
    }
  }, [date]);

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      message.warning('Please select at least one seat.');
      return;
    }
    const details = {
      showtimeId,
      movieTitle,
      cinemaId,
      room,
      date,
      time,
      seats: [selectedSeats.map(seat => seat.seatCode)],
      totalPrice,
      duration,
      ageLimit
    };
    setCurrentBookingDetails(details);
    setPaymentModalVisible(true);
  };

  const handleFinalBookingSuccess = (paidBookingDetails) => {
    console.log('Payment successful, booking confirmed for:', paidBookingDetails);
    message.success('Booking and payment successful!');
    setPaymentModalVisible(false);
    onClose();
  };

  return (
    <>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width='auto'
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        bodyStyle={{ padding: '15px', overflowY: 'auto' }}
        centered
      >
        <div className='gap-4 p-4 bg-gray-900 text-white rounded-xl w-full flex flex-col justify-center items-center mb-4'>
          {screenData && (
            <TheaterLayoutViewSelection
              screen={screenData}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              maxSeats={8}
              showLegend={true}
            />
          )}
        </div>

        {/* Booking Summary Area */}
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

          {/* Selected Seats */}
          <div className='flex w-full items-start mb-2 min-h-[30px]'>
            <span className='text-gray-500 text-sm flex-shrink-0 mr-2 pt-0.5'>Selected:</span>
            <div className='flex gap-1 flex-wrap justify-start flex-grow'>
              {selectedSeats.length === 0 && (
                <span className="text-gray-400 text-sm italic pt-0.5">No seats selected</span>
              )}
              {selectedSeats.map(seat => (
                <Tag
                  key={seat.seatCode}
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    handleSeatClick(seat);
                  }}
                  color="red"
                  style={{ marginRight: 3, marginBottom: 3 }}
                >
                  {seat.seatCode}
                </Tag>
              ))}
            </div>
          </div>
          <Divider className="my-2" />

          {/* Total Price & Book Button */}
          <div className='flex w-full justify-between items-center'>
            <div className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Total:</span>
              <span className='font-bold text-xl sm:text-2xl text-red-600'>
                {formatPrice(totalPrice)} đ
              </span>
            </div>
            <Button
              type='primary'
              danger
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToPayment}
              className='!bg-red-600 hover:!bg-red-700 !border-red-600 hover:!border-red-700'
              style={{
                padding: '10px 20px',
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

      {/* Payment Modal */}
      {currentBookingDetails && (
        <PaymentModal
          visible={paymentModalVisible}
          onClose={() => setPaymentModalVisible(false)}
          bookingDetails={currentBookingDetails}
          onPaymentSuccess={handleFinalBookingSuccess}
        />
      )}
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