// src/components/ShowtimeButtons/ShowtimeButtons.js
import React from 'react';
import { Button } from 'antd';
import { getEndTime } from '../utils/dateUtils'; // Import helper

const ShowtimeButtons = ({ movie, selectedCinema, selectedDate, handleShowtimeClick }) => {

  const relevantShowtimes = movie.showtimes?.filter(
    showtime =>
      String(showtime.cinema) === String(selectedCinema) &&
      showtime.date === selectedDate
  ) || []; // Filter by both cinema and date

  if (relevantShowtimes.length === 0) {
    return <p className="text-sm text-gray-500 mt-2">No showtimes available for this date.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {relevantShowtimes.map((showtime, index) => (
        <Button
          key={`${showtime.time}-${index}`} // Add index for safety if times could repeat (unlikely)
          className="border-primary text-primary hover:bg-primary hover:text-white font-semibold"
          onClick={() => handleShowtimeClick(showtime, movie.title, movie.ageLimit, movie.duration)}
        >
          {showtime.time}
           <span className="text-xs text-gray-400 ml-1">
             ~ {getEndTime(showtime.time, movie.duration)}
           </span>
        </Button>
      ))}
    </div>
  );
};

export default ShowtimeButtons;