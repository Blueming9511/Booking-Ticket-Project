// src/components/ShowtimeButtons/ShowtimeButtons.js
import React, { useMemo } from 'react';
import { Button, Tooltip } from 'antd';
import clsx from 'clsx'; // Using clsx for cleaner className logic

// --- Style Definitions (Outside Component for Readability) ---

// Base styles for all buttons
const BASE_BUTTON_CLASSES = clsx(
  'border font-medium transition-all duration-150 ease-in-out',
  'text-xs sm:text-sm px-3 py-1 h-auto rounded', // Consistent padding/sizing/rounding
  'focus:outline-none focus:ring-2 focus:ring-offset-1' // Base focus style
);

// Styles for AVAILABLE buttons (Red/White Theme)
const AVAILABLE_BUTTON_CLASSES = clsx(
  'bg-white border-red-500 text-red-600',                 // Base: White bg, red border/text
  'hover:bg-red-50 hover:border-red-600 hover:text-red-700', // Hover: Light red bg, darker border/text
  'focus:ring-red-400 focus:bg-red-50 focus:border-red-600 focus:text-red-700' // Focus: Similar to hover + red ring
);

// Styles for DISABLED buttons (Neutral Gray Theme - kept from previous improvement)
const DISABLED_BUTTON_CLASSES = clsx(
  'bg-gray-100 border-gray-300 text-gray-400', // Muted gray appearance
  'opacity-75 cursor-not-allowed'             // Clear disabled cues (slightly increased opacity)
);

// --- Component ---

const ShowtimeButtons = ({ showtimes = [], handleShowtimeClick }) => {
  const sortedShowtimes = useMemo(() => {
    // Defensive copy and sort
    return showtimes
      ? [...showtimes].sort((a, b) => a.startTime.localeCompare(b.startTime))
      : [];
  }, [showtimes]);

  // Empty State - improved clarity and styling
  if (!sortedShowtimes || sortedShowtimes.length === 0) {
    return (
      <div className="mt-3 text-sm text-gray-500 italic"> {/* Using improved empty state style */}
        No showtimes currently available for this selection.
      </div>
    );
  }

  return (
    // Container with consistent gap and margin
    <div className="flex flex-wrap gap-2 mt-3">
      {sortedShowtimes.map((showtime) => {
        const isDisabled = showtime.status !== 'AVAILABLE';
        // Using hyphen for clarity, but revert if '~' is preferred
        const buttonContent = `${showtime.startTime} - ${showtime.endTime}`;

        // Determine button classes using clsx
        const buttonClassName = clsx(
          BASE_BUTTON_CLASSES,
          isDisabled ? DISABLED_BUTTON_CLASSES : AVAILABLE_BUTTON_CLASSES // Apply correct theme
        );

        const buttonElement = (
          <button
            key={showtime.showTimeCode}
            // Still using type="text" to allow easy Tailwind override,
            // leveraging AntD's structure & accessibility features.
            type="text"
            disabled={isDisabled}
            onClick={() => !isDisabled && handleShowtimeClick(showtime)}
            className='border rounded-md px-2 py-1 cursor-pointer border-gray-400 hover:bg-[#D84040] hover:text-white transition'
            aria-label={
              isDisabled
                ? `Showtime from ${showtime.startTime} to ${showtime.endTime} (Unavailable)`
                : `Select showtime from ${showtime.startTime} to ${showtime.endTime}`
            }
          >
            {buttonContent}
          </button>
        );

        // Render button, wrapped in Tooltip if disabled
        return isDisabled ? (
          <Tooltip
            key={`${showtime.showTimeCode}-tooltip`}
            title="This showtime is unavailable or full" // Clearer tooltip message
            placement="top" // Standard tooltip placement
          >
            {/* Span wrapper REQUIRED for Tooltip around disabled AntD Buttons */}
            <span className="inline-block">
                {buttonElement}
            </span>
          </Tooltip>
        ) : (
          buttonElement // Render directly if available
        );
      })}
    </div>
  );
};

export default ShowtimeButtons;