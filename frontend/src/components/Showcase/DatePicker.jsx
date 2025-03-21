import React, { useState, useEffect } from 'react'

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState('')

  // Function to generate next 7 days dynamically
  const getDates = () => {
    const days = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() + i)

      const dayNumber = date.getDate().toString() // Convert to string for comparison
      const dayOfWeek = date.toLocaleDateString('vi-VN', { weekday: 'short' }) // Vietnamese day name

      days.push({ dayNumber, dayOfWeek })
    }
    return days
  }

  const dates = getDates()

  // Auto-select today's date when component mounts
  useEffect(() => {
    setSelectedDate(dates[0].dayNumber) // First date in the list is today
  }, []) // Runs once when the component mounts

  return (
    <div className='flex space-x-2'>
      {dates.map(({ dayNumber, dayOfWeek }, index) => (
        <button
          key={dayNumber}
          className={`w-16 h-20 flex flex-col cursor-pointer items-center justify-center rounded-lg border border-gray-400 
                      transition-all duration-300
                      ${
                        selectedDate === dayNumber
                          ? 'border-blue-900 text-white' // Selected state (Blue)
                          : 'bg-gray-100 text-black' // Default state (Light Blue)
                      }`}
          onClick={() => setSelectedDate(dayNumber)}
        >
          <span
            className={`text-lg font-bold w-full h-full flex items-center justify-center rounded-t-lg 
            transition-all duration-300
            ${
              selectedDate === dayNumber
                ? 'bg-blue-600 text-white' // Selected state (Blue)
                : 'bg-gray-100 text-black' // Default state (Light Blue)
            }`}
          >
            {dayNumber}
          </span>
          <span className='text-sm py-1 bg-white w-full rounded-b-lg text-black transition-all duration-300'>
            {index === 0 ? 'Hôm nay' : dayOfWeek}
          </span>
        </button>
      ))}
    </div>
  )
}

export default DatePicker
