import React, { useState, useEffect } from 'react';
import { Button, message, Spin, Tooltip } from 'antd';
import axios from 'axios';
import './SeatSelection.css';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  withCredentials: true
});

const SEAT_TYPES = {
  STANDARD: { label: "Standard", color: "bg-gray-200" },
  VIP: { label: "VIP", color: "bg-yellow-300" },
  COUPLE: { label: "Couple", color: "bg-purple-300" },
  DISABLED: { label: "Disable", color: "bg-gray-400" },
};

const SeatStatus = {
  BOOKED: 'BOOKED',
  AVAILABLE: 'AVAILABLE',
  MAINTENANCE: 'MAINTENANCE',
  SELECTED: 'SELECTED' // Frontend-only status
};

const SeatSelection = ({ 
  screenCode, 
  cinemaCode, 
  showtimeId, 
  onSeatSelect, 
  maxSeats = 8,
  basePrice = 0 
}) => {
  const [seatMap, setSeatMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fetch seats from the backend
  const fetchSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/seats/v2/', {
        params: {
          cinema: cinemaCode,
          screen: screenCode
        }
      });

      // Group seats by row
      const groupedSeats = response.data.reduce((acc, seat) => {
        if (!acc[seat.row]) {
          acc[seat.row] = [];
        }
        acc[seat.row].push({
          ...seat,
          id: seat.seatCode,
          status: seat.status || SeatStatus.AVAILABLE
        });
        return acc;
      }, {});

      // Sort seats within each row by number
      Object.keys(groupedSeats).forEach(row => {
        groupedSeats[row].sort((a, b) => parseInt(a.number) - parseInt(b.number));
      });

      setSeatMap(groupedSeats);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setError('Failed to load seats. Please try again.');
      message.error('Failed to load seats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (screenCode && cinemaCode) {
      fetchSeats();
    }
  }, [screenCode, cinemaCode]);

  const handleSeatClick = (seat) => {
    if (seat.status === SeatStatus.BOOKED || seat.status === SeatStatus.MAINTENANCE) {
      return;
    }

    setSelectedSeats(prevSelected => {
      const isSelected = prevSelected.some(s => s.id === seat.id);
      
      if (isSelected) {
        // Deselect the seat
        const newSelected = prevSelected.filter(s => s.id !== seat.id);
        onSeatSelect(newSelected);
        return newSelected;
      } else {
        // Select the seat if under max limit
        if (prevSelected.length >= maxSeats) {
          message.warning(`You can only select up to ${maxSeats} seats.`);
          return prevSelected;
        }
        const newSelected = [...prevSelected, seat];
        onSeatSelect(newSelected);
        return newSelected;
      }
    });
  };

  const getSeatClassName = (seat) => {
    const baseClass = 'seat';
    const typeClass = seat.type.toLowerCase();
    let statusClass = seat.status.toLowerCase();

    if (selectedSeats.some(s => s.id === seat.id)) {
      statusClass = 'selected';
    }

    const seatSpan = seat.type === 'COUPLE' ? 'couple' : '';
    return `${baseClass} ${typeClass} ${statusClass} ${seatSpan}`;
  };

  const getSeatTooltip = (seat) => {
    const price = basePrice * (seat.multiplier || 1);
    const status = selectedSeats.some(s => s.id === seat.id) ? 'Selected' : seat.status;
    return (
      <div>
        <p>Seat: {seat.row}{seat.number}</p>
        <p>Type: {seat.type}</p>
        <p>Price: {price.toLocaleString()} VND</p>
        <p>Status: {status}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="seat-loading">
        <Spin size="large" />
        <p>Loading seats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seat-error">
        <p>{error}</p>
        <Button type="primary" onClick={fetchSeats}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="seat-selection">
      {/* Screen */}
      <div className="screen">
        <div className="screen-bar"></div>
        <div className="screen-text">SCREEN</div>
      </div>
      
      {/* Seat Map */}
      <div className="seat-map">
        {Object.entries(seatMap)
          .sort(([rowA], [rowB]) => rowA.localeCompare(rowB))
          .map(([row, seats]) => (
            <div key={row} className="seat-row">
              <div className="row-label">{row}</div>
              <div className="seats">
                {seats.map(seat => (
                  <Tooltip key={seat.id} title={getSeatTooltip(seat)} placement="top">
                    <div
                      className={getSeatClassName(seat)}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.number}
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-example standard available"></div>
          <span>Standard</span>
        </div>
        <div className="legend-item">
          <div className="seat-example vip available"></div>
          <span>VIP</span>
        </div>
        <div className="legend-item">
          <div className="seat-example couple available"></div>
          <span>Couple</span>
        </div>
        <div className="legend-item">
          <div className="seat-example booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat-example selected"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection; 