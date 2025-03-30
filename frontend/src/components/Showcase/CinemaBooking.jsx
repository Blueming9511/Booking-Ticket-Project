import React, { useState } from 'react'
import { Menu, Button, Image, Divider } from 'antd'

import DatePicker from './DatePicker'
import BookingModal from './BookingModal'



const getAgeLimitColor = ageLimit => {
  switch (ageLimit) {
    case 'P':
      return 'bg-green-500'
    case 'K':
      return 'bg-blue-500'
    case '13+':
      return 'bg-yellow-500'
    case '16+':
      return 'bg-orange-500'
    case '18+':
      return 'bg-red-600'
    default:
      return 'bg-gray-500'
  }
}


const getEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const endMinutes = minutes + duration
  let endHours = hours + Math.floor(endMinutes / 60)
  const finalMinutes = endMinutes % 60
  endHours = endHours % 24
  return `${endHours.toString().padStart(2, '0')}:${finalMinutes
    .toString()
    .padStart(2, '0')}`
}

const CinemaBooking = ({movies, cinemas}) => {
  const [selectedCinema, setSelectedCinema] = useState(cinemas[0].id)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedShowtime, setSelectedShowtime] = useState(null)

  const handleOpenModal = (showtime, movieTitle, ageLimit, duration) => {
    // Merge movie title, age limit and duration with showtime details.
    setSelectedShowtime({ ...showtime, movieTitle, ageLimit, duration })
    setIsModalVisible(true)
  }

  return (
    <div className='flex'>
      {/* Sidebar for Cinemas */}
      <div className='w-64 p-4 h-screen overflow-y-auto'>
        <h2 className='text-lg font-bold mb-4'>Cinemas</h2>
        <Menu
          mode='vertical'
          selectedKeys={[selectedCinema]}
          onClick={e => setSelectedCinema(e.key)}
        >
          {cinemas.map(cinema => (
            <Menu.Item key={cinema.id}>{cinema.name}</Menu.Item>
          ))}
        </Menu>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-4'>
        <DatePicker />

        {/* Movie Listings */}
        <div className='gap-4 w-full bg-white min-h-[200px]'>
          {movies
            .filter(movie =>
              movie.showtimes.some(
                showtime => showtime.cinema === selectedCinema
              )
            )
            .map((movie, index, array) => (
              <React.Fragment key={movie.id}>
                <div className='p-4 rounded-lg flex bg-white w-full h-full'>
                  {/* Movie Poster */}
                  <div className='w-35 h-50'>
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      className='object-cover rounded-md'
                    />
                  </div>

                  {/* Movie Info */}
                  <div className='ml-4 flex flex-col'>
                    <span
                      className={`${getAgeLimitColor(
                        movie.ageLimit
                      )} text-white text-xs py-1 px-2 rounded-md w-fit`}
                    >
                      {movie.ageLimit}
                    </span>
                    <h3 className='text-lg font-bold mt-2'>{movie.title}</h3>
                    <p className='text-gray-600'>2D Phụ đề</p>

                    {/* Showtimes */}
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {movie.showtimes
                        .filter(showtime => showtime.cinema === selectedCinema)
                        .map(showtime => (
                          <Button
                            key={showtime.time}
                            type='default'
                            className='border-blue-500 text-blue-500 hover:bg-blue-100 px-4 py-2'
                            onClick={() =>
                              handleOpenModal(
                                { ...showtime },
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
                  </div>
                </div>

                {index < array.length - 1 && <Divider />}
              </React.Fragment>
            ))}
        </div>
      </div>

      {/* Seat Selection Modal */}
      <BookingModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        showtime={selectedShowtime}
      />
    </div>
  )
}

export default CinemaBooking
