import React, { useState } from 'react'
import { Menu, Button, Image, Divider } from 'antd'
import nhagiatien from '../../assets/nhagiatien.jpg'
import lostCity from '../../assets/lostCity.jpg'
import DatePicker from './DatePicker'

// Cinema List
const cinemas = [
  { id: 'cgv-aeon', name: 'CGV Aeon Long Biên' },
  { id: 'cgv-xuan-dieu', name: 'CGV Xuân Diệu' },
  { id: 'cgv-tran-duy-hung', name: 'CGV Trần Duy Hưng' },
  { id: 'cgv-lieu-giai', name: 'CGV Liễu Giai' },
  { id: 'cgv-long-bien', name: 'CGV Long Biên' },
  { id: 'cgv-ocean-park', name: 'CGV Ocean Park' }
]

// Date Options
const dates = ['20', '21', '22', '23', '24', '25', '26']

// Movie Data
const movies = [
  {
    id: '1',
    title: 'Nhà Gia Tiên',
    poster: nhagiatien,
    duration: 102, // Example: 102 minutes
    showtimes: {
      'cgv-aeon': ['17:25', '18:30', '20:00', '23:50'],
      'cgv-tran-duy-hung': ['19:00', '21:10']
    }
  },
  {
    id: '2',
    title: 'Avengers: Endgame',
    poster: lostCity,
    duration: 181, // Example: 181 minutes (Endgame is long!)
    showtimes: {
      'cgv-aeon': ['17:25', '18:30', '20:00', '23:50'],
      'cgv-xuan-dieu': ['15:00', '18:00', '21:00'],
      'cgv-lieu-giai': ['16:30', '19:30', '22:00']
    }
  },
  {
    id: '3',
    title: 'Dune: Part Two',
    poster: lostCity,
    duration: 166, // Example: 166 minutes
    showtimes: {
      'cgv-aeon': ['17:25', '18:30', '20:00', '23:50'],

      'cgv-long-bien': ['14:45', '17:45', '20:45'],
      'cgv-ocean-park': ['13:30', '16:30', '19:30']
    }
  }
]

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
  const [selectedDate, setSelectedDate] = useState('20')

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
       
        
        <DatePicker/>

        {/* Movie Listings (Without Card) */}
        <div className='gap-4 w-full bg-white min-h-[200px]'>
          {movies
            .filter(movie => movie.showtimes[selectedCinema])
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
                    <span className='bg-red-600 text-white text-xs px-2 py-1 rounded-md w-fit'>
                      18+
                    </span>
                    <h3 className='text-lg font-bold mt-2'>{movie.title}</h3>
                    <p className='text-gray-600'>2D Phụ đề</p>

                    {/* Showtimes */}
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {movie.showtimes[selectedCinema].map(time => (
                        <Button
                          key={time}
                          type='default'
                          className='border-blue-500 text-blue-500 hover:bg-blue-100 px-4 py-2'
                        >
                          {time} ~ {getEndTime(time, movie.duration)}
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
    </div>
  )
}

export default CinemaBooking
