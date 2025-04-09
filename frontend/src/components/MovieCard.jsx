import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const MovieCard = ({ movie, theme = 'light' }) => {

  


  const descriptionText = movie.genre?.join(', ') || 'Info N/A'; // Use genre and provide fallback
  const ratedText = movie.rating ? `${movie.rating}` : 'N/A'; // Use rating
  const movieDetailPath = `/movie/${movie.movieCode}`; 
  const posterImg = movie.thumbnail; // Use thumbnail


  const titleColorClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const descriptionColorClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';


  return (
    <Link to={movieDetailPath} style={{ textDecoration: 'none' }}>
      <Card
        className="!bg-transparent !border-none w-full max-w-[240px] overflow-hidden rounded-md cursor-pointer group"
        styles={{
          body: {
            padding: '10px 0',
          },
        }}
        cover={
          <img
            alt={`${movie.title} poster`}
            src={posterImg}
            className="w-full h-auto object-cover aspect-[2/3] rounded-t-md transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        }
      >
        <Meta
          title={
            <span className={`block font-bold text-ellipsis whitespace-nowrap text-sm leading-5 ${titleColorClass}`}>
              {movie.title}
            </span>
          }
          description={
            <div className={`flex flex-col text-xs leading-4 gap-1 ${descriptionColorClass}`}>
              <span>{descriptionText}</span>
              <span>
                <StarFilled style={{ color: '#FCB454', marginRight: '4px' }} /> {ratedText}
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
    _id: PropTypes.string.isRequired,  // _id is required
    thumbnail: PropTypes.string.isRequired, // thumbnail is required
    title: PropTypes.string.isRequired,
    genre: PropTypes.array,              // Make genre optional (might be null/undefined)
    rating: PropTypes.number,             // rating prop type
    description: PropTypes.string         // Correct description prop type
  }).isRequired,
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default MovieCard;