import React, { useState } from 'react';
// Import Select and Option from antd
import { Menu, Button, Image, Divider, Select } from 'antd';

import DatePicker from './DatePicker';
import BookingModal from './BookingModal';
import ShowtimeButtons from '../ShowtimeButtons'; // Assuming correct path

const { Option } = Select; // Destructure Option for cleaner use

// Keep utility functions (could be moved to a utils file)
const getAgeLimitColor = ageLimit => {
  switch (ageLimit) {
    case 'P': return 'bg-green-500';
    case 'K': return 'bg-blue-500';
    case '13+': return 'bg-yellow-500';
    case '16+': return 'bg-orange-500';
    case '18+': return 'bg-red-600';
    default: return 'bg-gray-500';
  }
};

// getEndTime should ideally be inside ShowtimeButtons or a util file if not used elsewhere here

const CinemaBooking = ({ movies, cinemas }) => {
  // Safe initialization for selectedCinema
  const initialCinemaId = cinemas && cinemas.length > 0 ? cinemas[0].id : null;
  const [selectedCinema, setSelectedCinema] = useState(initialCinemaId);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Handler remains the same
  const handleShowtimeSelection = (showtime, movieTitle, ageLimit, duration) => {
    setSelectedShowtime({ ...showtime, movieTitle, ageLimit, duration });
    setIsModalVisible(true);
  };

  // Find the name of the selected cinema for the dropdown display
  const selectedCinemaName = cinemas?.find(c => String(c.id) === String(selectedCinema))?.name || 'Select Cinema';

  // Handle case where cinemas might not be loaded yet
  if (!cinemas || cinemas.length === 0) {
    return <div className='p-8 text-center'>Loading cinemas...</div>; // Or a loading spinner
  }
  // If initialCinemaId was null but cinemas loaded, set the first one
  if (selectedCinema === null && cinemas.length > 0) {
      setSelectedCinema(cinemas[0].id);
      // Return null or loading indicator briefly while state updates
      return <div className='p-8 text-center'>Initializing...</div>;
  }


  return (
    // Use flex-col by default, switch to flex-row on medium screens and up
    // Ensure overall screen height and prevent double scrollbars
    <div className='flex flex-col md:flex-row h-screen max-h-screen overflow-hidden'>

      {/* --- Sidebar Menu (Visible MD and up) --- */}
      <div className='hidden md:block w-64 p-4 overflow-y-auto border-r border-gray-200 h-screen flex-shrink-0'>
        <h2 className='text-lg font-bold mb-4'>Cinemas</h2>
        <Menu
          mode='vertical'
          // Ensure key is a string for comparison
          selectedKeys={selectedCinema ? [String(selectedCinema)] : []}
          onClick={e => setSelectedCinema(e.key)} // Antd Menu keys are strings
          style={{ borderRight: 0 }} // Remove default Antd Menu border when vertical
        >
          {cinemas.map(cinema => (
            // Ensure key is unique and string
            <Menu.Item key={String(cinema.id)}>{cinema.name}</Menu.Item>
          ))}
        </Menu>
      </div>

      {/* --- Main Content Area (Takes remaining space) --- */}
      {/* This div now contains BOTH the mobile dropdown AND the scrollable movie list */}
      <div className="flex-grow flex flex-col overflow-hidden"> {/* Allow vertical flex layout inside */}

        {/* --- Dropdown Selector (Visible Mobile/Small Screens) --- */}
        <div className='block md:hidden p-4 border-b border-gray-200 flex-shrink-0'> {/* Show on mobile, hide on md+, prevent shrinking */}
            <label htmlFor="cinema-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Cinema:
            </label>
            <Select
                id="cinema-select"
                value={selectedCinema ? String(selectedCinema) : undefined}
                onChange={value => setSelectedCinema(value)} // Select passes value directly
                className="w-full" // Make dropdown full width
            >
                {cinemas.map(cinema => (
                   <Option key={String(cinema.id)} value={String(cinema.id)}>
                       {cinema.name}
                   </Option>
                ))}
            </Select>
        </div>

        {/* --- Scrollable Content (DatePicker + Movie List) --- */}
        <div className='flex-grow p-4 overflow-y-auto'> {/* This part scrolls */}
          <DatePicker />
          <Divider className='my-4' />

          {/* Movie Listings */}
          <div className='space-y-4 w-full min-h-[200px]'>
            {movies && movies
              .filter(movie =>
                movie.showtimes?.some(
                  showtime => String(showtime.cinema) === String(selectedCinema)
                )
              )
              .map((movie) => (
                <div key={movie.id} className='p-4 rounded-lg flex flex-col sm:flex-row gap-4 w-full border border-gray-200'>
                  {/* Movie Poster */}
                  <div className='w-32 mx-auto sm:mx-0 h-48 flex-shrink-0'>
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      className='object-cover rounded-md w-full h-full'
                      preview={false}
                    />
                  </div>
                  {/* Movie Info */}
                  <div className='flex flex-col flex-grow text-center sm:text-left'>
                    <span
                      className={`${getAgeLimitColor(
                        movie.ageLimit
                      )} text-white text-xs py-1 px-2 rounded-md w-fit mx-auto sm:mx-0`}
                    >
                      {movie.ageLimit || 'N/A'}
                    </span>
                    <h3 className='text-lg font-bold mt-2'>{movie.title}</h3>
                    <p className='text-gray-600 text-sm'>2D Phụ đề</p>
                    <ShowtimeButtons
                      movie={movie}
                      selectedCinema={selectedCinema}
                      handleShowtimeClick={handleShowtimeSelection}
                    />
                  </div>
                </div>
              ))}
            {/* Message if no movies are found */}
            {movies && movies.filter(movie => movie.showtimes?.some(st => String(st.cinema) === String(selectedCinema))).length === 0 && (
              <div className="text-center p-8 text-gray-500">
                No movies showing at this cinema today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Seat Selection Modal (Remains the same) --- */}
      {selectedShowtime && (
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
};

export default CinemaBooking;