import React, { useMemo, useState, useEffect } from 'react';
import LocationSelector from './Showcase/LocationSelector'; // Assuming path is correct
import DatePicker from './Showcase/DatePicker';         // Assuming path is correct
import CinemaSelector from './Showcase/CinemaSelector';     // Assuming path is correct
import { Collapse, Tag, Button, Image, Divider } from 'antd'; // Import Image and Divider
import BookingModal from './Showcase/BookingModal';       // Assuming path is correct
import { getEndTime, getNext7Days } from '../utils/dateUtils'; // Use correct util import

// --- Data ---
// Assuming 'movies' and 'allCinemas' are passed as props or fetched,
// but using the provided constants for this example.

// Cinema BRANCHES Data
const allCinemas = [
    // ... (keep the full allCinemas array from your provided code) ...
      // CGV branches
    { id: 'cgv-aeon', name: 'CGV Aeon Long Biên', brand: 'cgv', address: 'Tầng 3, Aeon Mall Long Biên, Hà Nội' },
    { id: 'cgv-xuan-dieu', name: 'CGV Xuân Diệu', brand: 'cgv', address: 'Tầng 5, Syrena Tower, 51 Xuân Diệu, Tây Hồ, Hà Nội' },
    { id: 'cgv-tran-duy-hung', name: 'CGV Trần Duy Hưng', brand: 'cgv', address: 'Tầng 3, Vincom Trần Duy Hưng, Cầu Giấy, Hà Nội' },
    { id: 'cgv-lieu-giai', name: 'CGV Liễu Giai', brand: 'cgv', address: 'Tầng hầm B1, Vincom Center Metropolis, 29 Liễu Giai, Ba Đình, Hà Nội' },
    { id: 'cgv-long-bien', name: 'CGV Long Biên', brand: 'cgv', address: 'Tầng 4, Savico Megamall, 7-9 Nguyễn Văn Linh, Long Biên, Hà Nội' },
    { id: 'cgv-ocean-park', name: 'CGV Ocean Park', brand: 'cgv', address: 'Tầng 4, Vincom Mega Mall Ocean Park, Gia Lâm, Hà Nội' },
    { id: 'cgv-vincom-ba-trieu', name: 'CGV Vincom Bà Triệu', brand: 'cgv', address: 'Tầng 6, Vincom Center Bà Triệu, 191 Bà Triệu, Hai Bà Trưng, Hà Nội' },
    { id: 'cgv-vincom-nguyen-chi-thanh', name: 'CGV Vincom Nguyễn Chí Thanh', brand: 'cgv', address: 'Tầng 5, Vincom Center Nguyễn Chí Thanh, 54A Nguyễn Chí Thanh, Đống Đa, Hà Nội' },

    // Lotte branches
    { id: 'lotte-cau-giay', name: 'Lotte Cầu Giấy', brand: 'lotte', address: 'Tầng 5, Lotte Center, 54 Liễu Giai, Ba Đình, Hà Nội' },
    { id: 'lotte-thang-long', name: 'Lotte Thăng Long', brand: 'lotte', address: 'Tầng 3, Big C Thăng Long, 222 Trần Duy Hưng, Cầu Giấy, Hà Nội' },
    { id: 'lotte-my-dinh', name: 'Lotte Mỹ Đình', brand: 'lotte', address: 'Tầng 3, The Garden Shopping Center, Mễ Trì, Nam Từ Liêm, Hà Nội' },

    // Galaxy branches
    { id: 'galaxy-quang-trung', name: 'Galaxy Quang Trung', brand: 'galaxy', address: 'Lầu 3, CoopMart Foodcosa, 304A Quang Trung, P. 11, Q. Gò Vấp, TPHCM' },
    { id: 'galaxy-kinh-duong-vuong', name: 'Galaxy Kinh Dương Vương', brand: 'galaxy', address: '718bis Kinh Dương Vương, P. 13, Q. 6, TPHCM' },
    { id: 'galaxy-tan-binh', name: 'Galaxy Tân Bình', brand: 'galaxy', address: '246 Nguyễn Hồng Đào, P. 14, Q. Tân Bình, TPHCM' },

    // BHD branches
    { id: 'bhd-star-vincom-pham-ngoc-thach', name: 'BHD Star Vincom PNT', brand: 'bhd', address: 'Tầng 8, Vincom Center Phạm Ngọc Thạch, Đống Đa, Hà Nội' },
    { id: 'bhd-star-bitexco', name: 'BHD Star Bitexco', brand: 'bhd', address: 'Lầu 3 & 4, TTTM Icon 68, Bitexco Financial Tower, 2 Hải Triều, P. Bến Nghé, Q. 1, TPHCM' },

    // Mega GS branches
    { id: 'mega-gs-cao-thang', name: 'Mega GS Cao Thắng', brand: 'mega', address: '19 Cao Thắng, P. 2, Q. 3, TPHCM' }
];

// Movie Data - Assuming this structure, even if the array contains only one item
const movies = [ // Array containing one movie object
  {
    id: '1',
    title: 'Nhà Gia Tiên',
    poster:
      'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    duration: 102,
    categories: ['Horror', 'Thriller'],
    ageLimit: '18+',
    description: "Một bộ phim kinh dị ám ảnh về những bí mật đen tối trong một gia đình tưởng chừng như bình thường.", // Example description
    showtimes: [
      // ... (keep the full showtimes array from your provided code) ...
       { cinema: 'cgv-aeon', room: 'Room A', date: '2025-04-07', time: '17:25', seats: { types: { Standard: { price: 100000, available: 30 }, VIP: { price: 150000, available: 20 }, Couple: { price: 250000, available: 7 } }, bookedSeats: ['A1', 'A2', 'B3', 'CP01'] } },
      { cinema: 'cgv-tran-duy-hung', room: 'Room B', date: '2025-04-07', time: '19:00', seats: { types: { Standard: { price: 120000, available: 50 }, VIP: { price: 180000, available: 50 } }, bookedSeats: ['C5', 'D8', 'D9'] } },
      { cinema: 'cgv-aeon', room: 'Room A', date: '2025-04-02', time: '20:00', seats: { types: { Standard: { price: 100000, available: 30 }, VIP: { price: 150000, available: 20 }, Couple: { price: 250000, available: 7 } }, bookedSeats: ['B1'] } },
      { cinema: 'lotte-cau-giay', room: 'Room L1', date: '2025-04-07', time: '18:00', seats: { types: { Standard: { price: 95000, available: 60 }, VIP: { price: 145000, available: 40 } }, bookedSeats: ['L_A5', 'L_B2'] } },
      { cinema: 'galaxy-quang-trung', room: 'Room G1', date: '2025-04-07', time: '19:30', seats: { types: { Standard: { price: 90000, available: 70 } }, bookedSeats: ['G_C1', 'G_C2'] } },
      { cinema: 'bhd-star-vincom-pham-ngoc-thach', room: 'Room B1', date: '2025-04-03', time: '21:15', seats: { types: { Standard: { price: 110000, available: 45 }, VIP: { price: 160000, available: 35 } }, bookedSeats: ['B1_A3'] } }
    ]
  }
];

// --- Component ---
// Renamed for clarity if it's specifically for one movie's showtimes
export default function SingleMovieShowtimes() {
  // --- State ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState('all');

  // --- Extract Single Movie Data ---
  // If this component ALWAYS shows one movie, extract it here.
  // If it might show multiple later, keep iterating over the 'movies' array.
  const movie = movies && movies.length > 0 ? movies[0] : null;

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
  const handleShowtimeSelection = (showtimeSession, movieDetails) => {
    setSelectedShowtime({
      ...showtimeSession,
      movieTitle: movieDetails.title,
      ageLimit: movieDetails.ageLimit,
      duration: movieDetails.duration,
    });
    setIsModalVisible(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrandId(brandId);
  };

  // --- Process Data for Collapse ---
  const collapseItems = useMemo(() => {
    // Exit early if essential data is missing
    if (!selectedDate || !movie || !movie.showtimes) return [];

    const cinemaBranchMap = allCinemas.reduce((acc, cinema) => {
      acc[cinema.id] = cinema;
      return acc;
    }, {});

    const groupedByCinema = {};

    // Iterate over the *single movie's* showtimes
    movie.showtimes.forEach(show => {
      // Filter by DATE
      if (show.date !== selectedDate) {
        return;
      }

      const cinemaId = show.cinema;
      const cinemaInfo = cinemaBranchMap[cinemaId];

      // Filter by BRAND
      if (!cinemaInfo || (selectedBrandId !== 'all' && cinemaInfo.brand !== selectedBrandId)) {
        return;
      }

      // Initialize cinema entry if needed
      if (!groupedByCinema[cinemaId]) {
        groupedByCinema[cinemaId] = {
          cinemaInfo: cinemaInfo,
          // Store movie details directly since there's only one movie per cinema now
          movieDetails: {
            id: movie.id,
            title: movie.title,
            poster: movie.poster,
            duration: movie.duration,
            categories: movie.categories,
            ageLimit: movie.ageLimit,
          },
          sessions: [] // Store sessions directly under the cinema
        };
      }

      // Add the valid showtime session
      groupedByCinema[cinemaId].sessions.push({
        time: show.time,
        room: show.room,
        date: show.date,
        seats: show.seats,
        cinema: cinemaId
      });
    });

    // Transform into Collapse items
    return Object.entries(groupedByCinema)
      .sort(([, a], [, b]) => a.cinemaInfo.name.localeCompare(b.cinemaInfo.name))
      .map(([cinemaId, data]) => {
        const { cinemaInfo, movieDetails, sessions } = data;

        // Skip rendering if there are no sessions for this cinema after filtering
        if (!sessions || sessions.length === 0) {
            return null;
        }

        return {
          key: cinemaId,
          label: (
            <div className='flex justify-start flex-col'>
              <span className='font-semibold text-base'>{cinemaInfo.name}</span>
              <span className='text-xs text-gray-500'>{cinemaInfo.address || 'Address not available'}</span>
            </div>
          ),
          children: (
            // Only one movie is displayed per panel now, no need for inner map/div
            <div className='flex flex-col sm:flex-row gap-4 pb-4'> {/* Removed border */}
           

              {/* Movie Details & Showtimes */}
              <div className='flex-grow text-center sm:text-left'>
         

                {/* List of Showtime Buttons */}
                <div className='flex flex-wrap gap-2 justify-center sm:justify-start'>
                  {sessions // Map directly over the sessions for this cinema
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((session, index) => (
                      <Button
                        key={`${cinemaId}-${movieDetails.id}-${session.time}-${index}`}
                        type='default'
                        className='border-primary text-primary hover:!bg-red-100 hover:!text-primary px-3 py-1 text-sm h-auto'
                        onClick={() => handleShowtimeSelection(session, movieDetails)}
                      >
                        {session.time}
                        <span className='text-xs text-gray-400 ml-1'>
                          ~ {getEndTime(session.time, movieDetails.duration)}
                        </span>
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          ),
        };
      })
      .filter(item => item !== null); // Filter out null items if a cinema had no valid sessions
  // Dependencies: Re-run when movie data changes OR when filters change
  }, [movie, allCinemas, selectedDate, selectedBrandId]); // Depend on the single 'movie' object now

  // Handle case where the movie data itself might be loading or invalid
  if (!movie) {
      // Optional: Add a loading indicator or message
      return <div className="text-center p-10">Loading movie data...</div>;
  }

  return (
    <div className='m-3 sm:m-5'>
      {/* Header - Show Movie Title */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap mb-4 gap-y-3'>
          <div>
              <h1 className='text-xl sm:text-2xl font-bold'>{movie.title} - Showtimes</h1>
              {/* Optional: Movie description */}
              {/* <p className='text-sm text-gray-600 mt-1'>{movie.description || ''}</p> */}
          </div>
        {/* <LocationSelector /> */}
      </div>

      <Divider />

      {/* Content Area */}
      <div className='w-full border border-gray-200 bg-white p-3 sm:p-4 rounded-md shadow-sm flex flex-col gap-4 mx-auto max-w-4xl'>
        {/* Filters */}
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
        <CinemaSelector selectedBrand={selectedBrandId} onBrandChange={handleBrandChange} />

        <Divider className="mt-0 mb-2" />

        {/* Collapse Section */}
        <h3 className="text-lg font-semibold mb-2">Available Cinemas</h3>
        {collapseItems.length > 0 ? (
          <Collapse
            items={collapseItems}
            defaultActiveKey={collapseItems.map(item => item.key)} // Open all panels with showtimes
            accordion={false}
            bordered={false}
            className='bg-transparent movie-showtime-collapse'
          />
        ) : (
          <div className='text-center text-gray-500 py-6'>
            No showtimes available for "{movie.title}" on the selected date and cinema brand.
          </div>
        )}
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