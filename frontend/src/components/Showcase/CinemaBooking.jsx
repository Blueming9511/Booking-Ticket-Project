// src/components/CinemaBooking/CinemaBooking.js
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Select, Divider, Image, Spin, Alert, Tag, message } from 'antd'; // Added message
import DatePicker from './DatePicker'; // Adjust path if needed
import BookingModal from './BookingModal'; // Adjust path if needed
import ShowtimeButtons from '../ShowtimeButtons'; // Adjust path if needed
import { getAgeLimitColor, getNext7Days, formatPrice } from '../../utils/dateUtils'; // Adjust path if needed
import api from '../../utils/api'; // Assuming your API utility

const { Option } = Select;

// --- Helper Function ---
const formatDuration = (minutes) => {
  if (typeof minutes !== 'number' || minutes <= 0) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (remainingMinutes > 0) result += `${remainingMinutes}m`;
  return result.trim() || '';
};
// --- End Helper Function ---

// --- Component ---
// Receives:
// - cinemas: Array of fetched cinema objects (filtered by brand from parent)
// - allShowtimes: Flat array of ALL fetched showtime objects
const CinemaBooking = ({ cinemas = [], allShowtimes = [] }) => {

  
  // --- State ---
  const initialDate = useMemo(() => getNext7Days()[0]?.fullDate || null, []);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null); // Stores cinema *ID* (e.g., "67ef...")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtimeDetails, setSelectedShowtimeDetails] = useState(null);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false); // Loading for fetching movie details
  const [isLoadingFilter, setIsLoadingFilter] = useState(false); // Loading for filtering showtimes step
  const [fetchedMoviesData, setFetchedMoviesData] = useState({}); // Store fetched movies { movieCode: movieDetails }
  const [movieFetchError, setMovieFetchError] = useState(null);
  // -----------------

  // --- Effect to Select Default Cinema ---
  useEffect(() => {
    // This effect ONLY sets the default cinema when the list changes
    if (cinemas && cinemas.length > 0) {
      const currentSelectionStillExists = cinemas.some(c => String(c.id) === String(selectedCinemaId));
      // If no cinema selected, or current selection disappeared from the list, select the first one
      if (!selectedCinemaId || !currentSelectionStillExists) {
        setSelectedCinemaId(String(cinemas[0].id));
      }
    } else {
      // If the cinema list becomes empty, clear selection
      setSelectedCinemaId(null);
    }
  }, [cinemas]); // Dependency: ONLY the list of cinemas
  // --- End Effect ---

  // --- Find Selected Cinema Object (Memoized) ---
  const selectedCinemaObject = useMemo(() => {
    if (!selectedCinemaId || !cinemas || cinemas.length === 0) return null;
    return cinemas.find(c => String(c.id) === String(selectedCinemaId));
  }, [selectedCinemaId, cinemas]);
  // --- End Find ---

  // --- Filtering/Grouping Showtimes (Memoized) ---
  const { movieCodesToShow, showtimesGroupedByMovie, isFiltering } = useMemo(() => {
    // Reset error related to movies when selection changes
    // setMovieFetchError(null); // Do this in the fetch effect instead maybe

    if (!selectedCinemaObject || !selectedDate || !allShowtimes || allShowtimes.length === 0) {
      return { movieCodesToShow: [], showtimesGroupedByMovie: {}, isFiltering: false };
    }
    const selectedCinemaCode = selectedCinemaObject.cinemaCode;
    if (!selectedCinemaCode) {
      return { movieCodesToShow: [], showtimesGroupedByMovie: {}, isFiltering: false };
    }

    const filteredRawShowtimes = allShowtimes.filter(st =>
      st.cinemaCode === selectedCinemaCode &&
      st.date === selectedDate &&
      st.status === 'AVAILABLE' // Filter only available showtimes
    );

    const grouped = filteredRawShowtimes.reduce((acc, showtime) => {
      const movieCode = showtime.movieCode;
      if (!acc[movieCode]) acc[movieCode] = [];
      acc[movieCode].push(showtime);
      acc[movieCode].sort((a, b) => a.startTime.localeCompare(b.startTime));
      return acc;
    }, {});

    return {
      movieCodesToShow: Object.keys(grouped), // Array of movie codes to display
      showtimesGroupedByMovie: grouped,      // Showtimes grouped by movie code
      isFiltering: false                     // Calculation finished
    };
  }, [selectedCinemaObject, selectedDate, allShowtimes]);

  // Effect for managing the filtering loading state indicator
  useEffect(() => {
    setIsLoadingFilter(true);
    const timer = setTimeout(() => { if (!isFiltering) setIsLoadingFilter(false); }, 50); // Show spinner briefly
    return () => clearTimeout(timer);
  }, [selectedCinemaObject, selectedDate, allShowtimes, isFiltering]);
  // --- End Filtering/Grouping ---

  // --- Fetch Movie Details Effect (Based on movieCodesToShow) ---
  useEffect(() => {
    // Define the async function to fetch movie details
    const fetchMovies = async (codesToFetch) => {
      if (codesToFetch.length === 0) {
        setIsLoadingMovies(false); // Nothing to fetch
        return;
      }

      setIsLoadingMovies(true);
      setMovieFetchError(null); // Clear previous movie errors
      console.log("Fetching details for movie codes:", codesToFetch);

      try {
        // Create an array of promises for each API call
        const moviePromises = codesToFetch.map(code =>
          api.get(`/movies/code/${code}`) // ** ADJUST API ENDPOINT AS NEEDED **
             .then(response => {
                 if (response?.data) {
                     return { [code]: response.data }; // Return successful fetch keyed by code
                 }
                 console.warn(`No data received for movie code: ${code}`);
                 return { [code]: null }; // Indicate fetch didn't yield data
             })
             .catch(err => {
                 console.error(`Failed to fetch movie ${code}:`, err);
                 setMovieFetchError(prev => prev ? `${prev}, ${code}`: `Failed to load details for ${code}`); // Append to error message
                 return { [code]: null }; // Indicate failure for this code
             })
        );

        // Wait for all fetches to complete (or fail individually)
        const results = await Promise.all(moviePromises);

        // Combine results, only adding successful fetches to the state
        const newMoviesData = results.reduce((acc, result) => {
             const [code, data] = Object.entries(result)[0];
             if (data) { // Only add if data is not null (i.e., fetch succeeded)
                acc[code] = data;
             }
             return acc;
        }, {}); // Start with empty object for this batch

        // Update state, merging new data with potentially existing data from previous fetches
        // (useful if user quickly changes dates/cinemas)
        setFetchedMoviesData(prevData => ({
            ...prevData,
            ...newMoviesData
        }));

      } catch (err) {
        // Catch errors from Promise.all itself (less likely with individual catches)
        console.error('General error during Promise.all fetching movie details:', err);
        setMovieFetchError('An unexpected error occurred while loading movie details.');
      } finally {
        setIsLoadingMovies(false); // Stop loading state
      }
    };

    // Determine which movie details are actually missing from our cache
    const missingMovieCodes = movieCodesToShow.filter(code => !fetchedMoviesData[code]);

    if (missingMovieCodes.length > 0) {
      fetchMovies(missingMovieCodes); // Fetch only the missing ones
    } else {
      setIsLoadingMovies(false); // All needed movies are already cached
    }

  }, [movieCodesToShow]); // Dependency: Only run when the list of needed movie codes changes
  // --- End Fetch Movie Details ---

  // --- Modal Handling ---
  const handleShowtimeSelection = (clickedShowtime) => {
    const movie = fetchedMoviesData[clickedShowtime.movieCode]; // Get from state
    
    if (!movie || !selectedCinemaObject) {
      message.error("Could not load complete booking details. Movie or Cinema data missing.");
      return;
    }
    const showtimeDetailsForModal = {
        showtimeCode: clickedShowtime.showTimeCode, date: clickedShowtime.date, startTime: clickedShowtime.startTime, endTime: clickedShowtime.endTime, price: clickedShowtime.price, status: clickedShowtime.status, screenCode: clickedShowtime.screenCode,
        movieCode: movie.movieCode, movieTitle: movie.title, duration: movie.duration, ageLimit: movie.ageLimit, poster: movie.thumbnail, // Use movie.thumbnail
        cinemaCode: selectedCinemaObject.cinemaCode, cinemaName: selectedCinemaObject.cinemaName, cinemaLocation: selectedCinemaObject.location, cinemaId: selectedCinemaObject.id,
    };
    setSelectedShowtimeDetails(showtimeDetailsForModal);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedShowtimeDetails(null);
  };

  const handleFinalBookingSuccess = (paidBookingDetails) => {
     console.log('Payment successful, booking confirmed:', paidBookingDetails);
     handleCloseModal();
  };
  // --- End Modal Handling ---

  // --- Render Logic ---
  const noBranchesAvailable = !cinemas || cinemas.length === 0;
  const showLoadingSpinner = isLoadingFilter || isLoadingMovies; // Show if filtering OR fetching movies
  const showNoShowtimesMessage = !isLoadingFilter && !isLoadingMovies && movieCodesToShow.length === 0 && selectedCinemaId;

  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-280px)] max-h-[calc(100vh-280px)] overflow-hidden bg-white rounded-b-lg'>

      {/* --- Sidebar Menu --- */}
      <div className='hidden md:block w-60 lg:w-64 p-2 pr-4 overflow-y-auto border-r border-gray-200 flex-shrink-0 sidebar-scroll'>
         <h2 className='text-sm font-semibold mb-3 px-2 text-gray-600 uppercase'>Cinemas</h2>
         {noBranchesAvailable ? ( <div className="px-2 text-sm text-gray-500 italic">No cinemas found.</div> ) : (
             <Menu mode='vertical' selectedKeys={selectedCinemaId ? [String(selectedCinemaId)] : []} onClick={e => setSelectedCinemaId(e.key)} style={{ borderRight: 0 }} className="cinema-menu">
                 {cinemas.map(cinema => (
                     <Menu.Item key={String(cinema.id)} className="!px-2 !py-2.5 !h-auto !leading-snug">
                         <span className="text-sm font-medium text-gray-800 block">{cinema.cinemaName}</span>
                         <span className="text-xs text-gray-500 block truncate">{cinema.location}</span>
                     </Menu.Item>
                 ))}
             </Menu>
         )}
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-grow flex flex-col overflow-hidden">

        {/* --- Mobile Dropdown & Date Picker --- */}
        <div className='p-3 border-b border-gray-200 flex-shrink-0'>
            {/* Mobile Select */}
             <div className='block md:hidden mb-3'>
                <label htmlFor="cinema-select-mobile" className="block text-sm font-medium text-gray-700 mb-1">Select Cinema Branch:</label>
                {noBranchesAvailable ? ( <div className="text-sm text-gray-500 italic">No cinemas available.</div> ) : (
                    <Select id="cinema-select-mobile" value={selectedCinemaId ? String(selectedCinemaId) : undefined} onChange={value => setSelectedCinemaId(value)} className="w-full" placeholder="Choose a cinema branch">
                      {cinemas.map(cinema => (<Option key={String(cinema.id)} value={String(cinema.id)}>{cinema.cinemaName}</Option>))}
                    </Select>
                )}
            </div>
            {/* Date Picker */}
            <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>

        {/* --- Scrollable Movie List --- */}
        <div className='flex-grow p-3 sm:p-4 overflow-y-auto main-content-scroll relative'>
          {/* Loading Overlay */}
          {showLoadingSpinner && (
              <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
                  <Spin tip="Loading showtimes..."/>
              </div>
          )}
           {/* Error message for movie fetching */}
           {movieFetchError && !isLoadingMovies && ( // Show only if not currently loading movies
              <div className="mb-4"><Alert message="Error Loading Movie Details" description={movieFetchError} type="warning" showIcon closable onClose={()=> setMovieFetchError(null)} /></div>
           )}

          {/* Display Messages or Movie List */}
          {!selectedCinemaId ? (
              <div className="text-center py-10 text-gray-500">Please select a cinema branch.</div>
          ) : movieCodesToShow.length > 0 ? ( // Check if there are any movies to show *after filtering*
            <div className='space-y-4 w-full'>
              {movieCodesToShow.map((movieCode) => {
                 const movie = fetchedMoviesData[movieCode];
                 // Render skeleton if movie data is still loading
                 if (!movie && isLoadingMovies) { // Show skeleton only if actively loading *movies*
                     return ( <div key={movieCode} className='p-3 rounded-lg flex sm:flex-row gap-4 w-full border border-gray-200 bg-white shadow-sm animate-pulse'> <div className='w-24 sm:w-28 h-36 sm:h-40 bg-gray-300 rounded-md'></div><div className='flex-grow space-y-2'><div className="h-5 bg-gray-300 rounded w-3/4"></div><div className="h-4 bg-gray-300 rounded w-1/2"></div><div className="h-10 bg-gray-300 rounded w-full mt-2"></div></div></div> );
                 }
                 // Render nothing if movie data failed to load (or skip this check if you prefer skeletons until success)
                 if (!movie && !isLoadingMovies) {
                     console.warn(`Skipping render for movie code ${movieCode} as details failed to load.`);
                     return null; // Or show a small error card for this specific movie
                 }

                 // Render the actual movie card
                 return (
                    <div key={movie.movieCode} className='p-3 rounded-lg flex flex-col sm:flex-row gap-4 w-full border border-gray-200 hover:border-gray-300 bg-white shadow-sm hover:shadow-md transition-all duration-200'>
                        <div className='w-24 sm:w-28 mx-auto sm:mx-0 h-36 sm:h-40 flex-shrink-0'>
                            <Image src={movie.thumbnail} alt={`${movie.title} poster`} className='object-cover rounded-md w-full h-full' preview={false} placeholder={<div className="w-full h-full bg-gray-200 animate-pulse rounded-md"></div>} />
                        </div>
                        <div className='flex flex-col flex-grow text-center sm:text-left'>
                            <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                                <span className={`text-white text-[10px] font-medium py-0.5 px-1.5 rounded ${getAgeLimitColor(movie.ageLimit)}`}>{movie.ageLimit || 'N/A'}</span>
                                <h3 className='text-base sm:text-lg font-semibold text-gray-900 line-clamp-1'>{movie.title}</h3>
                            </div>
                            <p className='text-gray-500 text-xs sm:text-sm mb-2'>
                                {/* Use movie.genre from fetched data */}
                                {movie.genre?.join(', ')} {' · '} {formatDuration(movie.duration)}
                            </p>
                            <ShowtimeButtons
                                showtimes={showtimesGroupedByMovie[movie.movieCode] || []}
                                handleShowtimeClick={handleShowtimeSelection}
                            />

                        </div>
                    </div>
                 );
               })}
             </div>
            ) : (
              // No showtimes found message (only show if not loading)
              showNoShowtimesMessage && <div className="text-center py-10 text-gray-500">
                 No available showtimes found for <span className="font-medium">{selectedCinemaObject?.cinemaName || 'this cinema'}</span> on <span className="font-medium">{selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-CA') : 'this date'}.</span>
              </div>
            )}
        </div>
      </div>

      {/* --- Booking Modal --- */}
      {selectedShowtimeDetails && (
        <BookingModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          showtime={selectedShowtimeDetails}
        />
      )}
    </div>
  );
};



export default CinemaBooking;