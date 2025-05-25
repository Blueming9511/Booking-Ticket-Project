// src/components/CinemaBooking/CinemaBooking.js
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Select, Divider, Image } from 'antd';
import DatePicker from './DatePicker';
import BookingModal from './BookingModal';
import ShowtimeButtons from '../common/ShowtimeButtons';
import { getAgeLimitColor, getNext7Days } from '../../utils/dateUtils';

const { Option } = Select;

// Note: The 'cinemas' prop received here might be the *filtered* list
const CinemaBooking = ({ movies = [], cinemas = [] }) => {

  const initialDate = useMemo(() => getNext7Days()[0]?.fullDate || null, []);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // State for the specific selected cinema BRANCH
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // **NEW**: Effect to handle changes in the received (filtered) cinemas list
  useEffect(() => {
    // Check if the list is valid and non-empty
    if (cinemas && cinemas.length > 0) {
      // Check if the current 'selectedCinema' is still in the new list
      const currentSelectionIsValid = cinemas.some(c => String(c.id) === String(selectedCinema));

      // If the list is not empty AND (either no cinema is selected OR the current selection is invalid)
      if (!selectedCinema || !currentSelectionIsValid) {
        // Default to selecting the first cinema in the new (potentially filtered) list
        setSelectedCinema(cinemas[0].id);
      }
    } else {
      // If the filtered list becomes empty, clear the selection
      setSelectedCinema(null);
    }
  }, [cinemas]); // *** Rerun this effect when the 'cinemas' prop changes ***

  const handleShowtimeSelection = (showtime, movieTitle, ageLimit, duration) => {
    const showtimeWithDate = { ...showtime, date: showtime.date || selectedDate };
    setSelectedShowtime({ ...showtimeWithDate, movieTitle, ageLimit, duration });
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedShowtime(null);
  };

  // Filter movies based on the selected cinema BRANCH and date
  const filteredMovies = useMemo(() => {
    if (!selectedCinema || !selectedDate) {
      return [];
    }
    return movies.filter(movie =>
      movie.showtimes?.some(
        showtime =>
          String(showtime.cinema) === String(selectedCinema) &&
          showtime.date === selectedDate
      )
    );
  }, [movies, selectedCinema, selectedDate]);


  // Render Loading or Empty States for Branches
  // Display message if the *filtered* cinemas list is empty
  const noBranchesAvailable = !cinemas || cinemas.length === 0;

  return (
    // Adjusted height calculation might be needed depending on sibling elements
    <div className='flex flex-col md:flex-row h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] overflow-hidden'>

      {/* --- Sidebar Menu (Cinema Branches) --- */}
      <div className='hidden md:block w-60 lg:w-64 p-2 pr-4 overflow-y-auto border-r border-gray-200 flex-shrink-0'>
        <h2 className='text-base font-semibold mb-3 px-2'>Cinemas</h2>
        {noBranchesAvailable ? (
             <div className="px-2 text-sm text-gray-500">No cinemas found for the selected brand.</div>
         ) : (
            <Menu
              mode='vertical'
              // Ensure selectedKeys uses the current state `selectedCinema`
              selectedKeys={selectedCinema ? [String(selectedCinema)] : []}
              onClick={e => setSelectedCinema(e.key)} // Set selected branch ID
              style={{ borderRight: 0 }}
              className="cinema-menu"
            >
              {/* Map over the received (potentially filtered) cinemas list */}
              {cinemas.map(cinema => (
                <Menu.Item key={String(cinema.id)} className="text-sm lg:text-base">
                  {cinema.name}
                </Menu.Item>
              ))}
            </Menu>
         )}
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-grow flex flex-col overflow-hidden">

        {/* --- Mobile Dropdown (Branches) & Date Picker Row --- */}
        <div className='p-3 border-b border-gray-200 flex-shrink-0'>
          {/* Mobile Cinema Branch Selector */}
          <div className='block md:hidden mb-3'>
            <label htmlFor="cinema-select-mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Select Cinema Branch:
            </label>
            {noBranchesAvailable ? (
                 <div className="text-sm text-gray-500 italic">No cinemas available.</div>
            ) : (
                <Select
                  id="cinema-select-mobile"
                  value={selectedCinema ? String(selectedCinema) : undefined}
                  onChange={value => setSelectedCinema(value)} // Set selected branch ID
                  className="w-full"
                  placeholder="Choose a cinema branch"
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                   {/* Map over the received (potentially filtered) cinemas list */}
                  {cinemas.map(cinema => (
                    <Option key={String(cinema.id)} value={String(cinema.id)}>
                      {cinema.name}
                    </Option>
                  ))}
                </Select>
            )}
          </div>
          {/* Date Picker */}
          <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>

        {/* --- Scrollable Movie List --- */}
        <div className='flex-grow p-3 overflow-y-auto'>
          {noBranchesAvailable ? (
              <div className="text-center py-10 text-gray-500">
                 Please select a cinema brand with available locations.
              </div>
          ) : !selectedCinema ? (
              <div className="text-center py-10 text-gray-500">
                  Please select a cinema branch.
               </div>
          ) : filteredMovies.length > 0 ? (
            <div className='space-y-4 w-full'>
              {filteredMovies.map((movie) => (
                <div key={movie.id} className='p-3 rounded-lg flex flex-col sm:flex-row gap-4 w-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                  {/* Movie Poster */}
                  <div className='w-28 sm:w-32 mx-auto sm:mx-0 h-40 sm:h-48 flex-shrink-0'>
                    <Image
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      className='object-cover rounded-md w-full h-full'
                      preview={false}
                      placeholder={ <div className="w-full h-full bg-gray-200 animate-pulse rounded-md"></div> }
                    />
                  </div>
                  {/* Movie Info & Showtimes */}
                  <div className='flex flex-col flex-grow text-center sm:text-left'>
                     <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                         <span className={`text-white text-[10px] font-medium py-0.5 px-1.5 rounded ${getAgeLimitColor(movie.ageLimit)}`}>
                           {movie.ageLimit || 'N/A'}
                         </span>
                         <h3 className='text-base sm:text-lg font-semibold'>{movie.title}</h3>
                     </div>
                    <p className='text-gray-500 text-xs sm:text-sm mb-1'>
                         {movie.categories?.join(', ')} {' · '} {movie.duration} min
                    </p>
                    <p className='text-gray-600 text-sm mb-2'>2D Phụ đề</p>
                    <ShowtimeButtons
                      movie={movie}
                      selectedCinema={selectedCinema} // Still pass the selected branch ID
                      selectedDate={selectedDate}
                      handleShowtimeClick={handleShowtimeSelection}
                    />
                  </div>
                </div>
              ))}
             </div>
            ) : ( // This case handles when a branch is selected, but no movies match the date
              <div className="text-center py-10 text-gray-500">
                 No movies found at this cinema for {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-CA') : 'the selected date'}.
              </div>
            )}
        </div>
      </div>

      {/* --- Seat Selection Modal --- */}
      {selectedShowtime && (
        <BookingModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          showtime={selectedShowtime}
        />
      )}
    </div>
  );
};

export default CinemaBooking;