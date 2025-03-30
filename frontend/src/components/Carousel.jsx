import React from 'react';
import Slider from 'react-slick';
import MovieCard from './MovieCard';
import img from '../assets/lostCity.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const movies = [
  { img: img, Name: 'Inception', categories: ['Sci-Fi', 'Thriller'] },
  { img: img, Name: 'Interstellar', categories: ['Sci-Fi', 'Drama'] },
  { img: img, Name: 'The Dark Knight', categories: ['Action', 'Drama'] },
  { img: img, Name: 'Tenet', categories: ['Sci-Fi', 'Thriller'] },
  { img: img, Name: 'Avatar', categories: ['Sci-Fi', 'Fantasy'] },
  { img: img, Name: 'Joker', categories: ['Drama', 'Thriller'] }
];

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    centerPadding: '0px', // Ensures full-size center card
    responsive: [
      {
        breakpoint: 1024, // Tablets & small desktops
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768, // Mobile landscape
        settings: {
          slidesToShow: 2,
          centerMode: false // Disable centering on small screens
        }
      }
    ]
  };

  return (
    <div className="flex justify-center items-center w-full mx-4 ">
      <div className="w-[80%]">
        <Slider {...settings}>
          {movies.map((movie, index) => (
            <div key={index} className="flex justify-center">
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;
