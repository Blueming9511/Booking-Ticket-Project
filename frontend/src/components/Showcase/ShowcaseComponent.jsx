import React from 'react'
import './showcase.css'
import LocationSelector from './LocationSelector'
import CinemaSelector from './CinemaSelector'
import { Divider } from 'antd'
import CinemaBooking from './CinemaBooking'
const ShowcaseComponent = () => {
  return (
    <div className='center flex-col'>
      <h1 className='text-white text-3xl font-extrabold mb-4'>SHOWTIMES</h1>

      <div className='showcase w-[80%] rounded-2xl p-5 flex flex-col gap-2'>
        {/* Location */}
        <div className='location flex gap-2 items-center'>
          <span>Location</span>
          <LocationSelector />
        </div>
        <CinemaSelector/>
        
        <Divider/>
        <CinemaBooking/>

      </div>
    </div>
  )
}

export default ShowcaseComponent
