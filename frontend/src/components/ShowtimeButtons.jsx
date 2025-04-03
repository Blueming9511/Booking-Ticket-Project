// src/components/ShowtimeButtons.jsx (adjust path as needed)

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

/**
 * Calculates the end time given a start time (HH:MM) and duration in minutes.
 * Consider moving this to a shared utility file if used elsewhere.
 */
const getEndTime = (startTime, duration) => {
  // Added basic validation
  if (!startTime || typeof duration !== 'number' || !startTime.includes(':')) {
      console.warn("Invalid input for getEndTime:", { startTime, duration });
      return '?';
  }
  try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const endMinutes = minutes + duration;
      let endHours = hours + Math.floor(endMinutes / 60);
      const finalMinutes = endMinutes % 60;
      endHours = endHours % 24; // Handle crossing midnight
      return `${endHours.toString().padStart(2, '0')}:${finalMinutes
          .toString()
          .padStart(2, '0')}`;
  } catch (e) {
      console.error("Error calculating end time:", e, { startTime, duration });
      return '?'; // Return fallback on error
  }
};

/**
 * Renders a list of showtime buttons for a specific movie at a selected cinema.
 */
function ShowtimeButtons({ movie, selectedCinema, handleShowtimeClick }) {
  // Filter showtimes for the selected cinema
  const relevantShowtimes = movie.showtimes?.filter( // Added optional chaining ?.
    (showtime) => showtime.cinema === selectedCinema
  ) || []; // Default to empty array if showtimes is null/undefined

  // Don't render anything if no relevant showtimes exist
  if (relevantShowtimes.length === 0) {
    return null;
    // Or: return <div className='text-sm text-gray-500 mt-2 italic'>No showtimes available for this cinema.</div>;
  }

  return (
    <div className='flex flex-wrap gap-2 mt-2'>
      {relevantShowtimes.map((showtime) => (
        <Button
          // IMPORTANT: Use a truly unique key if possible (e.g., showtime.id)
          // Using only time might cause issues if the same time exists for different formats/screens
          key={showtime.id || showtime.time}
          type='default'
          className='border-blue-500 text-blue-500 hover:!bg-blue-100 hover:!text-blue-600 px-3 py-1 text-sm h-auto' // Adjusted padding/height
          onClick={() =>
            // Pass the necessary info back to the parent's handler
            handleShowtimeClick(
              { ...showtime }, // Pass a copy of the specific showtime
              movie.title,
              movie.ageLimit,
              movie.duration
            )
          }
        >
          {showtime.time} ~{' '}
          {getEndTime(showtime.time, movie.duration)}
        </Button>
      ))}
    </div>
  );
}

// Define PropTypes for better component usage and error checking
ShowtimeButtons.propTypes = {
  /** The movie object containing showtimes and details */
  movie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    showtimes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Optional but highly recommended unique ID
        cinema: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        time: PropTypes.string.isRequired,
        // Add other required showtime properties if applicable (e.g., format, screen)
      })
    ), // Made showtimes potentially optional with default below
    title: PropTypes.string.isRequired,
    ageLimit: PropTypes.string,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  /** The ID of the currently selected cinema */
  selectedCinema: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Function to call when a showtime button is clicked. Receives (showtime, title, ageLimit, duration) */
  handleShowtimeClick: PropTypes.func.isRequired,
};

// Default props can handle cases where movie.showtimes might be undefined
ShowtimeButtons.defaultProps = {
    movie: {
        showtimes: []
    }
};


export default ShowtimeButtons;