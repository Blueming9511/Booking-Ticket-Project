// src/components/MovieCard.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import { StarFilled  } from '@ant-design/icons'

const { Meta } = Card

const MovieCard = ({ movie, isNowShowing }) => {
  if (!movie || !movie.id || !movie.title || !movie.img) {
    console.warn('Incomplete movie data passed to MovieCard:', movie)
    return null
  }

  const descriptionText = `${movie.categories?.join(', ') || 'Info N/A'}`.trim()
  const ratedText = `${movie.rate ? movie.rate : 'N/A'}`

  return (
    <Card
      className='!bg-transparent !border-none w-full max-w-[240px] overflow-hidden rounded-md'
      // REMOVED deprecated bodyStyle prop
      // ADDED styles prop as recommended by the warning
      styles={{
        body: {
          padding: '10px 0'
        }
      }}
      cover={
        <img
          alt={`${movie.title} poster`}
          src={movie.img}
          className='w-full h-auto object-cover aspect-[2/3] rounded-t-md' // Keep rounding here for the image itself
          loading='lazy'
        />
      }
    >
      <Meta
        title={
          <span
            style={{
              display: 'block',
              color: 'white',
              fontWeight: 'bold',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '14px',
              lineHeight: '20px' /* adjust as needed */
            }}
          >
            {movie.title}
          </span>
        }
        description={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#9CA3AF',
              fontSize: '12px',
              lineHeight: '16px', 
              gap:"0.5em"
            }}
          >
            {descriptionText || 'N/A'}
            <span>
            <StarFilled style={{ color: '#FCB454' }}/> {ratedText} 
            </span>
          </div>
        }
      />
    </Card>
  )
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string),
    rate: PropTypes.string
  }).isRequired
}

export default MovieCard
