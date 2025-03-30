import React, { useState } from 'react';
import { Modal, Button } from 'antd';

// Function to generate grid labels for Standard & VIP seats
const generateSeatGrid = (totalSeats, columns, startRow = 0) => {
  const seatGrid = [];
  let rowIndex = startRow;
  for (let i = 0; i < totalSeats; i++) {
    const rowLabel = String.fromCharCode(65 + rowIndex); // A, B, C, etc.
    const seatLabel = `${rowLabel}${(i % columns) + 1}`;
    seatGrid.push(seatLabel);
    if ((i + 1) % columns === 0) rowIndex++; // Move to next row after 'columns' seats
  }
  return seatGrid;
};

// Function to generate couple seat labels like CP01, CP02, etc.
const generateCoupleSeatGrid = (totalSeats) => {
  const seatGrid = [];
  for (let i = 0; i < totalSeats; i++) {
    const seatLabel = `CP${(i + 1).toString().padStart(2, '0')}`;
    seatGrid.push(seatLabel);
  }
  return seatGrid;
};

const BookingModal = ({ visible, onClose, showtime }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  if (!showtime) return null;

  const { seats } = showtime;
  const bookedSeats = seats.bookedSeats || [];

  // Determine the number of columns for Standard & VIP: if total > 100, use 20 columns; otherwise, 10.
  const totalStandardVIP = seats.types.Standard.available + seats.types.VIP.available;
  const gridColumns = totalStandardVIP > 100 ? 20 : 10;

  // Generate seat labels for Standard & VIP seats using dynamic column count
  const seatGrid = generateSeatGrid(totalStandardVIP, gridColumns);

  // Generate couple seats with labels like CP01, CP02, ...
  const coupleSeatGrid = generateCoupleSeatGrid(seats.types.Couple.available);

  // Determine seat type based on its position (for Standard & VIP only)
  const getSeatType = (seatId, isCouple) => {
    if (isCouple) return 'Couple';
    const index = seatGrid.indexOf(seatId);
    return index >= seats.types.Standard.available ? 'VIP' : 'Standard';
  };

  // Handle seat selection: ignore clicks on booked seats.
  const handleSeatSelection = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  // Calculate total price based on seat type.
  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const isCouple = coupleSeatGrid.includes(seatId);
    const isVIP = seatGrid.indexOf(seatId) >= seats.types.Standard.available;
    const seatType = isCouple ? 'Couple' : isVIP ? 'VIP' : 'Standard';
    return total + seats.types[seatType].price;
  }, 0);

  // Render a seat element with appropriate styling.
  const renderSeat = (seatId, isCouple = false) => {
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);
    const seatType = getSeatType(seatId, isCouple);

    // Define color schemes for each type.
    let availableClass = '';
    let selectedClass = '';
    if (seatType === 'Standard') {
      availableClass = 'bg-green-200 text-black';
      selectedClass = 'bg-green-500 text-white';
    } else if (seatType === 'VIP') {
      availableClass = 'bg-purple-200 text-black ';
      selectedClass = 'bg-purple-500 text-white';
    } else if (seatType === 'Couple') {
      availableClass = 'bg-orange-200 text-black w-full';
      selectedClass = 'bg-orange-500 text-white w-full';
    }

    const finalClass = isBooked
      ? 'bg-gray-400 text-white cursor-not-allowed w-full'
      : isSelected
      ? selectedClass
      : availableClass;

    return (
      <div
        key={seatId}
        onClick={() => handleSeatSelection(seatId)}
        className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer text-sm font-bold border ${finalClass}`}
      >
        {seatId}
      </div>
    );
  };

  return (
    <Modal title="Select Your Seats" open={visible} onCancel={onClose} footer={null}>
      <div className="space-y-6">
        {/* Standard & VIP Section */}
        <div>
          <h4 className="font-semibold mb-2">
            Standard & VIP (₫ Standard: {seats.types.Standard.price}, VIP: {seats.types.VIP.price})
          </h4>
          <div
            className="gap-2"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridColumns}, 2.5rem)`
            }}
          >
            {seatGrid.map((seat) => renderSeat(seat))}
          </div>
        </div>

        {/* Couple Seats Section */}
        <div>
          <h4 className="font-semibold mb-2">Couple (₫{seats.types.Couple.price})</h4>
          <div className="flex gap-2">
            {coupleSeatGrid.map((seat) => renderSeat(seat, true))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className="font-bold text-lg">Total: ₫{totalPrice}</span>
        <Button
          type="primary"
          disabled={!selectedSeats.length}
          onClick={() => {
            console.log('Booked seats:', selectedSeats);
            onClose();
          }}
        >
          Confirm Booking
        </Button>
      </div>
    </Modal>
  );
};

export default BookingModal;
