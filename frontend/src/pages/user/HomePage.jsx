import React, { useEffect, useState } from 'react'
import SliderComponent from '../../components/Slider/SliderComponent'
import ShowcaseComponent from '../../components/Showcase/ShowcaseComponent'
import MovieCarousel from '../../components/common/Carousel'
import axios from 'axios'
const HomePage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/guest/movies-up-comming');
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    getMovies();
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      <SliderComponent />

      <div className='  pb-10'>
        <div className='text-center m-5 font-extrabold  text-3xl text-black'>
          UPCOMING
        </div>

        <MovieCarousel movies={movies}/>
      </div>

      <div className='pb-10'>
        <ShowcaseComponent />
      </div>
    </div>
  )
}

export default HomePage
