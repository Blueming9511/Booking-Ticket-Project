import { List, Typography, Rate, Image } from 'antd' // Import necessary components
import React from 'react'
import { StarFilled } from '@ant-design/icons';

const data = [
  {
    id: 1,
    image: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    title: 'Dune: Part Two',
    categories: ['Sci-Fi', 'Adventure', 'Drama'],
    rate: 8.7
  },
  {
    id: 2,
    image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    title: 'Oppenheimer',
    categories: ['Biography', 'Drama', 'History'],
    rate: 8.3
  },
  {
    id: 3,
    image: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    title: 'The Shawshank Redemption',
    categories: ['Drama'],
    rate: 9.3
  },
  {
    id: 4,
    image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    title: 'The Dark Knight',
    categories: ['Action', 'Crime', 'Drama', 'Thriller'],
    rate: 9.0
  },
  {
    id: 5,
    image: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    title: 'Inception',
    categories: ['Action', 'Sci-Fi', 'Adventure', 'Thriller'],
    rate: 8.8
  },
  {
    id: 6,
    image: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    title: 'Forrest Gump',
    categories: ['Comedy', 'Drama', 'Romance'],
    rate: 8.8
  },
  {
    id: 7,
    image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    title: 'Spider-Man: Across the Spider-Verse',
    categories: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    rate: 8.6
  },
  {
    id: 8,
    image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    title: 'Parasite',
    categories: ['Thriller', 'Comedy', 'Drama'],
    rate: 8.5
  },
  {
    id: 9,
    image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    title: 'Pulp Fiction',
    categories: ['Crime', 'Drama'],
    rate: 8.9
  }
]

export default function ShowingMoviesList () {
  return (
    <div className='m-5 w-full'>
      <div className='text-[20px] font-extrabold mb-3'>Now Showing</div>

      <List
        itemLayout='horizontal' // Or "vertical" depending on desired layout
        dataSource={data} // <-- Pass the 'data' array here
        renderItem={(
          item // <-- Use 'renderItem' prop
        ) => (
          <List.Item key={item.id}>
            {' '}
            {/* Use List.Item */}
            <List.Item.Meta
              avatar={
                // Display movie image
                <Image
                  width={60} // Adjust size as needed
                  style={{borderRadius:"5px"}}
                  preview={false} // Disable image preview on click
                  src={item.image}
                  alt={`${item.title} poster`}
                />
              }
              title={<Typography.Text strong>{item.title}</Typography.Text>} // Movie title
              description={
                // Movie categories and rating
                <>
                  <Typography.Text type='secondary'>
                    {item.categories.join(', ')}
                  </Typography.Text>
                  <br />
                  <div className='flex gap-2 font-bold'>
                  <StarFilled style={{ color: '#FCB454' }} />
                    {item.rate}{' '}
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}
