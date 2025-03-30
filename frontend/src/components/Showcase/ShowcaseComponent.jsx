import React from 'react'
import './showcase.css'
import LocationSelector from './LocationSelector'
import CinemaSelector from './CinemaSelector'
import { Divider } from 'antd'
import CinemaBooking from './CinemaBooking'
import nhagiatien from '../../assets/nhagiatien.jpg'
import lostCity from '../../assets/lostCity.jpg'
// Cinema List
const cinemas = [
  { id: 'cgv-aeon', name: 'CGV Aeon Long Biên' },
  { id: 'cgv-xuan-dieu', name: 'CGV Xuân Diệu' },
  { id: 'cgv-tran-duy-hung', name: 'CGV Trần Duy Hưng' },
  { id: 'cgv-lieu-giai', name: 'CGV Liễu Giai' },
  { id: 'cgv-long-bien', name: 'CGV Long Biên' },
  { id: 'cgv-ocean-park', name: 'CGV Ocean Park' }
]

const movies = [
  {
    id: '1',
    title: 'Nhà Gia Tiên',
    poster: nhagiatien,
    duration: 102,
    categories: ['Horror', 'Thriller'],
    ageLimit: '18+',
    showtimes: [
      {
        cinema: 'cgv-aeon',
        room: 'Room A',
        date: '2025-04-01', // Added date property
        time: '17:25',
        seats: {
          total: 120,
          types: {
            Standard: { price: 100000, available: 30 },
            VIP: { price: 150000, available: 20 },
            Couple: { price: 250000, available: 7 }
          },
          bookedSeats: ['A1', 'A2', 'B3', 'CP01']
        }
      },
      {
        cinema: 'cgv-tran-duy-hung',
        room: 'Room B',
        date: '2025-04-01', // Added date property
        time: '19:00',
        seats: {
          total: 100,
          types: {
            Standard: { price: 120000, available: 50 },
            VIP: { price: 180000, available: 50 }
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
    duration: 181,
    categories: ['Action', 'Sci-Fi', 'Adventure'],
    ageLimit: '13+',
    showtimes: [
      {
        cinema: 'cgv-aeon',
        room: 'Room C',
        date: '2025-04-01', // Added date property
        time: '20:00',
        seats: {
          total: 140,
          types: {
            Standard: { price: 120000, available: 70 },
            VIP: { price: 180000, available: 50 },
            Couple: { price: 280000, available: 20 }
          },
          bookedSeats: ['B1', 'C3', 'C4']
        }
      },
      {
        cinema: 'cgv-xuan-dieu',
        room: 'Room D',
        date: '2025-04-01', // Added date property
        time: '21:00',
        seats: {
          total: 100,
          types: {
            Standard: { price: 100000, available: 50 },
            VIP: { price: 150000, available: 50 }
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
    duration: 166,
    categories: ['Sci-Fi', 'Adventure', 'Drama'],
    ageLimit: 'K',
    showtimes: [
      {
        cinema: 'cgv-aeon',
        room: 'Room E',
        date: '2025-04-01', // Added date property
        time: '18:30',
        seats: {
          total: 120,
          types: {
            Standard: { price: 110000, available: 60 },
            VIP: { price: 170000, available: 40 },
            Couple: { price: 260000, available: 20 }
          },
          bookedSeats: ['C2', 'C5', 'D6']
        }
      },
      {
        cinema: 'cgv-ocean-park',
        room: 'Room F',
        date: '2025-04-01', // Added date property
        time: '16:30',
        seats: {
          total: 100,
          types: {
            Standard: { price: 90000, available: 50 },
            VIP: { price: 140000, available: 50 }
          },
          bookedSeats: ['B4', 'B5', 'C6']
        }
      }
    ]
  }
];

const ShowcaseComponent = () => {
  return (
    <div className='center flex-col text-primary'>
      <h1 className=' text-3xl font-extrabold mb-5'>SHOWTIMES</h1>

      <div className='showcase w-[80%] rounded-2xl p-5 flex flex-col gap-2'>
        {/* Location */}
        <div className='location flex gap-2 items-center'>
          <span>Location</span>
          <LocationSelector />
        </div>
        <CinemaSelector />
        
        <Divider className='m-0'/>
        <CinemaBooking movies={movies} cinemas = {cinemas}/>

      </div>
    </div>
  )
}

export default ShowcaseComponent
