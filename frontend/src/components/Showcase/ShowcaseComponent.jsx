// src/components/ShowcaseComponent/ShowcaseComponent.js
import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types' // Import PropTypes for CinemaSelector
import { Divider, Spin, Alert } from 'antd' // <-- Import Spin and Alert
import LocationSelector from './LocationSelector' // Adjust path if needed
import CinemaSelector from './CinemaSelector' // Adjust path if needed
import CinemaBooking from './CinemaBooking' // Adjust path if needed
import api from '../../utils/api' // Adjust path if needed

// --- Movie Data (Static Example - Fetch movies separately in a real app) ---
// IMPORTANT: Ensure the cinemaId values below match potential 'id' values
// from your fetched cinema data, or adapt CinemaBooking to use cinemaCode.
const movies = [
  {
    id: '1',
    title: 'Nhà Gia Tiên',
    poster:
      'https://www.cgv.vn/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/p/o/poster_nha_gia_tien_240x350.jpg',
    duration: 102,
    categories: ['Horror', 'Thriller'],
    ageLimit: '18+',
    showtimes: [
      // Example: Link showtimes to fetched cinema IDs (or use cinemaCode if unique)
      {
        cinemaId: '67ef4c4de21d8829e5c0d4df',
        room: 'Room A',
        date: '2025-04-01',
        time: '17:25',
        seats: {
          /*...*/
        }
      }, // CGV NVL
      {
        cinemaId: '67ef4c4de21d8829e5c0d4e7',
        room: 'Room B',
        date: '2025-04-01',
        time: '19:00',
        seats: {
          /*...*/
        }
      }, // CGV Aeon Mall Tân Phú
      {
        cinemaId: '67ef4c4de21d8829e5c0d4df',
        room: 'Room A',
        date: '2025-04-02',
        time: '20:00',
        seats: {
          /*...*/
        }
      } // CGV NVL
      // { cinemaId: 'lotte-id-example', room: 'Room L1', date: '2025-04-01', time: '18:00', seats: { /*...*/ } }, // Lotte example
      // { cinemaId: 'galaxy-id-example', room: 'Room G1', date: '2025-04-01', time: '19:30', seats: { /*...*/ } }, // Galaxy example
    ]
  },
  // --- Add other movie objects here ---
  // Ensure their showtimes also reference valid cinema IDs from fetched data
  {
    id: '3',
    title: 'Dune: Part Two',
    poster:
      'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
    duration: 166,
    categories: ['Sci-Fi', 'Adventure', 'Drama'],
    ageLimit: 'K',
    showtimes: [
      {
        cinemaId: '67ef4c4de21d8829e5c0d4e4',
        room: 'Room E',
        date: '2025-04-10',
        time: '18:30',
        seats: {
          /*...*/
        }
      }, // CGV Pandora City
      {
        cinemaId: '67ef4c4de21d8829e5c0d4e5',
        room: 'Room F',
        date: '2025-04-10',
        time: '16:30',
        seats: {
          /*...*/
        }
      } // CGV Hoàng Văn Thụ
    ]
  }
]
// --- End Movie Data ---

// --- Component Definition ---
const ShowcaseComponent = () => {
  // --- State ---
  const [fetchedCinemas, setFetchedCinemas] = useState([])
  const [allShowtimes, setAllShowtimes] = useState([]) // <-- State for fetched showtimes
  const [isLoadingCinemas, setIsLoadingCinemas] = useState(true)
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(true) // <-- Separate loading state
  const [error, setError] = useState(null) // Combined error state for simplicity, or could be separate
  const [selectedBrand, setSelectedBrand] = useState('all')

  // ----------------

  useEffect(() => {
    const fetchData = async () => {
      // Reset states before fetching
      setIsLoadingCinemas(true)
      setIsLoadingShowtimes(true)
      setError(null)

      try {
        // Use Promise.all to fetch in parallel
        const [cinemasResponse, showtimesResponse] = await Promise.all([
          api.get('/cinemas'),
          api.get('/showtimes') // Fetch showtimes from the endpoint
        ])

        // Process Cinemas
        if (cinemasResponse?.data && Array.isArray(cinemasResponse.data)) {
          console.log('Fetched cinemas:', cinemasResponse.data)
          setFetchedCinemas(cinemasResponse.data)
        } else {
          console.error(
            'Invalid data format for cinemas:',
            cinemasResponse?.data
          )
          throw new Error('Received invalid data format for cinemas.') // Throw error to be caught
        }
        setIsLoadingCinemas(false) // Cinemas loaded

        // Process Showtimes
        if (showtimesResponse?.data && Array.isArray(showtimesResponse.data)) {
          console.log('Fetched showtimes:', showtimesResponse.data)
          setAllShowtimes(showtimesResponse.data)
          console.log(showtimesResponse.data);
          
        } else {
          console.error(
            'Invalid data format for showtimes:',
            showtimesResponse?.data
          )
          throw new Error('Received invalid data format for showtimes.') // Throw error
        }
        setIsLoadingShowtimes(false) // Showtimes loaded
      } catch (err) {
        console.error('Error fetching data:', err)
        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to fetch required data.'
        setError(message)
        // Ensure loading states are set to false even on error
        setIsLoadingCinemas(false)
        setIsLoadingShowtimes(false)
      }
    }

    fetchData()
  }, []) // Runs once on mount

  // --- Memoized Calculations ---
  // Extract unique available brands from fetched data
  const availableBrands = useMemo(() => {
    if (!fetchedCinemas) return []
    const owners = fetchedCinemas.map(cinema => cinema.owner).filter(Boolean)
    return [...new Set(owners)] // Get unique owner strings
  }, [fetchedCinemas])

  // Filter cinemas based on the selected brand
  const filteredCinemas = useMemo(() => {
    if (!fetchedCinemas || fetchedCinemas.length === 0) return []
    if (selectedBrand === 'all') return fetchedCinemas
    return fetchedCinemas.filter(
      cinema => cinema.owner?.toLowerCase() === selectedBrand?.toLowerCase()
    )
  }, [fetchedCinemas, selectedBrand])
  // --- End Memoized Calculations ---

  // Handler for changing the brand
  const handleBrandChange = brandId => {
    setSelectedBrand(brandId)
    // Maybe reset location/date selection here if desired?
  }

  // --- Render Content Logic ---
  const renderShowcaseContent = () => {
    // 1. Combined Loading State
    if (isLoadingCinemas || isLoadingShowtimes) {
      return (
        <div className='flex justify-center items-center h-40'>
          <Spin size='large' tip='Loading data...' />
        </div>
      )
    }

    // 2. Error State
    if (error) {
      return (
        <div className='p-5'>
          <Alert
            message='Error Loading Cinemas'
            description={error} // Show the error message string
            type='error'
            showIcon
            closable
            onClose={() => setError(null)} // Allow dismissing error
          />
        </div>
      )
    }

    // 3. No Data State
    if (!fetchedCinemas || fetchedCinemas.length === 0) {
      return (
        <div className='p-5 text-center text-gray-500'>
          No cinema information is currently available. Please check back later.
        </div>
      )
    }

    // 4. Success State - Render the main showcase content
    return (
      <>
        {/* Location Selector */}
        <div className='location flex flex-wrap gap-2 items-center flex-shrink-0 mb-3'>
          <span className='font-medium text-gray-700'>Location:</span>
          <LocationSelector /> {/* Assuming it works independently */}
        </div>

        {/* Cinema Brand Selector */}
        <div className='flex-shrink-0 mb-3'>
          <span className='font-medium text-gray-700 block mb-2'>
            Cinema Brand:
          </span>
          <CinemaSelector
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandChange}
            availableBrands={availableBrands} // <-- Pass the extracted brands
          />
        </div>

        <Divider className='m-0 flex-shrink-0' />

        {/* Cinema Booking Area */}
        {/* Ensure CinemaBooking uses the correct properties from filteredCinemas */}
        {/* e.g., cinema.id, cinema.cinemaName, etc. */}
        <CinemaBooking
          movies={movies}
          cinemas={filteredCinemas}
          allShowtimes={allShowtimes} // <-- Pass the fetched showtimes
        />
      </>
    )
  }
  // --- End Render Content Logic ---

  return (
    // Main container structure - Added padding
    <div className='center flex-col text-primary min-h-screen flex bg-gray-50 p-4'>
      <h1 className='text-2xl sm:text-3xl font-extrabold my-4 sm:my-6 flex-shrink-0 text-gray-800'>
        SHOWTIMES
      </h1>

      {/* Showcase Box */}
      <div className='showcase flex-grow rounded-lg p-3 sm:p-5 flex flex-col gap-3 border border-gray-200 shadow-lg bg-white w-full max-w-7xl mx-auto overflow-hidden'>
        {/* Render content based on loading/error state */}
        {renderShowcaseContent()}
      </div>
    </div>
  )
}

// Add PropTypes if needed for ShowcaseComponent props (if any are added later)
// ShowcaseComponent.propTypes = { ... };

export default ShowcaseComponent
