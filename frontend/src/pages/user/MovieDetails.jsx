import { Button, Modal, Table } from 'antd'
import { React, useState } from 'react' // No {} needed for React import
import MovieShowtimes from '../../components/common/MovieShowtimes'
import ShowingMoviesList from '../../components/common/ShowingMoviesList'

const movie = {
  thumbnail:
    'https://upload.wikimedia.org/wikipedia/vi/9/94/Dune_2_VN_poster.jpg?20240223020023',
  title: 'Dune: Part Two',
  genre: ['Sci-Fi', 'Adventure', 'Drama'],
  releaseYear: 2024,
  director: 'Denis Villeneuve',
  rating: 8.7,
  duration: 166,
  language: 'English',
  country: 'USA',
  budget: 190000000,
  boxOffice: 700000000,
  casts: [
    'Timothée Chalamet',
    'Zendaya',
    'Rebecca Ferguson',
    'Javier Bardem',
    'Austin Butler'
  ],
  releasedBy: 'CGV',
  releaseDate: '2024-03-01T00:00:00Z',
  endDate: '2024-06-15T00:00:00Z',
  status: 'In Theaters',
  description:
    'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
  trailer: 'https://www.youtube.com/watch?v=Way9Dexny3w',
  ageLimit: 'K',
  showtimes: [
    {
      cinema: 'cgv-aeon',
      room: 'Room E',
      date: '2025-04-01', // Added date property
      time: '18:30',
      seats: {
        total: 120,
        types: {
          Standard: { price: 110000, available: 60 },
          VIP: { price: 170000, available: 40 },
          Couple: { price: 260000, available: 20 }
        },
        bookedSeats: ['C2', 'C5', 'D6']
      }
    },
    {
      cinema: 'cgv-ocean-park',
      room: 'Room F',
      date: '2025-04-01', // Added date property
      time: '16:30',
      seats: {
        total: 100,
        types: {
          Standard: { price: 90000, available: 50 },
          VIP: { price: 140000, available: 50 }
        },
        bookedSeats: ['B4', 'B5', 'C6']
      }
    }
  ]
}

export default function MovieDetails () {
  // handle modal trailer
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  // --- Configuration for Inline Truncation ---
  const maxLength = 120 // Define max characters before truncating
  const needsTruncation = movie.description.length > maxLength

  // --- Determine Text to Display ---
  const textToShow =
    !needsTruncation || isExpanded
      ? movie.description // Show full text if not needed or expanded
      : movie.description.substring(0, maxLength) // Show truncated text + ellipsis

  // --- Handler to Toggle Expansion ---
  const toggleExpand = event => {
    // Prevent click event from bubbling up if this component is nested
    event.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  // Extract YouTube video ID for embed
  const getYouTubeId = url => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const trailerId = getYouTubeId(movie.trailer)

  return (
    <div className='w-full min-h-screen '>
      {/* Hero Section with Background */}
      <div className='w-full h-full bg-cover bg-center relative overflow-hidden pt-20 '>
        {/* YouTube Video Background (Embed) */}
        {trailerId && (
          <div className='absolute inset-0 w-full h-full'>
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&loop=1&playlist=${trailerId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
              className='w-full h-full scale-[4] md:scale-[1.5]' // Note: scale might cause overflow issues, check carefully
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              title={`${movie.title} Trailer`}
            ></iframe>
          </div>
        )}

        {/* Dark Overlay */}
        <div className='absolute inset-0 bg-black opacity-50'></div>

        {/* Content Layer */}
        <div className='relative z-10 h-full flex items-center py-16 justify-center  '>
          <div className='flex flex-col md:flex-row gap-8 items-center'>
            {/* Movie Poster */}
            <div className='w-[250px] h-full rounded-lg overflow-hidden shadow-xl'>
              {' '}
              {/* Added fixed height/overflow */}
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className='w-full h-full object-cover'
              />
            </div>

            {/* Movie Info */}
            <div className='text-white max-w-2xl flex flex-col gap-3 mx-3'>
              <div>
                <h1 className='text-4xl font-bold mb-2'>{movie.title} </h1>
                <div className='flex gap-2 opacity-70'>
                  <div>{movie.releaseDate.split('-')[0]}</div>
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
                </div>{' '}
                {movie.rating}
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

              {/* movie information */}
              <div className='flex gap-3'>
                <div>
                  <div className='opacity-70 text-sm'>Release Date</div>
                  {movie.releaseDate.split('T')[0]}
                </div>
                <div>
                  <div className='opacity-70 text-sm'>Language</div>
                  <div>{movie.language}</div>
                </div>
                <div>
                  <div className='opacity-70 text-sm'>Categories</div>
                  <div>
                    {' '}
                    {movie.genre.map((genre, index) => (
                      <span key={index} className='py-1 text-sm'>
                        {' '}
                        {/* Removed rounded-full for simpler inline look */}
                        {genre}
                        {index < movie.genre.length - 1 && ','}{' '}
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
                  title={`${movie.title} Trailer`} // 1. Use a specific, dynamic title
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
                      title={`${movie.title} Trailer`} // Keep title for accessibility
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
        {/* Optional: Add width constraints if needed */}
        <div className='flex-shrink-0 w-full md:w-auto'>
          <MovieShowtimes />
        </div>
        <div className='flex-shrink-0 w-full md:w-auto'>
          {' '}
          <ShowingMoviesList />
        </div>
      </div>
    </div>
  )
}
