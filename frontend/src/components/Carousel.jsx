// MovieCarousel.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import MovieCard from './MovieCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const MovieCarousel = ({ movies = [] , theme}) => {

  const settings = {
    dots: true,
    infinite: movies.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: movies.length > 4
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: movies.length > 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: movies.length > 2,
          dots: false
        }
      }
    ]
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No movies to display.
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-30 py-4 movie-carousel-container">
      <Slider {...settings}>
        {movies.map(movie => (
          <div key={movie._id} className="outline-none focus:outline-none">
            <MovieCard movie={movie} theme={theme} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

MovieCarousel.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      genre: PropTypes.array,
      duration: PropTypes.number,
      description: PropTypes.string        
    })
  )
};

export default MovieCarousel;