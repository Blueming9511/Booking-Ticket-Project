import React, { useMemo, useState, useEffect } from 'react';
import DatePicker from '../Showcase/DatePicker';         // Assuming path is correct
import CinemaSelector from '../Showcase/CinemaSelector';     // Assuming path is correct
import { Collapse, Tag, Button, Image, Divider, message, Pagination, Spin } from 'antd'; // Import Image and Divider
import BookingModal from '../Showcase/BookingModal';       // Assuming path is correct
import { getEndTime, getNext7Days } from '../../utils/dateUtils'; // Use correct util import
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  withCredentials: true // Important for CORS with credentials
});

// --- Data ---
// Assuming 'movies' and 'allCinemas' are passed as props or fetched,
// but using the provided constants for this example.



// --- Component ---
// Renamed for clarity if it's specifically for one movie's showtimes
export default function SingleMovieShowtimes({ movieDetails }) {

  console.log("movieDetails: ",movieDetails);
  // --- State ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState('all');
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 5,
    total: 0
  });

  // --- Fetch Showtimes ---
  const fetchShowtimes = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/showtimes/v2', { // Removed trailing slash
        params: {
          page,
          size: pagination.pageSize,
          movie: movieDetails?.title || '',
          status: 'AVAILABLE'
        }
      });
      
      if (response.data) {
        setShowtimes(response.data.content);
        setPagination({
          current: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          total: response.data.totalElements
        });
      }
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      let errorMessage = 'Failed to load showtimes. Please try again later.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || 'Server error occurred.';
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Could not connect to the server. Please check your connection.';
        console.error('Request error:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Initialize Date and Fetch Data ---
  useEffect(() => {
    if (!selectedDate) {
      const today = getNext7Days()[0]?.fullDate;
      if (today) {
        setSelectedDate(today);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (movieDetails?.title) {
      fetchShowtimes(0);
      console.log("movieDetails?.title: ",movieDetails?.title);
    
    }
    
  }, [movieDetails?.title, selectedDate]);

  // --- Extract Single Movie Data ---
  // If this component ALWAYS shows one movie, extract it here.
  // If it might show multiple later, keep iterating over the 'movies' array.
  const movie = movieDetails;

  // --- Handlers ---
  const handleShowtimeSelection = (showtimeSession) => {
    setSelectedShowtime({
      ...showtimeSession,
      movieTitle: movieDetails.title,
      ageLimit: movieDetails.ageLimit,
      duration: showtimeSession.movieDuration
    });
    setIsModalVisible(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrandId(brandId);
  };

  const handlePageChange = (page) => {
    fetchShowtimes(page - 1); // API uses 0-based indexing
  };

  // --- Process Data for Collapse ---
  const collapseItems = useMemo(() => {
    // Exit early if essential data is missing
    if (!selectedDate || !movieDetails || !showtimes.length) return [];

    const groupedByCinema = {};

    // Process showtimes from API
    showtimes.forEach(show => {
      const cinemaId = show.cinemaCode;
      const showDate = new Date(show.startTime).toISOString().split('T')[0];
      
      // Filter by DATE
      if (showDate !== selectedDate) {
        return;
      }

      // Filter by BRAND
      if (selectedBrandId !== 'all' && show.owner !== selectedBrandId) {
        return;
      }

      // Initialize cinema entry if needed
      if (!groupedByCinema[cinemaId]) {
        groupedByCinema[cinemaId] = {
          cinemaInfo: {
            id: cinemaId,
            name: show.cinemaLocation,
            address: show.cinemaLocation,
            brand: show.owner
          },
          sessions: []
        };
      }

      // Add the valid showtime session
      groupedByCinema[cinemaId].sessions.push({
        id: show.id,
        showTimeCode: show.showTimeCode,
        time: new Date(show.startTime).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }),
        endTime: new Date(show.endTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        room: show.screenCode,
        date: showDate,
        availableSeats: show.seats - show.bookedSeats,
        totalSeats: show.seats,
        cinema: cinemaId,
        price: show.price,
        movieDuration: show.movieDuration
      });
    });

    // Transform into Collapse items
    return Object.entries(groupedByCinema)
      .sort(([, a], [, b]) => a.cinemaInfo.name.localeCompare(b.cinemaInfo.name))
      .map(([cinemaId, data]) => {
        const { cinemaInfo, sessions } = data;

        // Skip rendering if there are no sessions for this cinema after filtering
        if (!sessions || sessions.length === 0) {
            return null;
        }

        return {
          key: cinemaId,
          label: (
            <div className='flex justify-start flex-col'>
              <span className='font-semibold text-base'>{cinemaInfo.name}</span>
              <Tag color="blue" className='mt-1 w-fit'>{cinemaInfo.brand}</Tag>
            </div>
          ),
          children: (
            <div className='flex flex-col gap-4 pb-4'>
              {/* Showtimes */}
              <div className='flex-grow'>
                <div className='flex flex-wrap gap-2 justify-start'>
                  {sessions
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((session, index) => (
                      <div key={`${session.id}-${index}`} className='flex flex-col gap-1'>
                        <Button
                          type='default'
                          className='border-primary text-primary hover:!bg-red-100 hover:!text-primary px-3 py-1 text-sm h-auto'
                          onClick={() => handleShowtimeSelection(session)}
                          disabled={session.availableSeats === 0}
                        >
                          <div className='flex flex-col items-center'>
                            <span className='font-medium'>{session.time}</span>
                            <span className='text-xs text-gray-400'>
                              ~ {session.endTime}
                            </span>
                          </div>
                        </Button>
                        <div className='text-center text-xs text-gray-500'>
                          <span>{session.availableSeats}/{session.totalSeats}</span>
                          <div>{(session.price / 1000).toFixed(3)}k VND</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ),
        };
      })
      .filter(item => item !== null); // Filter out null items if a cinema had no valid sessions
  // Dependencies: Re-run when movie data changes OR when filters change
  }, [movieDetails, showtimes, selectedDate, selectedBrandId]); // Depend on the single 'movie' object now

  // Handle case where the movie data itself might be loading or invalid
  if (!movieDetails) {
    return <div className="text-center p-10">Loading movie data...</div>;
  }

  return (
    <div className='my-3 sm:my-5'>
      {/* Header - Show Movie Title */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap mb-4 gap-y-3'>
        <div>
          <h1 className='text-xl sm:text-2xl font-bold'>{movieDetails.title} - Showtimes</h1>
          {movieDetails.duration && (
            <p className='text-sm text-gray-600 mt-1'>Duration: {movieDetails.duration} minutes</p>
          )}
        </div>
      </div>

      <Divider />

      {/* Content Area */}
      <div className='w-full border border-gray-200 bg-white p-3 sm:p-4 rounded-md shadow-sm flex flex-col gap-4 mx-auto max-w-4xl'>
        {/* Filters */}
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
        <CinemaSelector selectedBrand={selectedBrandId} onBrandChange={handleBrandChange} />

        <Divider className="mt-0 mb-2" />

        {/* Collapse Section */}
        <div className='flex flex-col gap-4'>
          <h3 className="text-lg font-semibold">Available Cinemas</h3>
          
          {loading ? (
            <div className='text-center py-8'>
              <Spin size="large" />
              <p className='text-gray-500 mt-2'>Loading showtimes...</p>
            </div>
          ) : error ? (
            <div className='text-center text-red-500 py-6'>
              <p>{error}</p>
              <Button 
                type="primary" 
                onClick={() => fetchShowtimes(pagination.current)}
                className='mt-4'
              >
                Retry
              </Button>
            </div>
          ) : collapseItems.length > 0 ? (
            <>
              <Collapse
                items={collapseItems}
                defaultActiveKey={collapseItems.map(item => item.key)}
                accordion={false}
                bordered={false}
                className='bg-transparent movie-showtime-collapse'
              />
              {pagination.total > pagination.pageSize && (
                <div className='flex justify-center mt-4'>
                  <Pagination
                    current={pagination.current + 1}
                    total={pagination.total}
                    pageSize={pagination.pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <div className='text-center text-gray-500 py-6'>
              No showtimes available for "{movieDetails.title}" on the selected date and cinema brand.
            </div>
          )}
        </div>
      </div>

      {/* --- Booking Modal --- */}
      {isModalVisible && selectedShowtime && (
        <BookingModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedShowtime(null);
          }}
          showtime={selectedShowtime}
        />
      )}
    </div>
  );
}