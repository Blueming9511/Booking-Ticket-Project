import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
// Assuming component paths are correct
import DatePicker from './Showcase/DatePicker';
import CinemaSelector from './Showcase/CinemaSelector';
import BookingModal from './Showcase/BookingModal';
import { Collapse, Tag, Button, Divider, message } from 'antd'; // Removed unused Image, added message
// Assuming util path is correct
import { getEndTime, getNext7Days, getAgeLimitColor, formatPrice } from '../utils/dateUtils';

// --- Default Props ---
const defaultMovie = { title: 'Movie', duration: 0, ageLimit: 'N/A' };
const defaultShowtimes = [];
const defaultCinemas = [];

// --- Component ---
// Accepts movieData, showtimesData, and CinemasData as props
export default function SingleMovieShowtimes({
  movieData = defaultMovie,      // Use the movieData prop
  showtimesData = defaultShowtimes, // Use the showtimesData prop
  CinemasData = defaultCinemas,   // Use the CinemasData prop
}) {
  console.log("this is showtimes data ---- : ", showtimesData);
  

  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [selectedShowtimeForBooking, setSelectedShowtimeForBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState('all');

  // --- Memoized Cinema Map ---
  // Create map from the CinemasData prop using cinemaCode as the key
  const cinemaBranchMap = useMemo(() => {
    if (!CinemasData || !Array.isArray(CinemasData)) return {};
    return CinemasData.reduce((acc, cinema) => {
      if (cinema && cinema.cinemaCode) {
        acc[cinema.cinemaCode] = cinema; // Key is cinemaCode
      } else {
        console.warn("Cinema object missing cinemaCode:", cinema);
      }
      return acc;
    }, {});
  }, [CinemasData]); // Depends on CinemasData prop

  // --- Initialize Date ---
  useEffect(() => {
    if (!selectedDate) {
      const today = getNext7Days()[0]?.fullDate;
      if (today) {
        setSelectedDate(today);
      }
    }
  }, [selectedDate]);

  // --- Handlers ---
  const handleShowtimeSelection = (showtimeSession) => {
    // Find cinema details using cinemaCode from the clicked showtime
    const cinemaInfo = cinemaBranchMap[showtimeSession.cinemaCode];

    // Use movieData prop here
    if (!movieData || !movieData.movieCode || !cinemaInfo || !cinemaInfo.cinemaCode || !showtimeSession) {
      message.error("Cannot load booking details - essential data missing.");
      console.error("Missing data for booking:", { movieData, cinemaInfo, showtimeSession });
      return;
    }

    // Prepare data for BookingModal using props and found cinemaInfo
    const bookingShowtimeDetails = {
      showtimeCode: showtimeSession.showTimeCode || null,
      date: showtimeSession.date,
      startTime: showtimeSession.startTime,
      endTime: showtimeSession.endTime || getEndTime(showtimeSession.startTime, movieData.duration), // Use movieData.duration
      price: showtimeSession.price || 0,
      status: showtimeSession.status || 'UNAVAILABLE',
      screenCode: showtimeSession.screenCode,

      movieCode: movieData.movieCode,
      movieTitle: movieData.title,
      duration: movieData.duration,
      ageLimit: movieData.ageLimit, // Get ageLimit from movieData if available
      poster: movieData.poster || movieData.thumbnail,

      cinemaCode: cinemaInfo.cinemaCode,
      cinemaName: cinemaInfo.cinemaName, // Use correct field name from example
      cinemaLocation: cinemaInfo.location, // Use correct field name from example
      cinemaId: cinemaInfo.id,
    };

    setSelectedShowtimeForBooking(bookingShowtimeDetails);
    setIsBookingModalVisible(true);
  };

  const handleModalClose = () => {
    setIsBookingModalVisible(false);
    setSelectedShowtimeForBooking(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrandId(brandId);
  };

  // --- Process Data for Collapse ---
  const collapseItems = useMemo(() => {
    // Use props in guard clauses
    if (!selectedDate || !movieData || !showtimesData || !Array.isArray(showtimesData) || showtimesData.length === 0 || !Object.keys(cinemaBranchMap).length) {
      return [];
    }

    const groupedByCinema = {};

    // Iterate over the showtimesData prop
    showtimesData.forEach(show => {
      if (!show) return;

      if (show.date !== selectedDate) return;

      const cinemaCode = show.cinemaCode;
      const cinemaInfo = cinemaBranchMap[cinemaCode];

      // Use cinemaInfo.owner for brand check (based on example cinema data)
      if (!cinemaInfo || (selectedBrandId !== 'all' && cinemaInfo.owner?.toLowerCase() !== selectedBrandId?.toLowerCase())) return;

      if (!groupedByCinema[cinemaCode]) {
        groupedByCinema[cinemaCode] = {
          cinemaInfo: cinemaInfo,
          sessions: []
        };
      }
      // Add the full showtime object from showtimesData
      groupedByCinema[cinemaCode].sessions.push(show);
    });

    // Transform into Collapse items
    return Object.entries(groupedByCinema)
      .sort(([, a], [, b]) => a.cinemaInfo.cinemaName.localeCompare(b.cinemaInfo.cinemaName))
      .map(([cinemaCode, data]) => {
        const { cinemaInfo, sessions } = data;
        const sortedSessions = sessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
        if (!sortedSessions.length) return null;

        return {
          key: cinemaCode,
          label: (
            <div className='flex flex-col justify-start'>
              <span className='font-semibold text-base'>{cinemaInfo.cinemaName}</span>
              {/* Use location field from example cinema data */}
              <span className='text-xs text-gray-500'>{cinemaInfo.location || 'Address not available'}</span>
            </div>
          ),
          children: (
            <div className='flex flex-wrap gap-2 pb-2 justify-start'>
              {sortedSessions.map((session) => (
                <Button
                  key={session.showTimeCode || `${cinemaCode}-${session.startTime}`}
                  type='default'
                  // Use standard Tailwind for Red/White theme
                  className='border-red-500 text-red-600 hover:!bg-red-50 px-3 py-1 text-sm h-auto'
                  onClick={() => handleShowtimeSelection(session)}
                  disabled={session.status !== 'AVAILABLE'}
                >
                  {session.startTime}
                  {/* Use movieData.duration for calculating end time */}
                  <span className='ml-1 text-xs text-gray-400'>
                    ~ {session.endTime || getEndTime(session.startTime, movieData.duration)}
                  </span>
                </Button>
              ))}
            </div>
          ),
        };
      })
      .filter(item => item !== null);

  // Dependencies updated to use props and map
  }, [movieData, showtimesData, selectedDate, selectedBrandId, cinemaBranchMap]); // Removed allCinemas, added showtimesData

  // --- Calculate Available Brands for CinemaSelector ---
  const availableBrandsForSelector = useMemo(() => {
    // Use props in guard clauses
    if (!showtimesData || !Array.isArray(showtimesData) || !selectedDate || !CinemasData || !Array.isArray(CinemasData)) return [];

    const brandsOnDate = new Set();
    // Use CinemasData prop
    const cinemaCodeToBrandMap = CinemasData.reduce((map, c) => {
        // Use 'owner' field for brand based on example cinema data
        if(c && c.cinemaCode && c.owner) map[c.cinemaCode] = c.owner;
        return map;
    }, {});

    // Use showtimesData prop
    showtimesData.forEach(st => {
        if (st && st.date === selectedDate && cinemaCodeToBrandMap[st.cinemaCode]) {
            brandsOnDate.add(cinemaCodeToBrandMap[st.cinemaCode].toLowerCase()); // Store lowercase brand
        }
    });
    return Array.from(brandsOnDate);
  }, [showtimesData, selectedDate, CinemasData]); // Use props as dependencies


  // --- Render Logic ---
  // Use movieData prop for checks and display
  if (!movieData || !movieData.movieCode) {
      return <div className="p-10 text-center text-gray-500">Movie data is loading or missing...</div>;
  }

  return (
    <div className='m-3 sm:m-5'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-3 mb-4'>
          <div className='flex items-center gap-3'>
              {/* Use movieData prop */}
              {movieData.ageLimit && <Tag color={getAgeLimitColor(movieData.ageLimit, true)}>{movieData.ageLimit}</Tag>}
              {/* Use movieData prop */}
              <h1 className='text-xl font-bold sm:text-2xl'>{movieData.title} - Showtimes</h1>
          </div>
      </div>

      <Divider className="!mb-4" />

      {/* Content Area */}
      <div className='mx-auto flex max-w-4xl flex-col gap-4 rounded-md border border-gray-200 bg-white p-3 shadow-sm sm:p-4'>
        {/* Filters */}
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
        <CinemaSelector
            selectedBrand={selectedBrandId}
            onBrandChange={handleBrandChange}
            // Pass the CinemasData prop
            cinemas={CinemasData}
            // Pass the calculated available brands
            availableBrands={availableBrandsForSelector}
        />

        <Divider className="mb-2 mt-0" />

        {/* Collapse Section */}
        <h3 className="mb-2 text-lg font-semibold">Available Cinemas & Showtimes</h3>
        {/* Check props before rendering collapse */}
        {(showtimesData && Array.isArray(showtimesData) && CinemasData && Array.isArray(CinemasData) && Object.keys(cinemaBranchMap).length > 0) ? (
           collapseItems.length > 0 ? (
            <Collapse
                items={collapseItems}
                defaultActiveKey={collapseItems.length > 0 ? [collapseItems[0].key] : []}
                accordion={false}
                bordered={true}
                className='movie-showtime-collapse bg-white'
            />
            ) : (
            // Message uses movieData prop
            <div className='py-6 text-center text-gray-500'>
                No showtimes available for "{movieData.title}" matching your selection
                {selectedDate && ` on ${new Date(selectedDate+'T00:00:00').toLocaleDateString()}`}
                {selectedBrandId !== 'all' && ` for the selected brand`}.
            </div>
            )
        ) : (
            <div className='py-6 text-center text-gray-400'>Loading showtime and cinema data...</div>
        )}
      </div>

      {/* --- Booking Modal --- */}
      {isBookingModalVisible && selectedShowtimeForBooking && (
        <BookingModal
          visible={isBookingModalVisible}
          onClose={handleModalClose}
          showtime={selectedShowtimeForBooking} // Pass correctly structured data
        />
      )}
    </div>
  );
}

// --- PropTypes ---
SingleMovieShowtimes.propTypes = {
    // Use the prop names defined in the function signature
    movieData: PropTypes.shape({
        movieCode: PropTypes.string,
        title: PropTypes.string,
        poster: PropTypes.string,
        thumbnail: PropTypes.string,
        duration: PropTypes.number,
        ageLimit: PropTypes.string,
        // Add other fields from your movie data example if needed
    }),
    showtimesData: PropTypes.arrayOf(PropTypes.shape({
        showTimeCode: PropTypes.string,
        date: PropTypes.string.isRequired,
        startTime: PropTypes.string.isRequired,
        endTime: PropTypes.string,
        price: PropTypes.number,
        cinemaCode: PropTypes.string.isRequired,
        screenCode: PropTypes.string,
        status: PropTypes.string,
    })),
    CinemasData: PropTypes.arrayOf(PropTypes.shape({ // Use the prop name
        id: PropTypes.string,
        cinemaCode: PropTypes.string.isRequired,
        cinemaName: PropTypes.string.isRequired,
        owner: PropTypes.string, // Use 'owner' for brand based on example
        brand: PropTypes.string, // Keep 'brand' if CinemaSelector expects it
        location: PropTypes.string, // Use 'location' for address based on example
        address: PropTypes.string, // Keep 'address' if needed elsewhere
    }))
};