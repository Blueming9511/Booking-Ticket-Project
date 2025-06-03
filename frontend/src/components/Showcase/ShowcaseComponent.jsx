// src/components/ShowcaseComponent/ShowcaseComponent.js
import React, { useState, useMemo, useEffect } from 'react'; // Import useState, useMemo
import './showcase.css';
import LocationSelector from './LocationSelector';
import CinemaSelector from './CinemaSelector'; // Re-import CinemaSelector
import { Divider } from 'antd';
import CinemaBooking from './CinemaBooking';
import axios from 'axios';

// --- Data Definitions ---

// Cinema BRANCHES Data - Expanded with more brands and branches
// const allCinemas = [
//   // CGV branches
//   { id: 'cgv-aeon', name: 'CGV Aeon Long Biên', brand: 'cgv' },
//   { id: 'cgv-xuan-dieu', name: 'CGV Xuân Diệu', brand: 'cgv' },
//   { id: 'cgv-tran-duy-hung', name: 'CGV Trần Duy Hưng', brand: 'cgv' },
//   { id: 'cgv-lieu-giai', name: 'CGV Liễu Giai', brand: 'cgv' },
//   { id: 'cgv-long-bien', name: 'CGV Long Biên', brand: 'cgv' },
//   { id: 'cgv-ocean-park', name: 'CGV Ocean Park', brand: 'cgv' },
//   { id: 'cgv-vincom-ba-trieu', name: 'CGV Vincom Bà Triệu', brand: 'cgv' },
//   { id: 'cgv-vincom-nguyen-chi-thanh', name: 'CGV Vincom Nguyễn Chí Thanh', brand: 'cgv' },

//   // Lotte branches
//   { id: 'lotte-cau-giay', name: 'Lotte Cầu Giấy', brand: 'lotte' },
//   { id: 'lotte-thang-long', name: 'Lotte Thăng Long', brand: 'lotte' },
//   { id: 'lotte-my-dinh', name: 'Lotte Mỹ Đình', brand: 'lotte' },

//   // Galaxy branches
//   { id: 'galaxy-quang-trung', name: 'Galaxy Quang Trung', brand: 'galaxy' },
//   { id: 'galaxy-kinh-duong-vuong', name: 'Galaxy Kinh Dương Vương', brand: 'galaxy' },
//   { id: 'galaxy-tan-binh', name: 'Galaxy Tân Bình', brand: 'galaxy' },

//   // BHD branches
//   { id: 'bhd-star-vincom-pham-ngoc-thach', name: 'BHD Star Vincom Phạm Ngọc Thạch', brand: 'bhd' },
//   { id: 'bhd-star-bitexco', name: 'BHD Star Bitexco', brand: 'bhd' },

//   // Mega GS branches
//   { id: 'mega-gs-cao-thang', name: 'Mega GS Cao Thắng', brand: 'mega' }
// ];

// Movie Data with real image URLs and more showtimes
const movies = [
  {
    id: '1',
    title: 'Nhà Gia Tiên',
    poster: 'https://www.cgv.vn/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/p/o/poster_nha_gia_tien_240x350.jpg',
    duration: 102,
    categories: ['Horror', 'Thriller'],
    ageLimit: '18+',
    showtimes: [
      { cinema: 'cgv-aeon', room: 'Room A', date: '2025-04-01', time: '17:25', seats: { types: { Standard: { price: 100000, available: 30 }, VIP: { price: 150000, available: 20 }, Couple: { price: 250000, available: 7 } }, bookedSeats: ['A1', 'A2', 'B3', 'CP01'] } },
      { cinema: 'cgv-tran-duy-hung', room: 'Room B', date: '2025-04-01', time: '19:00', seats: { types: { Standard: { price: 120000, available: 50 }, VIP: { price: 180000, available: 50 } }, bookedSeats: ['C5', 'D8', 'D9'] } },
      { cinema: 'cgv-aeon', room: 'Room A', date: '2025-04-02', time: '20:00', seats: { types: { Standard: { price: 100000, available: 30 }, VIP: { price: 150000, available: 20 }, Couple: { price: 250000, available: 7 } }, bookedSeats: ['B1'] } },
      { cinema: 'lotte-cau-giay', room: 'Room L1', date: '2025-04-01', time: '18:00', seats: { types: { Standard: { price: 95000, available: 60 }, VIP: { price: 145000, available: 40 } }, bookedSeats: ['L_A5', 'L_B2'] } },
      { cinema: 'galaxy-quang-trung', room: 'Room G1', date: '2025-04-01', time: '19:30', seats: { types: { Standard: { price: 90000, available: 70 } }, bookedSeats: ['G_C1', 'G_C2'] } },
      { cinema: 'bhd-star-vincom-pham-ngoc-thach', room: 'Room B1', date: '2025-04-03', time: '21:15', seats: { types: { Standard: { price: 110000, available: 45 }, VIP: { price: 160000, available: 35 } }, bookedSeats: ['B1_A3'] } }
    ]
  },
  {
    id: '2',
    title: 'Avengers: Endgame',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg',
    duration: 181,
    categories: ['Action', 'Sci-Fi', 'Adventure'],
    ageLimit: '13+',
    showtimes: [
      { cinema: 'cgv-aeon', room: 'Room C', date: '2025-04-07', time: '20:00', seats: { types: { Standard: { price: 120000, available: 70 }, VIP: { price: 180000, available: 50 }, Couple: { price: 280000, available: 10 } }, bookedSeats: ['B1', 'C3', 'C4', 'CP05'] } },
      { cinema: 'cgv-xuan-dieu', room: 'Room D', date: '2025-04-07', time: '21:00', seats: { types: { Standard: { price: 100000, available: 50 }, VIP: { price: 150000, available: 50 } }, bookedSeats: ['A6', 'A7', 'B8'] } },
      { cinema: 'lotte-thang-long', room: 'Room L2', date: '2025-04-08', time: '19:45', seats: { types: { Standard: { price: 100000, available: 55 }, VIP: { price: 150000, available: 45 } }, bookedSeats: ['LT_D4'] } },
      { cinema: 'galaxy-kinh-duong-vuong', room: 'Room G3', date: '2025-04-09', time: '18:30', seats: { types: { Standard: { price: 85000, available: 80 } }, bookedSeats: ['GK_A1', 'GK_A2'] } },
      { cinema: 'mega-gs-cao-thang', room: 'Room M1', date: '2025-04-10', time: '20:15', seats: { types: { Standard: { price: 80000, available: 65 } }, bookedSeats: ['MG_B5'] } }
    ]
  },
  {
    id: '3',
    title: 'Dune: Part Two',
    poster: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
    duration: 166,
    categories: ['Sci-Fi', 'Adventure', 'Drama'],
    ageLimit: 'K',
    showtimes: [
      { cinema: 'cgv-aeon', room: 'Room E', date: '2025-04-10', time: '18:30', seats: { types: { Standard: { price: 110000, available: 60 }, VIP: { price: 170000, available: 40 }, Couple: { price: 260000, available: 10 } }, bookedSeats: ['C2', 'C5', 'D6'] } },
      { cinema: 'cgv-ocean-park', room: 'Room F', date: '2025-04-10', time: '16:30', seats: { types: { Standard: { price: 90000, available: 50 }, VIP: { price: 140000, available: 50 } }, bookedSeats: ['B4', 'B5', 'C6'] } },
      { cinema: 'lotte-my-dinh', room: 'Room L3', date: '2025-04-11', time: '20:45', seats: { types: { Standard: { price: 105000, available: 70 }, VIP: { price: 155000, available: 30 } }, bookedSeats: ['LM_C3'] } },
      { cinema: 'bhd-star-bitexco', room: 'Room B2', date: '2025-04-12', time: '19:15', seats: { types: { Standard: { price: 115000, available: 55 }, VIP: { price: 165000, available: 25 } }, bookedSeats: ['BB_A4'] } }
    ]
  },
  {
    id: '4',
    title: 'The Batman',
    poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg',
    duration: 176,
    categories: ['Action', 'Crime', 'Drama'],
    ageLimit: '16+',
    showtimes: [
      { cinema: 'cgv-vincom-ba-trieu', room: 'Room V1', date: '2025-04-15', time: '19:00', seats: { types: { Standard: { price: 125000, available: 40 }, VIP: { price: 185000, available: 30 }, Couple: { price: 275000, available: 8 } }, bookedSeats: ['V1_A5', 'V1_B2'] } },
      { cinema: 'galaxy-tan-binh', room: 'Room G2', date: '2025-04-16', time: '20:30', seats: { types: { Standard: { price: 95000, available: 75 } }, bookedSeats: ['GT_C4', 'GT_D1'] } },
      { cinema: 'lotte-cau-giay', room: 'Room L4', date: '2025-04-17', time: '18:15', seats: { types: { Standard: { price: 98000, available: 60 }, VIP: { price: 148000, available: 40 } }, bookedSeats: ['LC_E3'] } }
    ]
  },
  {
    id: '5',
    title: 'Spider-Man: No Way Home',
    poster: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg',
    duration: 148,
    categories: ['Action', 'Adventure', 'Sci-Fi'],
    ageLimit: '13+',
    showtimes: [
      { cinema: 'cgv-vincom-nguyen-chi-thanh', room: 'Room V2', date: '2025-04-18', time: '17:45', seats: { types: { Standard: { price: 115000, available: 50 }, VIP: { price: 175000, available: 30 } }, bookedSeats: ['VN_A1', 'VN_B3'] } },
      { cinema: 'lotte-thang-long', room: 'Room L5', date: '2025-04-19', time: '20:00', seats: { types: { Standard: { price: 105000, available: 65 }, VIP: { price: 155000, available: 35 } }, bookedSeats: ['LT_F2'] } },
      { cinema: 'galaxy-quang-trung', room: 'Room G4', date: '2025-04-20', time: '19:30', seats: { types: { Standard: { price: 88000, available: 80 } }, bookedSeats: ['GQ_D5', 'GQ_E1'] } }
    ]
  },
  {
    id: '6',
    title: 'Top Gun: Maverick',
    poster: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
    duration: 131,
    categories: ['Action', 'Drama'],
    ageLimit: '13+',
    showtimes: [
      {
        cinema: 'cgv-vincom-ba-trieu',
        room: 'Room V3',
        date: '2025-04-21',
        time: '18:00',
        seats: {
          types: {
            Standard: { price: 120000, available: 45 },
            VIP: { price: 180000, available: 25 }
          },
          bookedSeats: ['V3_A2', 'V3_B4']
        }
      },
      {
        cinema: 'lotte-my-dinh',
        room: 'Room L6',
        date: '2025-04-22',
        time: '20:30',
        seats: {
          types: {
            Standard: { price: 110000, available: 60 },
            VIP: { price: 160000, available: 40 }
          },
          bookedSeats: ['LM_D3']
        }
      }
    ]
  },
  {
    id: '7',
    title: 'Black Panther: Wakanda Forever',
    poster: 'https://m.media-amazon.com/images/M/MV5BNTM4NjIxNmEtYWE5NS00NDczLTkyNWQtYThhNmQyZGQzMjM0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
    duration: 161,
    categories: ['Action', 'Adventure', 'Sci-Fi'],
    ageLimit: '13+',
    showtimes: [
      {
        cinema: 'cgv-long-bien',
        room: 'Room LB1',
        date: '2025-04-07',
        time: '19:15',
        seats: {
          types: {
            Standard: { price: 95000, available: 50 },
            VIP: { price: 145000, available: 30 }
          },
          bookedSeats: ['LB_C2']
        }
      },
      {
        cinema: 'cgv-long-bien',
        room: 'Room G5',
        date: '2025-04-07',
        time: '17:45',
        seats: {
          types: {
            Standard: { price: 85000, available: 70 }
          },
          bookedSeats: ['GK_B1', 'GK_B2']
        }
      }
    ]
  }
];

// --- Component Definition ---
const ShowcaseComponent = () => {
  const [brands, setBrands] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('all');

  useEffect(() => {
    const getBrands = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/guest/all-brands");
        setBrands(res.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    }

    getBrands();
  }, []);

  useEffect(() => {
    const getCinemas = async () => {
      try {
        const url = 'http://localhost:8080/api/guest/all-cinemas';
        const params = new URLSearchParams();
        params.append('brand', selectedBrand);
        params.append('page', 0);
        params.append('size', 100);
        const res = await axios.get(`${url}?${params.toString()}`);
        setCinemas(res.data.content);
      } catch (error) {
        console.error('Error fetching cinemas:', error);
      }
    }

    getCinemas();
  }, [selectedBrand])

  const handleBrandChange = (brandId) => {
    setSelectedBrand(brandId);
  };

  return (
    <div className='center flex-col text-primary h-screen flex'>
      <h1 className='text-2xl sm:text-3xl font-extrabold my-4 flex-shrink-0 text-center'>SHOWTIMES</h1>

      <div className='showcase flex-grow rounded-lg p-3 sm:p-5 flex flex-col gap-3 border border-gray-200 shadow-lg bg-white w-full max-w-7xl mx-auto overflow-hidden'>
        {/* Location Selector */}
        <div className='location flex flex-wrap gap-2 items-center flex-shrink-0'>
          <span className="font-medium text-gray-700">Location:</span>
          <LocationSelector />
        </div>

        {/* Cinema Brand Selector */}
        <div className="flex-shrink-0">
          <span className="font-medium text-gray-700 block mb-2">Cinema Brand:</span>
          <CinemaSelector
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandChange}
            cinemaBrands={brands}
          />
        </div>


        <Divider className='m-0 flex-shrink-0' />

        {/* Cinema Booking Area */}
        {/* Pass down the *filtered* branch list and movie data */}
        <CinemaBooking cinemas={cinemas} />

      </div>
    </div>
  );
};

export default ShowcaseComponent;