import React, { useState, useEffect } from 'react'
import MovieCarousel from '../../components/common/Carousel'
import PaginatedMovieList from '../../components/common/PaginatedMovieList'
import axios from 'axios'
import { Spin } from 'antd'

export default function MoviePage() {
  const [nowShowingMovies, setNowShowingMovies] = useState([])
  const [allMovies, setAllMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch movies with NOW_SHOWING status for carousel
        const nowShowingResponse = await axios.get(`${API_URL}/movies`, {
          params: {
            page: 0,
            size: 10,
            status: 'NOW_SHOWING'
          }
        })
        

        // Fetch all movies for the paginated list
        const allMoviesResponse = await axios.get(`${API_URL}/movies`, {
          params: {
            page: 0,
            size: 100 // Adjust size as needed
          }
        })

        // Transform the data to match the expected format
        const transformMovie = (movie) => ({
          id: movie.movieCode,
          title: movie.title,
          img: movie.thumbnail,
          categories: movie.genre,
          rate: movie.rating?.toString(),
          description: movie.description,
          trailer: movie.trailer
        })

        setNowShowingMovies(nowShowingResponse.data.content.map(transformMovie))
        setAllMovies(allMoviesResponse.data.content.map(transformMovie))
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className='mb-10'>
      {/* Now showing */}
      <div className='bg-black pt-20 pb-10'>
        <h2 className='text-2xl text-white text-center font-bold mb-4'>
          Now Showing
        </h2>
        <div className='flex justify-center items-center w-full'>
          <MovieCarousel movies={nowShowingMovies} />
        </div>
      </div>

      {/* Movie list */}
      <div className='w-full flex flex-col justify-center items-center mt-5'>
        <div className='max-w-[1100px] w-full'>
          <PaginatedMovieList moviesData={allMovies} itemsPerPage={12} />
        </div>
      </div>
    </div>
  )
}
