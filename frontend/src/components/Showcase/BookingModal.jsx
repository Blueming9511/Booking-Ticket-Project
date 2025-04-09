import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Divider, message, Tag, Spin, Alert } from 'antd'
import { getAgeLimitColor, formatPrice } from '../../utils/dateUtils'
import PaymentModal from '../PaymentModal' // Adjust path if needed
import api from '../../utils/api'

// @Data
// @Document(collection = "booking_details")
// public class BookingDetail {
//     @Id
//     private String id;

//     @Indexed(unique = true)
//     private String bookingDetailCode;

//     @DBRef
//     private User user;

//     @DBRef
//     private Showtime showTime;

//     @DBRef
//     private List<Seat> seats;

//     private double subTotal;
//     private double discountAmount;
//     private double taxAmount;
//     private double totalAmount;

//     @DBRef
//     private Coupon coupon;

//     @DBRef
//     private Payment payment;

//     @DBRef
//     private Booking booking;

//     @Indexed
//     private BookingStatus status;

//     public enum BookingStatus {
//         PENDING, CONFIRMED, CANCELLED, COMPLETED
//     }
// }

// --- Component ---
const BookingModal = ({ visible, onClose, showtime }) => {
  // --- State ---
  const [screenLayout, setScreenLayout] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [isLoadingLayout, setIsLoadingLayout] = useState(false)
  const [errorLayout, setErrorLayout] = useState(null)
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [currentBookingDetails, setCurrentBookingDetails] = useState(null)
  // --- End State ---

  console.log(selectedSeats)

  // --- Derived Data ---
  const {
    movieTitle = 'N/A',
    startTime = 'N/A',
    endTime = 'N/A',
    screenCode = 'N/A',
    ageLimit = 'N/A',
    duration = 0,
    date = '',
    cinemaCode = null,
    cinemaId = null,
    cinemaName = 'N/A',
    showtimeCode = null,
    price: basePrice = 0
  } = showtime || {}

  // --- Effects ---
  // Fetch Layout
  useEffect(() => {
    if (
      visible &&
      cinemaCode &&
      screenCode &&
      cinemaCode !== 'N/A' &&
      screenCode !== 'N/A'
    ) {
      const fetchLayout = async () => {
        setIsLoadingLayout(true)
        setErrorLayout(null)
        setScreenLayout([])
        try {
          const response = await api.get(`/seats/${cinemaCode}/${screenCode}`)
          setScreenLayout(Array.isArray(response.data) ? response.data : [])
          console.log('Fetched screen layout with status: ', response.data)
        } catch (error) {
          console.error('Error fetching screen layout:', error)
          setErrorLayout('Could not load screen layout. Please try again.')
          setScreenLayout([])
        } finally {
          setIsLoadingLayout(false)
        }
      }
      fetchLayout()
    } else if (!visible) {
      setScreenLayout([])
      setErrorLayout(null)
    }
  }, [visible, cinemaCode, screenCode])

  // Reset Selection
  useEffect(() => {
    if (visible) {
      setSelectedSeats([])
      setCurrentBookingDetails(null)
      setPaymentModalVisible(false)
    }
  }, [visible, showtimeCode])

  // --- Memoized Calculations ---
  const seatsByRow = useMemo(() => {
    /* ... same logic ... */
    if (!screenLayout || screenLayout.length === 0) return {}
    return screenLayout.reduce((acc, seat) => {
      const row = seat.row || 'UNKNOWN'
      if (!acc[row]) acc[row] = []
      acc[row].push(seat)
      acc[row].sort((a, b) => {
        const numA = parseInt(a.seatCode.match(/\d+$/)?.[0] || '0', 10)
        const numB = parseInt(b.seatCode.match(/\d+$/)?.[0] || '0', 10)
        return numA - numB
      })
      return acc
    }, {})
  }, [screenLayout])

  const sortedRowLabels = useMemo(() => {
    return Object.keys(seatsByRow).sort((a, b) => {
      const isANumeric = /^\d+$/.test(a) || a.startsWith('CP')
      const isBNumeric = /^\d+$/.test(b) || b.startsWith('CP')
      if (isANumeric && !isBNumeric) return 1
      if (!isANumeric && isBNumeric) return -1
      if (a.startsWith('CP') && b.startsWith('CP')) {
        const numA = parseInt(a.substring(2), 10)
        const numB = parseInt(b.substring(2), 10)
        return numA - numB
      }
      return a.localeCompare(b)
    })
  }, [seatsByRow])

  const totalPrice = useMemo(
    () => selectedSeats.reduce((total, seat) => total + (seat.price || 0), 0),
    [selectedSeats]
  )

  const displayDate = useMemo(() => {
    if (!date) return 'N/A'
    try {
      const d = new Date(date + 'T00:00:00')
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    } catch (e) {
      return 'Invalid Date'
    }
  }, [date])

  const isLoading = isLoadingLayout
  const hasError = !!errorLayout

  // --- Event Handlers ---
  const handleSeatSelection = seat => {
    // Check status directly from the seat object
    if (seat.status !== 'AVAILABLE') {
      message.info(
        `Seat ${seat.seatCode} is ${
          seat.status?.toLowerCase() || 'unavailable'
        }.`,
        1.5
      )
      return
    }

    const seatCode = seat.seatCode

    // *** CHANGE IS HERE ***
    // Create the object to store in state. Start with the full 'seat' object.
    const seatDataForState = {
      ...seat, // Include all properties from the fetched seat object
      // Calculate and add price if it's not directly on the seat object from API
      price: seat.price || basePrice * (seat.multiplier || 1)
    }

    // Add or remove the full seat object from the selection state
    setSelectedSeats(prev =>
      // Check if a seat with the same seatCode already exists
      prev.some(selectedSeat => selectedSeat.seatCode === seatCode)
        ? // If yes, remove it (deselect)
          prev.filter(selectedSeat => selectedSeat.seatCode !== seatCode)
        : // If no, add the new full seat object (select)
          [...prev, seatDataForState]
    )
  }

  const removeSeat = seatCode =>
    setSelectedSeats(prev => prev.filter(s => s.seatCode !== seatCode))

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      message.warning('Please select at least one seat.')
      return
    }

    // console.log('Proceeding to Payment...', selectedSeats, totalPrice);

    const details = {
      userCode: '67ef3c10b50a606c784293b8',
      showtimeCode,
      movieTitle,
      cinemaName,
      cinemaId,
      screenCode,
      date,
      startTime,
      endTime,
      seats: selectedSeats.map(seat => seat.seatCode),
      totalPrice,
      duration
    }
    setCurrentBookingDetails(details)
    setPaymentModalVisible(true)
  }

  const handleFinalBookingSuccess = paidBookingDetails => {
    console.log('Payment successful:', paidBookingDetails)
    message.success('Booking and payment successful!')
    setPaymentModalVisible(false)
    onClose()
  }

  // --- Render Seat ---
  const renderSeat = seat => {
    // Mostly same logic, ensure fixed sizes for grid predictability
    const isSelected = selectedSeats.some(s => s.seatCode === seat.seatCode)
    const seatType = seat.type?.toUpperCase() || 'STANDARD'
    const seatStatus = seat.status || 'UNAVAILABLE'
    const isAvailable = seatStatus === 'AVAILABLE'

    // Base classes - Adjusted slightly for potentially smaller text/padding if needed
    const baseClasses = `
        rounded flex items-center justify-center
        font-semibold text-[10px] sm:text-xs transition-all duration-150 ease-in-out select-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-black
    ` // Added select-none, adjusted focus offset for dark bg

    // Size classes - KEEP THESE FIXED for grid layout. Adjust if absolutely necessary for extreme small screens
    const sizeClasses =
      seatType === 'COUPLE'
        ? 'w-[4.2rem] h-7 sm:w-[4.36rem] sm:h-8'
        : 'w-7 h-7 sm:w-8 sm:h-8' // Slightly smaller base, scale up slightly

    // State and Type specific classes
    let stateTypeClasses = ''
    if (isSelected && isAvailable) {
      stateTypeClasses =
        'bg-blue-600 text-white ring-2 ring-offset-1 ring-white scale-105 shadow-md cursor-pointer'
    } else if (isAvailable) {
      stateTypeClasses = 'text-white cursor-pointer '
      switch (seatType) {
        case 'VIP':
          stateTypeClasses += 'bg-red-600 hover:bg-red-700'
          break
        case 'COUPLE':
          stateTypeClasses += 'bg-pink-600 hover:bg-pink-700'
          break
        case 'STANDARD':
        default:
          stateTypeClasses += 'bg-purple-600 hover:bg-purple-700'
          break
      }
      stateTypeClasses += ' hover:scale-105 hover:shadow-sm'
    } else {
      // Not available
      stateTypeClasses =
        'bg-gray-600 text-gray-400 cursor-not-allowed opacity-60' // Adjusted unavailable style for dark bg
    }

    const finalClassName = `${baseClasses} ${sizeClasses} ${stateTypeClasses}`

    return (
      <div
        key={seat.seatCode}
        onClick={() => isAvailable && handleSeatSelection(seat)}
        className={finalClassName}
        aria-disabled={!isAvailable}
        role='checkbox'
        aria-checked={isSelected}
        tabIndex={!isAvailable ? -1 : 0}
        onKeyPress={e => {
          if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleSeatSelection(seat)
          }
        }}
      >
        {/* Only show seat code if it fits reasonably */}
        <span className='truncate px-0.5'>{seat.seatCode}</span>
      </div>
    )
  }
  // --- End Render Seat ---

  // --- Render Logic ---
  if (!visible) return null

  return (
    <>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        // Responsive Width: Use AntD's default responsive behavior or adjust %
        width='95%' // Slightly wider % for small screens
        // Max Width: Limit width on large screens
        style={{ maxWidth: '850px', top: '2vh' }} // Increased max-width slightly, smaller top margin
        // Body Styling: Control padding, max-height, and scrolling
        bodyStyle={{
          padding: '0', // Remove default padding, apply within sections
          // Calculate max height considering header AND potential summary footer height
          maxHeight: 'calc(90vh - 55px - 100px)', // Approx 55px header, 100px summary
          overflowY: 'auto',
          backgroundColor: '#1f2937' // Tailwind gray-800 - Apply dark bg to whole scrollable body
        }}
        closable={true}
        destroyOnClose={true}
        maskClosable={false}
        // Title: Keep sticky
        title={
          <div className='text-lg font-extrabold  py-3 px-4  sticky top-0 z-20'>
            {' '}
            {/* Adjusted styling for dark theme */}
            {movieTitle} - Select Seats
          </div>
        }
      >
        {/* Main Content Wrapper within Scrollable Body */}
        <div className='min-h-full'>
          {' '}
          {/* Ensures background covers even if content is short */}
          {/* Error Display Area */}
          {hasError && (
            <div className='p-3 sticky top-0 z-10 bg-gray-800'>
              {' '}
              {/* Sticky error below title */}
              <Alert
                message='Error Loading Seats'
                description={errorLayout}
                type='error'
                showIcon
                closable
                onClose={() => setErrorLayout(null)}
              />
            </div>
          )}
          {/* Loading Spinner Area */}
          {isLoading && (
            <div className='min-h-[300px] flex justify-center items-center '>
              {' '}
              {/* Ensure spinner area has height */}
              <Spin size='large' tip='Loading seat map...' />
            </div>
          )}
          {/* Seat Selection Area (Only if not loading/error and layout exists) */}
          {!isLoading && !hasError && screenLayout.length > 0 && (
            // Use padding on this inner container now
            <div className='p-3 sm:p-4 flex flex-col items-center'>
              {/* Screen Indicator - Simplified for dark bg */}
              <div className='w-2/4  max-w-xs sm:max-w-sm md:max-w-md h-1.5 bg-white rounded-b-full shadow-md shadow-gray-700/50 mb-8 relative'>
                <span className='absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-medium tracking-wider'>
                  SCREEN
                </span>
              </div>

              {/* Seat Grid Container - CRITICAL FOR RESPONSIVENESS */}
              <div className='flex flex-col items-center gap-1.5 sm:gap-2 w-full max-w-full overflow-x-auto py-2 px-1'>
                {/* Seat Rows */}
                {sortedRowLabels.map(rowLabel => (
                  <div
                    key={rowLabel}
                    className='flex items-center gap-2 sm:gap-3 w-auto justify-center flex-nowrap'
                  >
                    {/* Row Label - Adjusted color */}
                    <div className='w-5 sm:w-6 text-center font-medium text-gray-400 text-xs sm:text-sm flex-shrink-0'>
                      {rowLabel}
                    </div>
                    {/* Seats */}
                    <div className='flex gap-1 sm:gap-1.5 flex-nowrap'>
                      {seatsByRow[rowLabel].map(seat => renderSeat(seat))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend - Adjusted for dark bg */}
              <div className='flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-2 justify-center mt-6 pt-4 border-t border-gray-300 w-full max-w-lg text-xs text-gray-300'>
                <div className='flex items-center gap-1.5'>
                  {' '}
                  <div className='w-3 h-3 sm:w-4 sm:h-4 rounded bg-purple-600 border border-gray-500'></div>{' '}
                  <span>Standard</span>{' '}
                </div>
                <div className='flex items-center gap-1.5'>
                  {' '}
                  <div className='w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-600 border border-gray-500'></div>{' '}
                  <span>VIP</span>{' '}
                </div>
                <div className='flex items-center gap-1.5'>
                  {' '}
                  <div className='w-6 h-3 sm:w-8 sm:h-4 rounded bg-pink-600 border border-gray-500'></div>{' '}
                  <span>Couple</span>{' '}
                </div>
                <div className='flex items-center gap-1.5'>
                  {' '}
                  <div className='w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-600 border border-gray-500'></div>{' '}
                  <span>Selected</span>{' '}
                </div>
                <div className='flex items-center gap-1.5'>
                  {' '}
                  <div className='w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-600 border border-gray-500'></div>{' '}
                  <span>Unavailable</span>{' '}
                </div>
              </div>
            </div>
          )}
          {/* Message if layout is empty */}
          {!isLoading && !hasError && screenLayout.length === 0 && (
            <div className='p-4 text-center text-gray-400 min-h-[200px] flex items-center justify-center'>
              Seat map data is unavailable or empty.
            </div>
          )}
        </div>{' '}
        {/* End Main Content Wrapper */}
        {!isLoading && !hasError && screenLayout.length > 0 && (
          <div className='p-3 sm:p-4 border-t bg-[#ffffff]  bottom-0 z-20'>
            {/* Movie Info */}
            <div className='flex flex-col sm:flex-row w-full justify-between items-start sm:items-center mb-2 gap-1'>
              <div className='flex gap-2 items-center flex-shrink-0'>
                {/* <Tag color={getAgeLimitColor(ageLimit, true)}>
                  {ageLimit || 'N/A'}
                </Tag> */}
                <Tag>{ageLimit || 'N/A'}</Tag>
                {/* Allow title to potentially wrap, limit lines */}
                <span className='font-extrabold text-sm sm:text-base line-clamp-2 '>
                  {movieTitle}
                </span>
              </div>
              {/* Ensure this info wraps or shrinks nicely */}
              <span className='flex flex-wrap gap-x-2 text-[11px] sm:text-xs text-gray-400 flex-shrink-0 justify-end'>
                <span>
                  {startTime} ~ {endTime}
                </span>{' '}
                <span className='hidden sm:inline'>·</span>
                <span>{displayDate}</span>{' '}
                <span className='hidden sm:inline'>·</span>
                <span>{screenCode}</span>
              </span>
            </div>
            <Divider className=' !bg-gray-50' /> {/* Adjusted Divider color */}
            {/* Selected Seats - Allow wrapping */}
            <div className='flex w-full items-start mb-2 min-h-[30px]'>
              <span className='text-gray-400 text-xs sm:text-sm flex-shrink-0 mr-2 pt-0.5'>
                Seats:
              </span>
              <div className='flex gap-1 flex-wrap justify-end flex-grow'>
                {selectedSeats.length === 0 ? (
                  <span className='text-gray-500 text-xs sm:text-sm italic pt-0.5'>
                    Select available seats above
                  </span>
                ) : (
                  selectedSeats.map(({ seatCode }) => (
                    <Tag
                      key={seatCode}
                      closable
                      onClose={e => {
                        e.preventDefault()
                        removeSeat(seatCode)
                      }}
                      color='red'
                      className='!text-[10px] sm:!text-xs !px-1 sm:!px-1.5 !py-0 sm:!py-0.5'
                      style={{ marginRight: 3, marginBottom: 3 }}
                    >
                      {seatCode}
                    </Tag>
                  ))
                )}
              </div>
            </div>
            <Divider className=' !bg-gray-50' />
            {/* Total Price & Book Button */}
            <div className='flex w-full justify-between items-center gap-3'>
              <div className='flex flex-col flex-shrink-0'>
                <span className='text-gray-400 text-xs sm:text-sm'>Total:</span>
                <span className='font-bold text-lg sm:text-xl text-red-500'>
                  {' '}
                  {/* Slightly smaller price font */}
                  {formatPrice(totalPrice)} đ
                </span>
              </div>
              {/* Button: Ensure it doesn't get too wide */}
              <Button
                type='primary'
                danger
                disabled={selectedSeats.length === 0 || isLoading || hasError}
                onClick={handleProceedToPayment}
                className='!font-bold !text-sm sm:!text-base'
                size='large'
              >
                Book Ticket
                {selectedSeats.length > 0 ? ` (${selectedSeats.length})` : ''}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Modal */}
      {currentBookingDetails && (
        <PaymentModal
          visible={paymentModalVisible}
          onClose={() => setPaymentModalVisible(false)}
          bookingDetails={currentBookingDetails}
          onPaymentSuccess={handleFinalBookingSuccess}
        />
      )}
    </>
  )
}

export default BookingModal
