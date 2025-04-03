import React, { useState } from 'react'
import { Tooltip } from 'antd' // Import Tooltip from Ant Design
import cgv from '../../assets/Cinemas_Logo/CGV.jpg'

// JSON data for cinemas
const cinemas = [
  { id: 'all', name: 'Tất cả', logo: cgv, highlight: true },
  { id: 'cgv', name: 'CGV', logo: cgv },
  { id: 'lotte', name: 'Lotte Cinema', logo: cgv },
  { id: 'galaxy', name: 'Galaxy Cinema', logo: cgv },
  { id: 'bhd', name: 'BHD Star', logo: cgv },
  { id: 'beta', name: 'Beta Cinemas', logo: cgv },
  { id: 'cinestar', name: 'Cinestar', logo: cgv },
  { id: 'mega', name: 'Mega GS', logo: cgv },
  { id: 'dcine', name: 'DCINE', logo: cgv }
]

const CinemaSelector = () => {
  const [selectedCinema, setSelectedCinema] = useState('all')

  // Function to truncate text
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  // Handle selection
  const handleSelect = cinemaId => {
    setSelectedCinema(cinemaId)
  }

  return (
    <div className='flex gap-5 overflow-x-auto justify-center sm:justify-start'>
      {cinemas.map(cinema => (
        <Tooltip key={cinema.id} title={cinema.name} className='flex flex-col justify-start items-center'>
          <button
            className={`cursor-pointer w-[50px] h-[50px] flex justify-center items-center p-2 rounded-lg border transition-all duration-300
            ${
              selectedCinema === cinema.id
                ? 'border-red-800  shadow-md'
                : 'border-gray-300'
            }`}
            onClick={() => handleSelect(cinema.id)}
          >
            <img
              src={cinema.logo}
              alt={cinema.name}
              className=' sm:w-10 sm:h-10 object-contain'
            />
          </button>
          <span
            className={`text-[10px] sm:text-xs font-bold  mt-1  ${
              selectedCinema === cinema.id ? 'text-red-800' : 'text-gray-500'
            }`}
          >
            {truncateText(cinema.name, 8)}
          </span>
        </Tooltip>
      ))}
    </div>
  )
}

export default CinemaSelector
