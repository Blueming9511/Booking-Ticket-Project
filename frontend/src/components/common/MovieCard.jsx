// src/components/MovieCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

// Add 'theme' prop with a default value
const MovieCard = ({ movie, theme = 'light' }) => {
  console.log("movie", movie);
  // Keep existing validation
  if (!movie || !movie.id || !movie.title || !movie.img) {
    console.warn('Incomplete movie data passed to MovieCard:', movie);
    return null;
  }

  const descriptionText = `${movie.categories?.join(', ') || 'Info N/A'}`.trim();
  const ratedText = `${movie.rate ? movie.rate : 'N/A'}`;
  const movieDetailPath = `/movie/${movie.id}`;

  // --- Define text colors based on theme ---
  const titleColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const descriptionColorClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  // Star color likely stays the same regardless of theme, but could be adjusted if needed:
  // const starColor = theme === 'light' ? '#FFA940' : '#FCB454';

  return (
    <Link to={movieDetailPath} style={{ textDecoration: 'none' }}>
      <Card
        className='!bg-transparent !border-none w-full max-w-[240px] overflow-hidden rounded-md cursor-pointer group' // Added 'group' for potential hover effects later
        styles={{
          body: {
            padding: '10px 0',
          },
        }}
        cover={
          <img
            alt={`${movie.title} poster`}
            src={movie.img}
            className='w-full h-auto object-cover aspect-[2/3] rounded-t-md transition-transform duration-300 group-hover:scale-105' // Example hover effect
            loading='lazy'
          />
        }
      >
        <Meta
          title={
            <span
             // Apply conditional text color class
             className={`block font-bold text-ellipsis whitespace-nowrap text-sm leading-5 ${titleColorClass}`}
             // OR keep inline styles and make color dynamic:
             /* style={{
               display: 'block',
               color: theme === 'light' ? '#1F2937' : 'white', // Example color values
               fontWeight: 'bold',
               textOverflow: 'ellipsis',
               whiteSpace: 'nowrap',
               fontSize: '14px',
               lineHeight: '20px'
             }} */
            >
              {movie.title}
            </span>
          }
          description={
            <div
              // Apply conditional text color class
              className={`flex flex-col text-xs leading-4 gap-1 ${descriptionColorClass}`}
              // OR keep inline styles and make color dynamic:
              /* style={{
                display: 'flex',
                flexDirection: 'column',
                color: theme === 'light' ? '#4B5563' : '#9CA3AF', // Example color values
                fontSize: '12px', // text-xs
                lineHeight: '16px', // leading-4
                gap:"0.25rem" // gap-1
              }} */
            >
              <span>{descriptionText || 'N/A'}</span> {/* Wrap in span for clarity */}
              <span>
                {/* Keep star color consistent for now, or use variable: style={{ color: starColor }} */}
                <StarFilled style={{ color: '#FCB454', marginRight: '4px' }}/> {ratedText}
              </span>
            </div>
          }
        />
      </Card>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string),
    rate: PropTypes.string, // Assuming rate is optional and a string like "8.5/10"
  }).isRequired,
  // Add theme prop type validation
  theme: PropTypes.oneOf(['light', 'dark']),
};

// Optional: Define default props if you prefer that over default function parameters
// MovieCard.defaultProps = {
//   theme: 'dark',
// };

export default MovieCard;