import React, { useState, useEffect } from 'react'
import { Modal, Button, Divider } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
// Function to generate grid labels for Standard & VIP seats
const generateSeatGrid = (totalSeats, columns, startRow = 0) => {
  const seatGrid = []
  let rowIndex = startRow
  for (let i = 0; i < totalSeats; i++) {
    const rowLabel = String.fromCharCode(65 + rowIndex) // A, B, C, etc.
    const seatLabel = `${rowLabel}${(i % columns) + 1}`
    seatGrid.push(seatLabel)
    if ((i + 1) % columns === 0) rowIndex++ // Move to next row after 'columns' seats
  }
  return seatGrid
}

// Function to generate couple seat labels like CP01, CP02, etc.
const generateCoupleSeatGrid = totalSeats => {
  return Array.from(
    { length: totalSeats },
    (_, i) => `CP${(i + 1).toString().padStart(2, '0')}`
  )
}

const BookingModal = ({ visible, onClose, showtime }) => {
  const [selectedSeats, setSelectedSeats] = useState([])

  // Reset selected seats when showtime changes (i.e. when a different movie is chosen)
  useEffect(() => {
    setSelectedSeats([])
  }, [showtime])
  if (!showtime) return null

  const { seats, movieTitle, time, room, ageLimit, duration } = showtime
  const bookedSeats = seats.bookedSeats || []

  // Determine grid columns based on total seats
  const totalStandardVIP =
    seats.types.Standard.available + seats.types.VIP.available
  const gridColumns = totalStandardVIP > 100 ? 20 : 10

  // Generate seat labels
  const seatGrid = generateSeatGrid(totalStandardVIP, gridColumns)
  const coupleSeatGrid = generateCoupleSeatGrid(seats.types.Couple.available)

  // Determine seat type (for Standard & VIP)
  const getSeatType = (seatId, isCouple) => {
    if (isCouple) return 'Couple'
    return seatGrid.indexOf(seatId) >= seats.types.Standard.available
      ? 'VIP'
      : 'Standard'
  }

  // Handle seat selection
  const handleSeatSelection = seatId => {
    if (bookedSeats.includes(seatId)) return
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    )
  }

  const removeSeat = seatId => {
    setSelectedSeats(prev => prev.filter(s => s !== seatId))
  }

  // Calculate total price
  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const isCouple = coupleSeatGrid.includes(seatId)
    const seatType = getSeatType(seatId, isCouple)
    return total + seats.types[seatType].price
  }, 0)

  // Render seat element
  const renderSeat = (seatId, isCouple = false) => {
    const isBooked = bookedSeats.includes(seatId)
    const isSelected = selectedSeats.includes(seatId)
    const seatType = getSeatType(seatId, isCouple)

    // Define color schemes
    const seatColors = {
      Standard: {
        available: 'bg-purple-600 ',
        selected: 'bg-blue-900 border border-2 border-white text-white'
      },
      VIP: {
        available: 'bg-red-600 ',
        selected: 'bg-blue-900 border border-2 border-white text-white'
      },
      Couple: {
        available: 'bg-pink-600  w-full',
        selected: 'bg-blue-900 border border-2 border-white text-white w-full'
      }
    }

    const finalClass = isBooked
      ? 'bg-gray-600 text-white cursor-not-allowed w-full'
      : isSelected
      ? seatColors[seatType].selected
      : seatColors[seatType].available

    return (
      <div
        key={seatId}
        onClick={() => handleSeatSelection(seatId)}
        className={`w-10 h-10 text-white flex items-center justify-center rounded cursor-pointer text-sm font-bold  ${finalClass}`}
      >
        {seatId}
      </div>
    )
  }

  const getAgeLimitColor = ageLimit => {
    switch (ageLimit) {
      case 'P':
        return 'bg-green-500'
      case 'K':
        return 'bg-blue-500'
      case '13+':
        return 'bg-yellow-500'
      case '16+':
        return 'bg-orange-500'
      case '18+':
        return 'bg-red-600'
      default:
        return 'bg-gray-500'
    }
  }

  const getEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endMinutes = minutes + duration
    let endHours = hours + Math.floor(endMinutes / 60)
    const finalMinutes = endMinutes % 60
    endHours = endHours % 24
    return `${endHours.toString().padStart(2, '0')}:${finalMinutes
      .toString()
      .padStart(2, '0')}`
  }
  const formatPrice = price => {
    return price.toLocaleString('en-US')
  }

  return (
    <Modal
      title='Select Your Seats'
      open={visible}
      onCancel={onClose}
      footer={null}
      width='auto'
      style={{ maxWidth: '800px' }} // Restrict max width to 500px
      bodyStyle={{ padding: '20px' }}
    >
      <div className='gap-2 p-5 bg-black text-white rounded-xl w-full flex flex-col justify-center items-center '>
        {/* Standard & VIP Section */}
        <div>
          <div className='screen flex flex-col justify-center items-center w-full mb-2'>
            <div className='w-70 h-2 bg-white rounded-4xl'></div>
            <span className='text-white'>screen</span>
          </div>

          <div
            className='gap-2 '
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridColumns}, 2.5rem)`
            }}
          >
            {seatGrid.map(seat => renderSeat(seat))}
          </div>
        </div>

        {/* Couple Seats Section */}
        <div className='w-full flex justify-center items-center '>
          <div className='flex gap-2  w-100 justify-between'>
            {coupleSeatGrid.map(seat => renderSeat(seat, true))}
          </div>
        </div>

        <div className='w-full px-3 flex gap-3 justify-between mt-4 '>
          <div className='flex gap-1 items-center justify-center w-fit '>
            <div className='w-5 h-5 bg-gray-600 text-white flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
            <span>Booked</span>
          </div>
          <div className='flex gap-1 items-center justify-center w-fit '>
            <div className='w-5 h-5 bg-purple-600 text-white flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
            <span> Standard Seat</span>
          </div>
          <div className='flex gap-1 items-center justify-center w-fit '>
            <div className='w-5 h-5 bg-red-600 text-white flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
            <span>VIP Seat</span>
          </div>
          <div className='flex gap-1 items-center justify-center w-fit '>
            <div className='w-5 h-5 bg-pink-600 text-white flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
            <span>Couple Seat</span>
          </div>
          <div className='flex gap-1 items-center justify-center w-fit '>
            <div className='w-5 h-5 bg-blue-900 border-2 border-white  text-white flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
            <span>Choosen</span>
          </div>
        </div>
      </div>

      <div className='mt-6 flex flex-col justify-between items-center'>
        <div className='flex w-full justify-between items-center'>
          <div className='flex gap-2 justify-center items-center'>
            <span className={`px-2 text-white ${getAgeLimitColor(ageLimit)}`}>
              {ageLimit}
            </span>
            <span className='Movie Name font-bold text-[19px]'>
              {movieTitle}
            </span>
          </div>

          <span className='info flex gap-2'>
            <span>
              {time} ~ {getEndTime(time, duration)}
            </span>{' '}
            &#183;
            <span>Sun, 30/03</span> &#183;
            <span>{room}</span>
          </span>
        </div>
        <Divider />
        <div className='flex w-full justify-between items-center'>
          <span className=' text-gray-500 text-[15px]'>Selected Seats </span>
          <div className='flex gap-1 flex-wrap-reverse'>
            {selectedSeats.map(seat => (
              <div
                key={seat}
                className='border border-gray-200 px-3 py-1 rounded flex items-center'
              >
                {seat}{' '}
                <button
                  onClick={() => removeSeat(seat)}
                  className='ml-2 text-red-500 cursor-pointer'
                >
                  <CloseCircleFilled />{' '}
                </button>
              </div>
            ))}{' '}
          </div>
        </div>
        <Divider />
        <div className='flex w-full justify-between items-center'>
          <div className='flex flex-col'>
            <span className=' text-gray-500 text-[15px]'>Total: </span>
            <span className='font-bold text-[25px]'>
              {formatPrice(totalPrice)}đ
            </span>
          </div>
          <Button
            type='primary'
            disabled={!selectedSeats.length}
            onClick={() => {
              console.log('Booked seats:', selectedSeats)
              onClose()
            }}
            className='bg-primary'
            style={{
              padding: '20px',
              fontWeight: 'bold'
            }}
          >
            Book Ticket
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default BookingModal



// import React, { useState, useEffect } from 'react'
// import { Modal, Button, Divider } from 'antd'
// import { CloseCircleFilled } from '@ant-design/icons'
// // Function to generate grid labels for Standard & VIP seats
// const generateSeatGrid = (totalSeats, columns, startRow = 0) => {
//   const seatGrid = []
//   let rowIndex = startRow
//   for (let i = 0; i < totalSeats; i++) {
//     const rowLabel = String.fromCharCode(65 + rowIndex) // A, B, C, etc.
//     const seatLabel = `${rowLabel}${(i % columns) + 1}`
//     seatGrid.push(seatLabel)
//     if ((i + 1) % columns === 0) rowIndex++ // Move to next row after 'columns' seats
//   }
//   return seatGrid
// }

// // Function to generate couple seat labels like CP01, CP02, etc.
// const generateCoupleSeatGrid = totalSeats => {
//   return Array.from(
//     { length: totalSeats },
//     (_, i) => `CP${(i + 1).toString().padStart(2, '0')}`
//   )
// }

// const BookingModal = ({ visible, onClose, showtime }) => {
//   const [selectedSeats, setSelectedSeats] = useState([])

//   // Reset selected seats when showtime changes (i.e. when a different movie is chosen)
//   useEffect(() => {
//     setSelectedSeats([])
//   }, [showtime])
//   if (!showtime) return null

//   const { seats, movieTitle, time, room, ageLimit, duration } = showtime
//   const bookedSeats = seats.bookedSeats || []

//   // Determine grid columns based on total seats
//   const totalStandardVIP =
//     seats.types.Standard.available + seats.types.VIP.available
//   const gridColumns = totalStandardVIP > 100 ? 20 : 10

//   // Generate seat labels
//   const seatGrid = generateSeatGrid(totalStandardVIP, gridColumns)
//   const coupleSeatGrid = generateCoupleSeatGrid(seats.types.Couple.available)

//   // Determine seat type (for Standard & VIP)
//   const getSeatType = (seatId, isCouple) => {
//     if (isCouple) return 'Couple'
//     return seatGrid.indexOf(seatId) >= seats.types.Standard.available
//       ? 'VIP'
//       : 'Standard'
//   }

//   // Handle seat selection
//   const handleSeatSelection = seatId => {
//     if (bookedSeats.includes(seatId)) return
//     setSelectedSeats(prev =>
//       prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
//     )
//   }

//   const removeSeat = seatId => {
//     setSelectedSeats(prev => prev.filter(s => s !== seatId))
//   }

//   // Calculate total price
//   const totalPrice = selectedSeats.reduce((total, seatId) => {
//     const isCouple = coupleSeatGrid.includes(seatId)
//     const seatType = getSeatType(seatId, isCouple)
//     return total + seats.types[seatType].price
//   }, 0)

//   // Render seat element
//   const renderSeat = (seatId, isCouple = false) => {
//     const isBooked = bookedSeats.includes(seatId)
//     const isSelected = selectedSeats.includes(seatId)
//     const seatType = getSeatType(seatId, isCouple)

//     // Define color schemes - updated for red/white theme
//     const seatColors = {
//       Standard: {
//         available: 'bg-white border-2 border-red-600 text-red-600',
//         selected: 'bg-red-600 border-2 border-red-700 text-white'
//       },
//       VIP: {
//         available: 'bg-red-100 border-2 border-red-600 text-red-600',
//         selected: 'bg-red-600 border-2 border-red-700 text-white'
//       },
//       Couple: {
//         available: 'bg-red-50 border-2 border-red-600 text-red-600 w-full',
//         selected: 'bg-red-600 border-2 border-red-700 text-white w-full'
//       }
//     }

//     const finalClass = isBooked
//       ? 'bg-gray-300 text-gray-500 cursor-not-allowed w-full border-2 border-gray-400'
//       : isSelected
//       ? seatColors[seatType].selected
//       : seatColors[seatType].available

//     return (
//       <div
//         key={seatId}
//         onClick={() => handleSeatSelection(seatId)}
//         className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer text-sm font-bold ${finalClass}`}
//       >
//         {seatId}
//       </div>
//     )
//   }

//   const getAgeLimitColor = ageLimit => {
//     // Updated for red theme
//     switch (ageLimit) {
//       case 'P':
//         return 'bg-green-500'
//       case 'K':
//         return 'bg-blue-500'
//       case '13+':
//         return 'bg-yellow-500'
//       case '16+':
//         return 'bg-orange-500'
//       case '18+':
//         return 'bg-red-600'
//       default:
//         return 'bg-gray-500'
//     }
//   }

//   const getEndTime = (startTime, duration) => {
//     const [hours, minutes] = startTime.split(':').map(Number)
//     const endMinutes = minutes + duration
//     let endHours = hours + Math.floor(endMinutes / 60)
//     const finalMinutes = endMinutes % 60
//     endHours = endHours % 24
//     return `${endHours.toString().padStart(2, '0')}:${finalMinutes
//       .toString()
//       .padStart(2, '0')}`
//   }
//   const formatPrice = price => {
//     return price.toLocaleString('en-US')
//   }

//   return (
//     <Modal
//       title={<span className="text-red-600">Select Your Seats</span>}
//       open={visible}
//       onCancel={onClose}
//       footer={null}
//       width='auto'
//       style={{ maxWidth: '800px' }}
//       bodyStyle={{ padding: '20px' }}
//     >
//       <div className='gap-2 p-5 bg-white border-2 border-red-600 rounded-xl w-full flex flex-col justify-center items-center'>
//         {/* Standard & VIP Section */}
//         <div>
//           <div className='screen flex flex-col justify-center items-center w-full mb-2'>
//             <div className='w-70 h-2 bg-gradient-to-r from-red-500 to-red-700 rounded-4xl'></div>
//             <span className='text-red-600 font-medium'>SCREEN</span>
//           </div>

//           <div
//             className='gap-2 '
//             style={{
//               display: 'grid',
//               gridTemplateColumns: `repeat(${gridColumns}, 2.5rem)`
//             }}
//           >
//             {seatGrid.map(seat => renderSeat(seat))}
//           </div>
//         </div>

//         {/* Couple Seats Section */}
//         <div className='w-full flex justify-center items-center mt-4'>
//           <div className='flex gap-2 w-100 justify-between'>
//             {coupleSeatGrid.map(seat => renderSeat(seat, true))}
//           </div>
//         </div>

//         <div className='w-full px-3 flex gap-3 justify-between mt-4 flex-wrap'>
//           <div className='flex gap-1 items-center justify-center w-fit'>
//             <div className='w-5 h-5 bg-gray-300 border-2 border-gray-400 flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
//             <span className='text-gray-700'>Booked</span>
//           </div>
//           <div className='flex gap-1 items-center justify-center w-fit'>
//             <div className='w-5 h-5 bg-white border-2 border-red-600 flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
//             <span className='text-gray-700'>Standard Seat</span>
//           </div>
//           <div className='flex gap-1 items-center justify-center w-fit'>
//             <div className='w-5 h-5 bg-red-100 border-2 border-red-600 flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
//             <span className='text-gray-700'>VIP Seat</span>
//           </div>
//           <div className='flex gap-1 items-center justify-center w-fit'>
//             <div className='w-5 h-5 bg-red-50 border-2 border-red-600 flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
//             <span className='text-gray-700'>Couple Seat</span>
//           </div>
//           <div className='flex gap-1 items-center justify-center w-fit'>
//             <div className='w-5 h-5 bg-red-600 border-2 border-red-700 text-white flex items-center justify-center rounded cursor-pointer text-sm font-bold'></div>
//             <span className='text-gray-700'>Selected</span>
//           </div>
//         </div>
//       </div>

//       <div className='mt-6 flex flex-col justify-between items-center'>
//         <div className='flex w-full justify-between items-center'>
//           <div className='flex gap-2 justify-center items-center'>
//             <span className={`px-2 text-white ${getAgeLimitColor(ageLimit)} rounded`}>
//               {ageLimit}
//             </span>
//             <span className='Movie Name font-bold text-[19px] text-red-600'>
//               {movieTitle}
//             </span>
//           </div>

//           <span className='info flex gap-2 text-gray-600'>
//             <span>
//               {time} ~ {getEndTime(time, duration)}
//             </span>{' '}
//             &#183;
//             <span>Sun, 30/03</span> &#183;
//             <span>{room}</span>
//           </span>
//         </div>
//         <Divider className='my-4' />
//         <div className='flex w-full justify-between items-center'>
//           <span className='text-gray-600 text-[15px]'>Selected Seats</span>
//           <div className='flex gap-1 flex-wrap-reverse'>
//             {selectedSeats.map(seat => (
//               <div
//                 key={seat}
//                 className='border border-red-200 bg-red-50 px-3 py-1 rounded flex items-center'
//               >
//                 {seat}{' '}
//                 <button
//                   onClick={() => removeSeat(seat)}
//                   className='ml-2 text-red-600 cursor-pointer'
//                 >
//                   <CloseCircleFilled />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//         <Divider className='my-4' />
//         <div className='flex w-full justify-between items-center'>
//           <div className='flex flex-col'>
//             <span className='text-gray-600 text-[15px]'>Total:</span>
//             <span className='font-bold text-[25px] text-red-600'>
//               {formatPrice(totalPrice)}đ
//             </span>
//           </div>
//           <Button
//             type='primary'
//             disabled={!selectedSeats.length}
//             onClick={() => {
//               console.log('Booked seats:', selectedSeats)
//               onClose()
//             }}
//             style={{
//               padding: '20px',
//               fontWeight: 'bold',
//               backgroundColor: '#dc2626',
//               borderColor: '#dc2626'
//             }}
//           >
//             Book Ticket
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   )
// }

// export default BookingModal