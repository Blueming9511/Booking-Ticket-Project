import React, { useMemo, useState } from 'react';
import LocationSelector from './Showcase/LocationSelector'; // Assuming these exist
import DatePicker from './Showcase/DatePicker';         // Assuming these exist
import CinemaSelector from './Showcase/CinemaSelector';     // Assuming these exist
import { Collapse, Tag, Button } from 'antd'; // Import Button, Modal
import BookingModal from './Showcase/BookingModal';
// import ShowtimeButtons from './ShowtimeButtons'; // No longer needed here
import { getEndTime } from '../utils/util';
// --- Mock Data (Keep your actual imports if they exist) ---
const placeholderPoster = "https://via.placeholder.com/100x150?text=Movie+Poster";
const cgvLogoPlaceholder = "https://via.placeholder.com/50x20?text=Logo";
// Example: src/data/movies.js
 const moviesData = [
  {
    id: 'dune2', // Unique ID
    img: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8qaXDzm4MS.jpg',
    title: 'Dune: Part Two', // Renamed from Name
    categories: ['Science Fiction', 'Adventure']
  },
  {
    id: 'oppenheimer',
    img: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    title: 'Oppenheimer',
    categories: ['Drama', 'History']
  },
  {
    id: 'godzillaxkong',
    img: 'https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg',
    title: 'Godzilla x Kong: The New Empire',
    categories: ['Action', 'Science Fiction', 'Adventure']
  },
  {
    id: 'kungfupanda4',
    img: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    title: 'Kung Fu Panda 4',
    categories: ['Animation', 'Action', 'Family', 'Comedy']
  },
  {
    id: 'spiderman_across',
    img: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    title: 'Spider-Man: Across the Spider-Verse',
    categories: ['Animation', 'Action', 'Adventure', 'Sci-Fi']
  },
  {
    id: 'barbie',
    img: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    title: 'Barbie',
    categories: ['Comedy', 'Adventure', 'Fantasy']
  },
   {
    id: 'wonka',
    img: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg',
    title: 'Wonka',
    categories: ['Comedy', 'Family', 'Fantasy']
  },
   {
    id: 'poor_things',
    img: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    title: 'Poor Things',
    categories: ['Science Fiction', 'Romance', 'Comedy', 'Drama']
  }
];
const showtimesData = [ {
    id: '3',
    title: 'Dune: Part Two',
    poster: placeholderPoster,
    duration: 166,
    categories: ['Sci-Fi', 'Adventure', 'Drama'],
    ageLimit: 'K',
    showtimes: [
      {
        cinema: 'cgv-aeon',
        room: 'Room E',
        date: '2025-04-01',
        time: '18:30',
        seats: { // Ensure seats data is present for each showtime
          total: 120,
          types: {
            Standard: { price: 110000, available: 30 },
            VIP: { price: 170000, available: 20 },
            Couple: { price: 260000, available: 6 }
          },
          bookedSeats: ['C2', 'C5', 'D6']
        }
      },
      {
        cinema: 'cgv-ocean-park',
        room: 'Room F',
        date: '2025-04-01',
        time: '16:30',
        seats: {
            total: 100,
            types: {
              Standard: { price: 90000, available: 50 },
              VIP: { price: 140000, available: 50 }
            },
            bookedSeats: ['B4', 'B5', 'C6']
        }
      },
      {
        cinema: 'cgv-aeon',
        room: 'Room G',
        date: '2025-04-01',
        time: '21:00',
        seats: { /* Add seat details */
            total: 120,
            types: { Standard: { price: 110000, available: 100 }, VIP: { price: 170000, available: 20 }},
            bookedSeats: ['A1', 'A2']
        }
      },
      {
        cinema: 'lotte',
        room: 'Room H',
        date: '2025-04-01',
        time: '21:00',
        seats: { /* Add seat details */
            total: 150,
            types: { Standard: { price: 100000, available: 130 }, Couple: { price: 240000, available:5 }},
            bookedSeats: []
        }
      }
    ]
  }
];

const cinemasData = [
  { id: 'all', name: 'Tất cả', logo: cgvLogoPlaceholder, highlight: true },
  { id: 'cgv-aeon', name: 'CGV Aeon Mall', logo: cgvLogoPlaceholder },
  { id: 'cgv-ocean-park', name: 'CGV Ocean Park', logo: cgvLogoPlaceholder },
  { id: 'lotte', name: 'Lotte Cinema', logo: cgvLogoPlaceholder },
  { id: 'galaxy', name: 'Galaxy Cinema', logo: cgvLogoPlaceholder },
  { id: 'bhd', name: 'BHD Star', logo: cgvLogoPlaceholder },
];




// --- Component ---
export default function MovieShowtimes() {

    // State for Modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedShowtime, setSelectedShowtime] = useState(null);

    // State for Filters (if CinemaSelector/DatePicker update state)
    // const [selectedCinemaId, setSelectedCinemaId] = useState('all');
    // const [selectedDate, setSelectedDate] = useState('2025-04-01'); // Example

    // Handler to open the modal with the correct data
    const handleShowtimeSelection = (showtimeSession, movieTitle, ageLimit, duration) => {
      // showtimeSession now includes { time, room, date, seats }
      setSelectedShowtime({
          ...showtimeSession, // Spread the session details (time, room, date, seats)
          movieTitle,         // Add movie details needed by modal
          ageLimit,
          duration
      });
      setIsModalVisible(true);
    };

  // --- Process Data for Collapse ---
  const collapseItems = useMemo(() => {
    const cinemaMap = cinemasData.reduce((acc, cinema) => {
      acc[cinema.id] = { name: cinema.name, logo: cinema.logo };
      return acc;
    }, {});

    const groupedShowtimes = showtimesData.reduce((acc, movie) => {
      movie.showtimes.forEach(show => {
        // --- Filtering Logic (Optional - uncomment/adapt if using state filters) ---
        // if (selectedDate && show.date !== selectedDate) return;
        // if (selectedCinemaId && selectedCinemaId !== 'all' && show.cinema !== selectedCinemaId) return;
        // --- End Filtering Logic ---

        const cinemaId = show.cinema;
        if (!acc[cinemaId]) acc[cinemaId] = {};

        const movieId = movie.id;
        if (!acc[cinemaId][movieId]) {
          acc[cinemaId][movieId] = {
            title: movie.title,
            poster: movie.poster,
            duration: movie.duration,
            categories: movie.categories,
            ageLimit: movie.ageLimit,
            sessions: []
          };
        }

        // *** MODIFIED: Include 'seats' in the session object ***
        acc[cinemaId][movieId].sessions.push({
          time: show.time,
          room: show.room,
          date: show.date,
          seats: show.seats // Include the seats object here
        });
      });
      return acc;
    }, {});

    // Transform the grouped data into Collapse items
    return Object.entries(groupedShowtimes)
      .map(([cinemaId, movies]) => {
        const cinemaInfo = cinemaMap[cinemaId];
        if (!cinemaInfo) return null;

        return {
          key: cinemaId,
          label: ( // Using your existing label structure
            <div className="flex justify-start flex-col">
              <span className="font-semibold">{cinemaInfo.name}</span>
              {/* Consider adding address dynamically if available in cinemaInfo */}
              <span className="text-xs text-gray-500">1 Đường Số 17A, An Lạc, Bình Tân, Hồ Chí Minh</span>
            </div>
          ),
          children: (
            <div className="flex flex-col gap-4">
              {Object.values(movies).map((movieData) => (
                // Movie Row
                <div key={movieData.title} className="flex flex-col sm:flex-row gap-4 border-b pb-4 last:border-b-0">
                
                  {/* Movie Details & Showtimes */}
                  <div className="flex-grow">
               

                    {/* List of times - Render Buttons Directly */}
                    <div className="flex flex-wrap gap-2">
                      {movieData.sessions
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((session, index) => (
                          // *** RENDER BUTTON DIRECTLY ***
                          <Button
                            key={`${cinemaId}-${movieData.title}-${session.time}-${session.room}-${index}`}
                            type='default'
                            className='border-red-500 text-red-500 hover:!bg-red-100 hover:!text-red-600 px-3 py-1 text-sm h-auto' // Style as needed
                            onClick={() =>
                              handleShowtimeSelection( // Call handler with correct data
                                session,             // The specific session object (includes seats)
                                movieData.title,
                                movieData.ageLimit,
                                movieData.duration
                              )
                            }
                          >
                            {session.time} ~ {getEndTime(session.time, movieData.duration)}
                          </Button>

                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ),
        };
      })
      .filter(item => item !== null);
  // Add filter state variables (e.g., selectedDate, selectedCinemaId) to dependency array if used
  }, [showtimesData, cinemasData]);

  return (
    <div className='m-5'>
      {/* Header */}
      <div className='flex justify-between items-center flex-wrap mb-4'>
        <div className='text-xl font-bold mb-3 sm:mb-0'>Showtimes</div>
        <LocationSelector />
      </div>

      {/* Content Area */}
      <div className='w-full border border-gray-200 bg-white p-4 rounded-md shadow-sm flex flex-col gap-4 md:w-[70vw] lg:w-[60vw]'>
        {/* Filters */}
        <DatePicker /* Pass state props if needed: selectedDate={selectedDate} onDateChange={setSelectedDate} */ />
        <CinemaSelector /* Pass state props if needed: cinemas={cinemasData} selectedCinemaId={selectedCinemaId} onCinemaChange={setSelectedCinemaId} */ />

        {/* Collapse Section */}
        {collapseItems.length > 0 ? (
          <Collapse
            items={collapseItems}
            defaultActiveKey={collapseItems.map(item => item.key)}
            accordion={false}
            bordered={false}
            className="bg-transparent movie-showtime-collapse" // Use transparent bg to inherit parent
            style={{ borderTop: '1px solid #e5e7eb', marginTop: '1rem' }} // Add divider
          />
        ) : (
          <div className="text-center text-gray-500 py-6">
            No showtimes available for the selected criteria.
          </div>
        )}
      </div>

        {/* --- Booking Modal --- */}
        {/* Conditional rendering ensures modal only mounts when needed */}
        {isModalVisible && selectedShowtime && (
          <BookingModal
            visible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false);
              setSelectedShowtime(null); // Clear selection on close
            }}
            showtime={selectedShowtime} // Pass the detailed showtime object
          />
        )}
    </div>
  );
}