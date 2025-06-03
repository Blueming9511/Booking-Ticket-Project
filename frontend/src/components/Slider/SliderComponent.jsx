import React, { useEffect, useState } from 'react'
import './xdev.css'
import useSlider from './xdev'
import { Button, Tooltip } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import axios from 'axios'

// const slidesData = [
//   {
//     id: 1,
//     name: 'Dune: Part Two', 
//     image: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', 
//     categories: ['Science Fiction', 'Adventure'], // Mapped from 'genres'
//     time: '167 minutes', // Mapped from 'duration'
//     description: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen…' // Kept description
//   },
//   {
//     id: 2, // Changed from 'oppenheimer'
//     name: 'Oppenheimer', // Mapped from 'title'
//     image: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', // Kept TMDb backdrop
//     categories: ['Drama', 'History'], // Mapped from 'genres'
//     time: '181 minutes', // Mapped from 'duration'
//     description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.' // Kept description
//   },

//   {
//     id: 3, // Changed from 'kungfupanda4'
//     name: 'Kung Fu Panda 4', // Mapped from 'title'
//     image: 'https://image.tmdb.org/t/p/w1280/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg', // Kept TMDb backdrop
//     categories: ['Animation', 'Action', 'Family', 'Comedy'], // Mapped from 'genres'
//     time: '94 minutes', // Mapped from 'duration'
//     description: 'Po must train a new warrior when he\'s chosen to become the spiritual leader of the Valley of Peace.' // Kept description
//   },
//   {
//     id: 4, // Changed from 'barbie'
//     name: 'Barbie', // Mapped from 'title'
//     image: 'https://image.tmdb.org/t/p/w1280/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg', // Kept TMDb backdrop
//     categories: ['Comedy', 'Adventure', 'Fantasy'], // Mapped from 'genres'
//     time: '114 minutes', // Mapped from 'duration'
//     description: 'Barbie suffers a crisis that leads her to question her world and her existence.' // Kept description
//   },
//   {
//     id: 5, // Changed from 'barbie'
//     name: 'Barbie 2', // Mapped from 'title'
//     image: 'https://image.tmdb.org/t/p/w1280/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg', // Kept TMDb backdrop
//     categories: ['Comedy', 'Adventure', 'Fantasy'], // Mapped from 'genres'
//     time: '114 minutes', // Mapped from 'duration'
//     description: 'Barbie suffers a crisis that leads her to question her world and her existence.' // Kept description
//   },
// ];

const SliderComponent = () => {

  const [slidesData, setSlidesData] = useState([]);
  const { currentSlides, nextSlide, prevSlide, setSlides } = useSlider();
  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/guest/movies-carousel');
        console.log(response.data)
        setSlidesData(response.data);
        setSlides(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    getMovies();
  }, [])

  useEffect(() => {
    console.log(currentSlides);
  }, [currentSlides])

  return (
    <div className='container'>
      <div className='slide'>
        {currentSlides?.map((slide, index) => (
          <div
            key={slide.id}
            className='item flex flex-col justify-center items-start text-white p-6'
            style={{ backgroundImage: `url(${slide.thumbnail})` }}
          >
            <div className='content text-shadow-10 space-y-4 w-100'>
              <h1 className='text-5xl font-extrabold'>{index}</h1>

              <div className='categories_times flex flex-wrap items-center gap-2 text-sm opacity-80'>
                {slide?.genre?.map((category, index) => (
                  <Tooltip key={index} title={category}>
                    <span>
                      {category}
                      {index !== slide.genre.length - 1 && (
                        <span className='mx-1'>·</span>
                      )}
                    </span>
                  </Tooltip>
                ))}
                <span className='mx-2'>|</span>
                <div className='font-medium'>{slide.duration}</div>
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
