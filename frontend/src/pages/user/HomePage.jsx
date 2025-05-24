import React from 'react'
import SliderComponent from '../../components/Slider/SliderComponent'
import Carousel from '../../components/common/Carousel'
import ShowcaseComponent from '../../components/Showcase/ShowcaseComponent'
const HomePage = () => {
  return (
    <div className='flex flex-col gap-4'>
      <SliderComponent />

      <div className='  pb-10'>
        <div className='text-center m-5 font-extrabold  text-3xl text-black'>
          UPCOMING
        </div>

        <Carousel />
      </div>

      <ShowcaseComponent />
    </div>
  )
}

export default HomePage
