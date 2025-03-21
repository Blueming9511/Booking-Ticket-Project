import React from 'react'
import './xdev.css'
import useSlider from './xdev'
import { Button, Tooltip } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import nhagiatien from '../../assets/nhagiatien.jpg'
import lostCity from '../../assets/lostCity.jpg'

const slidesData = [
  {
    id: 1,
    name: 'Nhà Gia Tiên',
    image: nhagiatien,
    categories: ['Horror', 'Family', 'Comedy'],
    time: '90 minutes',
    description: 'Có thờ có thiêng, có Gia Tiên có tiền!'
  },
  {
    id: 2,
    name: 'The Lost City',
    image: lostCity,
    categories: ['Adventure'],
    time: '120 minutes',
    description: 'An epic treasure hunt!'
  },
  {
    id: 3,
    name: 'Iceland',
    image: 'https://i.ibb.co/NSwVv8D/img3.jpg',
    categories: ['Nature'],
    time: '95 minutes',
    description: 'Explore the icy landscapes.'
  },
  {
    id: 4,
    name: 'Australia',
    image: 'https://i.ibb.co/Bq4Q0M8/img4.jpg',
    categories: ['Wildlife'],
    time: '110 minutes',
    description: 'A journey into the wild!'
  },
  {
    id: 5,
    name: 'Netherlands',
    image: 'https://i.ibb.co/jTQfmTq/img5.jpg',
    categories: ['Culture'],
    time: '105 minutes',
    description: 'Tulips, windmills, and history.'
  },
  {
    id: 6,
    name: 'Ireland',
    image: 'https://i.ibb.co/RNkk6L0/img6.jpg',
    categories: ['History'],
    time: '100 minutes',
    description: 'Legends of the Emerald Isle.'
  }
]

const SliderComponent = () => {
  const { currentSlides, nextSlide, prevSlide } = useSlider(slidesData)

  return (
    <div className='container'>
      <div className='slide'>
        {currentSlides.map(slide => (
          <div
            key={slide.id}
            className='item flex flex-col justify-center items-start text-white p-6'
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className='content text-shadow-10 space-y-4 w-100'>
              <h1 className='text-5xl font-extrabold'>{slide.id}</h1>

              <div className='categories_times flex flex-wrap items-center gap-2 text-sm opacity-80'>
                {slide.categories?.map((category, index) => (
                  <Tooltip key={index} title={category}>
                    <span>
                      {category}
                      {index !== slide.categories.length - 1 && (
                        <span className='mx-1'>·</span>
                      )}
                    </span>
                  </Tooltip>
                ))}
                <span className='mx-2'>|</span>
                <div className='font-medium'>{slide.time}</div>
              </div>

              <h2 className='text-6xl font-bold'>{slide.name}</h2>
              <p className='text-lg opacity-90'>{slide.description}</p>

              <Button
                type='default'
                size='middle'
                className='bg-blue-500 text-white font-semibold hover:bg-blue-600 transition'
              >
                Book Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className='button'>
        <button className='prev' onClick={prevSlide}>
          <LeftOutlined />
        </button>

        <button className='next' onClick={nextSlide}>
          <RightOutlined />
        </button>
      </div>
    </div>
  )
}

export default SliderComponent
