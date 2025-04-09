import { Button, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import MovieShowtimes from '../../components/MovieShowtimes'
import ShowingMoviesList from '../../components/ShowingMoviesList'
import { useParams } from 'react-router-dom'
import api from '../../utils/api'

export default function MovieDetails () {
  const { movieID } = useParams()
  const [movieData, setMovieData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [movieShowtimes, setMovieShowtimes] = useState(null)
  const [cinemasShowtimes, setCinemasShowtimes] = useState(null)
  const [allCinemas, setAllCinemas] = useState(null)



  const fallbackImage =
    'https://i.pinimg.com/736x/c1/f6/52/c1f6526d8499d10a45e27cee47281996.jpg'

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(`/movies/code/${movieID}`)
        setMovieData(response.data)
      } catch (error) {
        console.error('Error fetching movies:', error)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchMovieShowtimes = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(
          `/showtimes/movie/${movieData.movieCode}`
        )
        setMovieShowtimes(response.data)
      } catch (error) {
        console.error('Error fetching movies:', error)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    
    const fetchAllCinemas= async () => {
      setIsLoading(true)
      try {
        const response = await api.get(
          `/cinemas`
        )
        setAllCinemas(response.data)
      } catch (error) {
        console.error('Error fetching movies:', error)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }



    if (movieID) {
      fetchMovies()
    }

    if(movieData?.movieCode){
      fetchMovieShowtimes()
    }

    fetchAllCinemas()

  

  }, [movieID, movieData?.movieCode]) 



  useEffect(() => {
    const showtimeCinemaCodes = movieShowtimes?.map(showtime => showtime.cinemaCode);
    const filteredCinemas = allCinemas?.filter(cinema =>
      showtimeCinemaCodes?.includes(cinema.cinemaCode)
    );
    setCinemasShowtimes(filteredCinemas);
  }, [movieShowtimes, allCinemas]);
  
  console.log("this is cinemas within showtimes :", cinemasShowtimes)

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <Spin size='large' />
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!movieData) {
    return <div>Movie Not Found</div>
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const maxLength = 120 // Define max characters before truncating
  const needsTruncation = movieData.description?.length > maxLength // add optional chaining

  const textToShow =
    !needsTruncation || isExpanded
      ? movieData.description
      : movieData.description?.substring(0, maxLength) + '...' // add optional chaining

  const toggleExpand = event => {
    event.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const getYouTubeId = url => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url?.match(regExp) // Add optional chaining
    return match && match[2]?.length === 11 ? match[2] : null // Add optional chaining
  }

  const trailerId = getYouTubeId(movieData.trailer)

  return (
    <div className='w-full min-h-screen '>
      <div className='w-full h-full bg-cover bg-center relative overflow-hidden pt-20 '>
        {/* YouTube Video Background (Embed) */}
        {trailerId ? (
          <div className='absolute inset-0 w-full h-full'>
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&loop=1&playlist=${trailerId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
              className='w-full h-full scale-[4] md:scale-[1.5]' // Note: scale might cause overflow issues, check carefully
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              title={`${movieData.title} Trailer`}
            ></iframe>
          </div>
        ) : (
          <div
            className='absolute inset-0 w-full h-full bg-cover bg-center'
            style={{
              backgroundImage: `url(${fallbackImage})`
            }}
          ></div>
        )}

        {/* Dark Overlay */}
        <div className='absolute inset-0 bg-black opacity-50'></div>

        {/* Content Layer */}
        <div className='relative z-10 h-full flex items-center py-16 justify-center  '>
          <div className='flex flex-col md:flex-row gap-8 items-center'>
            {/* movieData Poster */}
            <div className='w-[250px] h-full rounded-lg overflow-hidden shadow-xl'>
              {' '}
              {/* Added fixed height/overflow */}
              <img
                src={movieData.thumbnail}
                alt={movieData.title}
                className='w-full h-full object-cover'
              />
            </div>

            {/* movieData Info */}
            <div className='text-white max-w-2xl flex flex-col gap-3 mx-3'>
              <div>
                <h1 className='text-4xl font-bold mb-2'>{movieData.title} </h1>
                <div className='flex gap-2 opacity-70'>
                  <div>{movieData.releaseDate.split('-')[0]}</div>
                  &#183;
                  <div>{movieData.duration} minutes</div>
                </div>
              </div>
              <div className='flex gap-2 font-bold'>
                <div
                  className='px-1 flex justify-center items-center text-[10px] w-fit text-black font-extrabold'
                  style={{ backgroundColor: '#F5C618' }}
                >
                  IMDb
                </div>{' '}
                {movieData.rating}
              </div>

              {/* --- Description with INLINE Read More/Show Less --- */}
              <p className=''>
                {textToShow}
                {needsTruncation && (
                  <>
                    {' '}
                    {/* Add space before the link */}
                    <span
                      onClick={toggleExpand}
                      className='text-red-500 hover:text-red-300 font-semibold cursor-pointer' // Adjusted colors for white text bg
                      role='button'
                      tabIndex={0}
                      onKeyPress={e => e.key === 'Enter' && toggleExpand(e)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Show Less' : '...Read More'}
                    </span>
                  </>
                )}
              </p>

              {/* movieData information */}
              <div className='flex gap-3'>
                <div>
                  <div className='opacity-70 text-sm'>Release Date</div>
                  {movieData.releaseDate.split('T')[0]}
                </div>
                <div>
                  <div className='opacity-70 text-sm'>Language</div>
                  <div>{movieData.language}</div>
                </div>
                <div>
                  <div className='opacity-70 text-sm'>Categories</div>
                  <div>
                    {' '}
                    {movieData.genre.map((genre, index) => (
                      <span key={index} className='py-1 text-sm'>
                        {' '}
                        {/* Removed rounded-full for simpler inline look */}
                        {genre}
                        {index < movieData.genre.length - 1 && ','}{' '}
                        {/* Add separator */}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Button
                  style={{
                    backgroundColor: 'red', // Set background color
                    color: 'white', // Set text color
                    borderColor: 'red',
                    borderRadius: '5em',
                    fontWeight: 'bold'
                  }}
                  onClick={showModal}
                >
                  Watch trailer
                </Button>
                <Modal
                  // --- Content & Appearance ---
                  title={`${movieData.title} Trailer`} // 1. Use a specific, dynamic title
                  centered // 2. Vertically center the modal on the screen
                  open={isModalOpen}
                  onCancel={handleCancel} // Close on clicking 'X' or outside
                  destroyOnClose={true} // 3. **Crucial**: Remove iframe from DOM on close (stops video)
                  // --- Apply Custom Class ---
                  wrapClassName='responsive-video-modal' // <-- ADD THIS
                  // --- Footer ---
                  footer={null} // 5. Remove default OK/Cancel buttons (cleaner for video)

                  // --- Styling for the content area (optional) ---
                  // bodyStyle={{ padding: 0 }} // 6. Optional: Uncomment for edge-to-edge video (removes internal padding)
                >
                  {/* 7. Conditionally render iframe only if trailerId exists */}
                  {trailerId ? (
                    <iframe
                      // Updated YouTube params: enable controls, disable related videos
                      src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                      // 8. Use aspect ratio for responsive video sizing
                      className='w-full aspect-video' // Tailwind class for 16:9 aspect ratio
                      // Alternative inline style: style={{ width: '100%', aspectRatio: '16 / 9' }}
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      title={`${movieData.title} Trailer`} // Keep title for accessibility
                    ></iframe>
                  ) : (
                    // 9. Provide fallback content if trailer isn't available
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
          <MovieShowtimes movieData={movieData} showtimesData={movieShowtimes} CinemasData={cinemasShowtimes}/>
        </div>
        <div className='flex-shrink-0 w-full md:w-auto'>
          <ShowingMoviesList />
        </div>
      </div>
    </div>
  )
}
