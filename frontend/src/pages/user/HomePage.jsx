import { useState, useEffect } from 'react';
import { Spin } from 'antd';  // Import Spin for loading indicator
import SliderComponent from '../../components/Slider/SliderComponent';
import Carousel from '../../components/Carousel';
import ShowcaseComponent from '../../components/Showcase/ShowcaseComponent';
import api from '../../utils/api';

const HomePage = () => {
  const [movieData, setMovieData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true); // Set loading to true before fetching

      try {
        const response = await api.get('/movies');
        setMovieData(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching, regardless of success/failure
      }
    };

    fetchMovies();
  }, []);

  const nowShowingMovies = movieData?.filter(movie => movie.status === 'NOW_SHOWING');
  const upcomingMovies = movieData?.filter(movie => movie.status === 'COMING_SOON');

  console.log(nowShowingMovies);
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" /> {/* Display loading spinner */}
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-4">
      <SliderComponent movies={nowShowingMovies} />
      <div className="pb-10">
        <div className="text-center m-5 font-extrabold text-3xl text-black">
          UPCOMING
        </div>
        <Carousel movies={upcomingMovies} /> {/* Pass upcomingMovies to Carousel */}
      </div>
      <ShowcaseComponent /> {/* Or pass the appropriate data here */}
    </div>
  );
};

export default HomePage;