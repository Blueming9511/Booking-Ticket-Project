import React from 'react';
import './xdev.css';
import useSlider from './xdev';
import { Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';


const SliderComponent = ({ movies }) => {
  const { currentSlides, nextSlide, prevSlide } = useSlider(movies);

  return (
    <div className="container">
      <div className="slide">
        {currentSlides.map((slide, slideIndex) => ( // Use slideIndex for outer loop
          <div
            key={slide._id}
            className="item flex flex-col justify-center items-start text-white p-6"
            style={{ backgroundImage: `url(${slide.thumbnail})` }}
          >
            <div className="content text-shadow-10 space-y-4 w-100">
              <h1 className="text-5xl font-extrabold">{slideIndex + 1}</h1> {/* Display slide.title, not the index */}

              <div className="categories_times flex flex-wrap items-center gap-2 text-sm opacity-80">
                {slide.genre?.map((category, genreIndex) => ( // Use genreIndex for inner loop
                  <Tooltip key={genreIndex} title={category}>
                    <span>
                      {category}
                      {genreIndex < slide.genre.length - 1 && (
                        <span className="mx-1">·</span>
                      )}
                    </span>
                  </Tooltip>
                ))}
                <span className="mx-2">|</span>
                <div className="font-medium">{slide.duration} minutes</div>
              </div>

              <h2 className='text-6xl font-bold'>{slide.title}</h2>
              <p className='text-lg opacity-90'>{slide.description}</p>

              <button
                type='default'
                size='middle'
                className='bg-red-600 px-3 py-1 rounded-2xl flex justify-center items-center shadow-2xl text-white font-semibold hover:bg-red-700 transition'
              >
                Book Now
              </button>
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
