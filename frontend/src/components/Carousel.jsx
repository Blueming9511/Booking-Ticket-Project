// src/components/MovieCarousel.jsx
import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick' // Using react-slick's Slider
import MovieCard from './MovieCard'

// Import Slick CSS (ensure these paths are correct)
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
// import { Carousel } from 'antd'; // REMOVED: Conflicting and unused import

// --- Optional: Custom Arrow Components (Keep if needed) ---
// function SampleNextArrow(props) { ... }
// function SamplePrevArrow(props) { ... }
// --- End Custom Arrows ---

// NOTE: Ideally, this 'movies' data should be passed as a prop
// or imported from a dedicated data file (e.g., src/data/movies.js)
// For this example, we assume it will be passed via props.
// const movies = [ ... ]; // REMOVED internal data definition

// RENAMED component to MovieCarousel and accepting props
const MovieCarousel = ({ movies = [] }) => {
  // Accept movies as a prop, default to empty array

  const settings = {
    // --- Base Settings ---
    dots: true,                    // Show dots navigation
    infinite: movies.length > 5,   // Loop slider only if more than 5 movies (at base screen size)
    speed: 500,                    // Transition speed (ms)
    slidesToShow: 5,               // Default number of slides to show
    slidesToScroll: 1,               // How many slides to scroll at once
    autoplay: true,                // Enable autoplay
    autoplaySpeed: 4000,           // Delay between autoplays (ms)
    pauseOnHover: true,            // Pause autoplay when hovering over the slider

    // --- Responsive Settings ---
    // Applied when screen width is *less than* the breakpoint
    responsive: [
      {
        breakpoint: 1280, // For screens < 1280px down to 1024px
        settings: {       // Settings to apply at this breakpoint
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: movies.length > 4 // Recalculate 'infinite' based on the new slidesToShow
        }
      },
      {
        breakpoint: 1024, // For screens < 1024px down to 768px
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: movies.length > 3 // Recalculate 'infinite'
        }
      },
      {
        breakpoint: 768,  // For screens < 768px (tablets and mobile)
        settings: {
          slidesToShow: 2, // Show 2 slides below 768px
          slidesToScroll: 1,
          infinite: movies.length > 2, // Recalculate 'infinite'
          dots: false                 // Hide dots on smaller screens
        }
      },
      // No breakpoint below 768 means the 768 settings persist for the smallest screens
    ]
  }

  // Handle empty state - uses the 'movies' prop
  if (!movies || movies.length === 0) {
    return (
      <div className='text-center text-gray-500 py-8'>
        No movies to display.
      </div>
    )
  }

  return (
    <div className='w-full px-4 md:px-30 py-4 movie-carousel-container'>
      {/* Using react-slick's Slider component */}
      <Slider {...settings}>
        {/* Map over the 'movies' prop */}
        {movies.map(movie => (
          <div key={movie.id} className='outline-none focus:outline-none'>
            {/* Removed px-1 */}
            <MovieCard movie={movie} theme='dark'/>
          </div>
        ))}
      </Slider>
    </div>
  )
}

// PropTypes attached to the correct component name: MovieCarousel
MovieCarousel.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string)
    })
  )
}

// Export using the correct component name: MovieCarousel
export default MovieCarousel
