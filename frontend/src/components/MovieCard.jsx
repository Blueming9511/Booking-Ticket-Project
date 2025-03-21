import React from 'react'
import { Card } from 'antd'

const { Meta } = Card

const MovieCard = ({ movie }) => {
  return (
    <Card
      hoverable
      style={{
        width: 240,
        backgroundColor: 'transparent',
        border: 'none',
      }}
      bodyStyle={{
        padding: '12px', // Adjust padding as needed
      }}
      cover={<img alt='example' src={movie.img} />}
    >
      <Meta
        title={<span style={{ color: 'white' }}>{movie.Name}</span>}
        description={
          <span style={{ color: 'lightgray' }}>
            {movie.categories.join(', ')}
          </span>
        }
      />
    </Card>
  )
}

export default MovieCard
