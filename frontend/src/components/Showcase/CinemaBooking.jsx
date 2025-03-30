import React, { useState } from 'react'
import { Menu, Button, Image, Divider } from 'antd'
import nhagiatien from '../../assets/nhagiatien.jpg'
import lostCity from '../../assets/lostCity.jpg'
import DatePicker from './DatePicker'
import BookingModal from './BookingModal'

// Cinema List
const cinemas = [
  { id: 'cgv-aeon', name: 'CGV Aeon Long Biên' },
  { id: 'cgv-xuan-dieu', name: 'CGV Xuân Diệu' },
  { id: 'cgv-tran-duy-hung', name: 'CGV Trần Duy Hưng' },
  { id: 'cgv-lieu-giai', name: 'CGV Liễu Giai' },
  { id: 'cgv-long-bien', name: 'CGV Long Biên' },
  { id: 'cgv-ocean-park', name: 'CGV Ocean Park' }
];

const movies = [
  {
    id: '1',
    title: 'Nhà Gia Tiên',
    poster: nhagiatien,
    duration: 102, // Example: 102 minutes
    categories: ['Horror', 'Thriller'], // Example categories
    ageLimit: '18+', // Trên 18 tuổi (Restricted for under 18)
    showtimes: [
      {
        cinema: 'cgv-aeon', // Updated to match cinema ID
        room: 'Room A',
        time: '17:25',
        seats: {
          total: 120, // At least 100 seats per room
          types: {
            Standard: { price: 100000, available: 60 }, // 60 Standard seats
            VIP: { price: 150000, available: 40 },        // 40 VIP seats
            Couple: { price: 250000, available: 7 }        // 20 Couple seats
          },
          bookedSeats: ['A1', 'A2', 'B3'] // Sample booked seats
        }
      },
      {
        cinema: 'cgv-tran-duy-hung', // Updated
        room: 'Room B',
        time: '19:00',
        seats: {
          total: 100, // Exactly 100 seats per room
          types: {
            Standard: { price: 120000, available: 50 }, // 50 Standard seats
            VIP: { price: 180000, available: 50 }         // 50 VIP seats
            // No Couple seats defined here
          },
          bookedSeats: ['C5', 'D8', 'D9']
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Avengers: Endgame',
    poster: lostCity,
    duration: 181, // Example: 181 minutes (Endgame is long!)
    categories: ['Action', 'Sci-Fi', 'Adventure'],
    ageLimit: '13+', // Trên 13 tuổi (Parental guidance recommended)
    showtimes: [
      {
        cinema: 'cgv-aeon', // Updated
        room: 'Room C',
        time: '20:00',
        seats: {
          total: 140, // At least 100 seats per room
          types: {
            Standard: { price: 120000, available: 70 }, // 70 Standard seats
            VIP: { price: 180000, available: 50 },        // 50 VIP seats
            Couple: { price: 280000, available: 20 }        // 20 Couple seats
          },
          bookedSeats: ['B1', 'C3', 'C4']
        }
      },
      {
        cinema: 'cgv-xuan-dieu', // Updated
        room: 'Room D',
        time: '21:00',
        seats: {
          total: 100, // Exactly 100 seats per room
          types: {
            Standard: { price: 100000, available: 50 }, // 50 Standard seats
            VIP: { price: 150000, available: 50 }         // 50 VIP seats
            // No Couple seats defined here
          },
          bookedSeats: ['A6', 'A7', 'B8']
        }
      }
    ]
  },
  {
    id: '3',
    title: 'Dune: Part Two',
    poster: lostCity,
    duration: 166, // Example: 166 minutes
    categories: ['Sci-Fi', 'Adventure', 'Drama'],
    ageLimit: 'K', // Phù hợp với mọi lứa tuổi
    showtimes: [
      {
        cinema: 'cgv-aeon', // Updated
        room: 'Room E',
        time: '18:30',
        seats: {
          total: 120, // At least 100 seats per room
          types: {
            Standard: { price: 110000, available: 60 }, // 60 Standard seats
            VIP: { price: 170000, available: 40 },        // 40 VIP seats
            Couple: { price: 260000, available: 20 }        // 20 Couple seats
          },
          bookedSeats: ['C2', 'C5', 'D6']
        }
      },
      {
        cinema: 'cgv-ocean-park', // Updated
        room: 'Room F',
        time: '16:30',
        seats: {
          total: 100, // Exactly 100 seats per room
          types: {
            Standard: { price: 90000, available: 50 }, // 50 Standard seats
            VIP: { price: 140000, available: 50 }        // 50 VIP seats
            // No Couple seats defined here
          },
          bookedSeats: ['B4', 'B5', 'C6']
        }
      }
    ]
  }
];


  
const getAgeLimitColor = ageLimit => {
  switch (ageLimit) {
    case 'P': // Phổ biến
      return 'bg-green-500'
    case 'K': // Kids (Dành cho trẻ em)
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

  // Handle times that exceed 24:00 (next day)
  endHours = endHours % 24

  return `${endHours.toString().padStart(2, '0')}:${finalMinutes
    .toString()
    .padStart(2, '0')}`
}

const CinemaBooking = () => {
  const [selectedCinema, setSelectedCinema] = useState('cgv-aeon')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedShowtime, setSelectedShowtime] = useState(null)

  const handleOpenModal = (showtime, movieTitle) => {
    setSelectedShowtime({ ...showtime, movieTitle }) // Include movie title
    setIsModalVisible(true)
  }

  return (
    <div className='flex'>
      {/* Sidebar for Cinemas */}
      <div className='w-64 p-4  h-screen overflow-y-auto'>
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
            .filter(movie => movie.showtimes.some(showtime => showtime.cinema === selectedCinema))
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
                            onClick={() => handleOpenModal(showtime, movie.title)} // Open modal
                          >
                            {showtime.time} ~ {getEndTime(showtime.time, movie.duration)}
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Add Divider only if it's not the last item */}
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
