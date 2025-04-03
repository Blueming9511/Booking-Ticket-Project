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
      const dayOfWeek = date.toLocaleDateString('en', { weekday: 'short' })
      const monthOfDay = date.toLocaleDateString('en', { month: 'short' })

      days.push({ dayNumber, dayOfWeek, monthOfDay })
    }
    return days
  }

  const dates = getDates()

  // Auto-select today's date when component mounts
  useEffect(() => {
    setSelectedDate(dates[0].dayNumber) // First date in the list is today
  }, []) // Runs once when the component mounts

  return (
    <div className='flex space-x-2 mb-3'>
      {dates.map(({ dayNumber, dayOfWeek, monthOfDay }, index) => (
        <button
          key={dayNumber}
          className={`w-16 h-full flex flex-col cursor-pointer items-center justify-center rounded-lg border border-gray-400 
                      transition-all p-2
                      ${
                        selectedDate === dayNumber
                          ? 'bg-primary text-white border-red-700' // Selected state (Blue)
                          : ' text-black' // Default state (Light Blue)
                      }`}
          onClick={() => setSelectedDate(dayNumber)}
        >
          <span className='text-sm   transition-all '>{dayOfWeek}</span>
          <span
            className={`text-[30px] font-bold w-full h-full flex items-center justify-center rounded-t-lg 
            transition-all duration-300
           `}
          >
            {dayNumber}
          </span>

          <span className='text-sm transition-all '>{monthOfDay}</span>
        </button>
      ))}
    </div>
  )
}

export default DatePicker
