// src/components/CinemaBooking/CinemaBooking.js
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Select, Divider, Image, message } from 'antd';
import DatePicker from './DatePicker';
import BookingModal from './BookingModal';
import ShowtimeButtons from '../common/ShowtimeButtons';
import { getAgeLimitColor, getNext7Days } from '../../utils/dateUtils';
import axios from 'axios';

const { Option } = Select;

// Note: The 'cinemas' prop received here might be the *filtered* list
const CinemaBooking = ({ cinemas = [], movies = [] }) => {
  const initialDate = useMemo(() => getNext7Days()[0]?.fullDate || null, []);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCinemaSelect = (cinemaId) => {
    const cinema = cinemas.find(c => String(c.id) === String(cinemaId));
    setSelectedCinema(cinema);
  };

  useEffect(() => {
    const getShowtimes = async () => {
      if (!selectedCinema?.cinemaCode || !selectedDate) return;
      
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: 0,
          size: 100,
          status: 'AVAILABLE',
          date: selectedDate,
          cinema: selectedCinema.cinemaCode
        });

        const url = `http://localhost:8080/api/showtimes/v2`;
        const res = await axios.get(url, {
          params,
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        });
        
        if (res.data?.content) {
          // Group showtimes by movie
          const movieShowtimes = {};
          res.data.content.forEach(showtime => {
            if (!movieShowtimes[showtime.movieCode]) {
              movieShowtimes[showtime.movieCode] = {
                id: showtime.movieCode,
                title: showtime.movieTitle,
                poster: showtime.movieThumbnail,
                ageLimit: showtime.ageLimit,
                duration: showtime.movieDuration,
                rating: showtime.movieRating,
                categories: showtime.categories || [],
                showtimes: []
              };
            }
            movieShowtimes[showtime.movieCode].showtimes.push({
              id: showtime.id,
              showTimeCode: showtime.showTimeCode,
              time: new Date(showtime.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }),
              endTime: new Date(showtime.endTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }),
              date: selectedDate,
              availableSeats: showtime.seats - showtime.bookedSeats,
              totalSeats: showtime.seats,
              price: showtime.price,
              screenCode: showtime.screenCode,
              cinema: selectedCinema.cinemaCode
            });
          });
          setShowtimes(Object.values(movieShowtimes));
        }
      } catch (error) {
        console.error('Error fetching showtimes:', error);
        message.error('Failed to load showtimes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getShowtimes();
  }, [selectedCinema, selectedDate]);

  const handleShowtimeSelection = (showtime, movieTitle, ageLimit, duration) => {
    setSelectedShowtime({
      ...showtime,
      movieTitle,
      ageLimit,
      duration
    });
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedShowtime(null);
  };

  // Render Loading or Empty States for Branches
  const noBranchesAvailable = !cinemas || cinemas.length === 0;

  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] overflow-hidden'>
      {/* --- Sidebar Menu (Cinema Branches) --- */}
      <div className='hidden md:block w-60 lg:w-64 p-2 pr-4 overflow-y-auto border-r border-gray-200 flex-shrink-0'>
        <h2 className='text-base font-semibold mb-3 px-2'>Cinemas</h2>
        {noBranchesAvailable ? (
          <div className="px-2 text-sm text-gray-500">No cinemas found for the selected brand.</div>
        ) : (
          <Menu
            mode='vertical'
            selectedKeys={[selectedCinema?.id]}
            onClick={e => handleCinemaSelect(e.key)}
            style={{ borderRight: 0 }}
            className="cinema-menu"
            items={cinemas.map(cinema => ({
              key: String(cinema.id),
              label: cinema.cinemaName,
              className: "text-sm lg:text-base"
            }))}
          />
        )}
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* --- Mobile Dropdown (Branches) & Date Picker Row --- */}
        <div className='p-3 border-b border-gray-200 flex-shrink-0'>
          {/* Mobile Cinema Branch Selector */}
          <div className='block md:hidden mb-3'>
            <label htmlFor="cinema-select-mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Select Cinema:
            </label>
            {noBranchesAvailable ? (
              <div className="text-sm text-gray-500 italic">No cinemas available.</div>
            ) : (
              <Select
                id="cinema-select-mobile"
                value={selectedCinema?.id}
                onChange={value => handleCinemaSelect(value)}
                className="w-full"
                placeholder="Choose a cinema"
              >
                {cinemas.map(cinema => (
                  <Option key={String(cinema.id)} value={String(cinema.id)}>
                    {cinema.cinemaName}
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
              Please select a cinema to view showtimes.
            </div>
          ) : loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading showtimes...</p>
            </div>
          ) : showtimes.length > 0 ? (
            <div className='space-y-4 w-full'>
              {showtimes.map((movie) => (
                <div key={movie.id} className='p-3 rounded-lg flex flex-col sm:flex-row gap-4 w-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                  {/* Movie Poster */}
                  <div className='w-28 sm:w-32 mx-auto sm:mx-0 h-40 sm:h-48 flex-shrink-0'>
                    <Image
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      className='object-cover rounded-md w-full h-full'
                      preview={false}
                      placeholder={<div className="w-full h-full bg-gray-200 animate-pulse rounded-md"></div>}
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
                    {movie.rating && (
                      <p className='text-gray-600 text-sm mb-2'>Rating: {movie.rating.toFixed(1)}/10</p>
                    )}
                    <ShowtimeButtons
                      movie={movie}
                      selectedCinema={selectedCinema.cinemaCode}
                      selectedDate={selectedDate}
                      handleShowtimeClick={handleShowtimeSelection}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No movies available at this cinema for {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'the selected date'}.
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