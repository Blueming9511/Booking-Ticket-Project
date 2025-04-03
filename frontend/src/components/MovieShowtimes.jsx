import React from 'react'
import LocationSelector from './Showcase/LocationSelector'
import DatePicker from './Showcase/DatePicker'
import CinemaSelector from './Showcase/CinemaSelector'
import { Collapse } from 'antd';
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;



const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];


export default function MovieShowtimes () {
  return (
    <div className='m-5 '>
      <div className='flex justify-between flex-wrap'>
        <div className='text-[20px] font-extrabold mb-3'>Showtimes</div>
        <LocationSelector />
      </div>

      <div className='w-full border-1 border-gray-300 p-2 flex flex-col gap-2 md:w-[50vw]'>
        <DatePicker />
        <CinemaSelector />
        <Collapse items={items} defaultActiveKey={['1']} />
      </div>
    </div>
  )
}
