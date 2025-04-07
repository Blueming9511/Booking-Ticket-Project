// src/components/DatePicker/DatePicker.js
import React from 'react';
import { getNext7Days } from '../../utils/dateUtils'; // Import helper

const DatePicker = ({ selectedDate, onDateChange }) => {
  const dates = getNext7Days(); // Use the helper

  // If no date is selected initially, select today
  React.useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      onDateChange(dates[0].fullDate);
    }
  }, [selectedDate, onDateChange, dates]);


  return (
    <div className='flex space-x-2 mb-3 overflow-x-auto pb-2'> {/* Added overflow and padding */}
      {dates.map(({ fullDate, dayNumber, dayOfWeek, monthOfDay }) => (
        <button
          key={fullDate} // Use fullDate as key
          className={`w-16 h-auto flex-shrink-0 flex flex-col cursor-pointer items-center justify-center rounded-lg border
                      transition-all p-2
                      ${
                        selectedDate === fullDate
                          ? 'bg-primary text-white border-red-700 font-bold' // Use primary color variable
                          : 'text-black border-gray-400 hover:border-primary hover:text-primary' // Default state
                      }`}
          onClick={() => onDateChange(fullDate)} // Call handler with full date
        >
          <span className='text-sm transition-all'>{dayOfWeek}</span>
          <span
            className={`text-[30px] font-bold w-full h-full flex items-center justify-center rounded-t-lg
            transition-all duration-300
           `}
          >
            {dayNumber}
          </span>
          <span className='text-sm transition-all'>{monthOfDay}</span>
        </button>
      ))}
    </div>
  );
};

export default DatePicker;