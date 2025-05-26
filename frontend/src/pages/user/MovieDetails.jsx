import { Button, Modal } from 'antd'
import { React, useState, useEffect } from 'react'
import MovieShowtimes from '../../components/common/MovieShowtimes'
import ShowingMoviesList from '../../components/common/ShowingMoviesList'
import CommentSection from '../../components/common/CommentSection'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/movies/code/${id}`)
        console.log("Movie data from API:", response.data);
        console.log("Movie ID:", response.data.id);
        console.log("Movie Code:", response.data.movieCode);
        setMovie(response.data)
      } catch (error) {
        console.error('Error fetching movie details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMovieDetails()
    }
  }, [id])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // --- State for Expansion ---
  const [isExpanded, setIsExpanded] = useState(false)

  if (loading || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  // --- Configuration for Inline Truncation ---
  const maxLength = 120 // Define max characters before truncating
  const needsTruncation = movie.description?.length > maxLength

  // --- Determine Text to Display ---
  const textToShow = !needsTruncation || isExpanded
    ? movie.description 
    : movie.description?.substring(0, maxLength)

  // --- Handler to Toggle Expansion ---
  const toggleExpand = event => {
    event.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  // Extract YouTube video ID for embed
  const getYouTubeId = url => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const trailerId = getYouTubeId(movie.trailer)

  return (
    <div className='w-full min-h-screen'>
      {/* Hero Section with Background */}
      <div className='w-full h-full bg-cover bg-center relative overflow-hidden pt-20'>
        {/* YouTube Video Background (Embed) */}
        {trailerId && (
          <div className='absolute inset-0 w-full h-full'>
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&loop=1&playlist=${trailerId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
              className='w-full h-full scale-[4] md:scale-[1.5]'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              title={`${movie.title} Trailer`}
            ></iframe>
          </div>
        )}

        {/* Dark Overlay */}
        <div className='absolute inset-0 bg-black opacity-50'></div>

        {/* Content Layer */}
        <div className='relative z-10 h-full flex items-center py-16 justify-center'>
          <div className='flex flex-col md:flex-row gap-8 items-center'>
            {/* Movie Poster */}
            <div className='w-[250px] h-full rounded-lg overflow-hidden shadow-xl'>
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className='w-full h-full object-cover'
              />
            </div>

            {/* Movie Info */}
            <div className='text-white max-w-2xl flex flex-col gap-3 mx-3'>
              <div>
                <h1 className='text-4xl font-bold mb-2'>{movie.title}</h1>
                <div className='flex gap-2 opacity-70'>
                  <div>{movie.releaseDate?.split('-')[0]}</div>
                  &#183;
                  <div>{movie.duration} minutes</div>
                </div>
              </div>
              <div className='flex gap-2 font-bold'>
                <div
                  className='px-1 flex justify-center items-center text-[10px] w-fit text-black font-extrabold'
                  style={{ backgroundColor: '#F5C618' }}
                >
                  IMDb
                </div>
                {movie.rating}
              </div>

              {/* Description with INLINE Read More/Show Less */}
              <p>
                {textToShow}
                {needsTruncation && (
                  <>
                    <span
                      onClick={toggleExpand}
                      className='text-red-500 hover:text-red-300 font-semibold cursor-pointer'
                      role='button'
                      tabIndex={0}
                      onKeyPress={e => e.key === 'Enter' && toggleExpand(e)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? ' Show Less' : '...Read More'}
                    </span>
                  </>
                )}
              </p>

              {/* movie information */}
              <div className='flex gap-3'>
                <div>
                  <div className='opacity-70 text-sm'>Release Date</div>
                  {movie.releaseDate?.split('T')[0]}
                </div>
                <div>
                  <div className='opacity-70 text-sm'>Language</div>
                  <div>{movie.language}</div>
                </div>
                <div>
                  <div className='opacity-70 text-sm'>Categories</div>
                  <div>
                    {movie.genre?.map((genre, index) => (
                      <span key={index} className='py-1 text-sm'>
                        {genre}
                        {index < movie.genre.length - 1 && ','}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Button
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    borderColor: 'red',
                    borderRadius: '5em',
                    fontWeight: 'bold'
                  }}
                  onClick={showModal}
                >
                  Watch trailer
                </Button>
                <Modal
                  title={`${movie.title} Trailer`}
                  centered
                  open={isModalOpen}
                  onCancel={handleCancel}
                  destroyOnClose={true}
                  wrapClassName='responsive-video-modal'
                  footer={null}
                >
                  {trailerId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                      className='w-full aspect-video'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      title={`${movie.title} Trailer`}
                    ></iframe>
                  ) : (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                      Trailer not available for this movie.
                    </p>
                  )}
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap md:flex-row justify-center items-start gap-8 md:mx-20'>
        <div className='flex-shrink-0 w-full md:w-auto'>
          <MovieShowtimes />
          <CommentSection movieId={movie.movieCode} />
        </div>
        <div className='flex-shrink-0 w-full md:w-auto'>
          <ShowingMoviesList />
        </div>
      </div>
    </div>
  )
}
