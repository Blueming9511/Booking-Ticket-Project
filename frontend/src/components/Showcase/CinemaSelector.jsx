// src/components/CinemaSelector/CinemaSelector.js
import React from 'react';
import { Tooltip } from 'antd';
import cgvLogo from '../../assets/Cinemas_Logo/CGV.jpg'; // Use a specific name
// Import other logos if you have them
// import lotteLogo from '../../assets/Cinemas_Logo/Lotte.png';
// import galaxyLogo from '../../assets/Cinemas_Logo/Galaxy.png';

// // Data for Cinema BRANDS
// const cinemaBrands = [
//   { id: 'all', name: 'Tất cả', logo: cgvLogo }, // Use a generic logo or specific ones
//   { id: 'cgv', name: 'CGV', logo: cgvLogo },
//   { id: 'lotte', name: 'Lotte Cinema', logo: cgvLogo }, // Replace with lotteLogo
//   { id: 'galaxy', name: 'Galaxy Cinema', logo: cgvLogo }, // Replace with galaxyLogo
//   // Add other brands as needed
//   // { id: 'bhd', name: 'BHD Star', logo: bhdLogo },
// ];

// Function to truncate text (can be moved to utils)
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const CinemaSelector = ({ selectedBrand, onBrandChange, cinemaBrands }) => { // Accept props

  // Handle selection - call the function passed via props
  const handleSelect = brandId => {
    onBrandChange(brandId);
  };

  console.log(cinemaBrands)

  return (
    // Added pb-2 for bottom padding to prevent scrollbar overlap
    <div className='flex gap-4 overflow-x-auto justify-start px-1 pb-2 cinema-brand-selector'>
      {cinemaBrands?.map(brand => (
        <Tooltip key={brand.id} title={brand.name}>
          <div className='flex flex-col justify-start items-center flex-shrink-0 w-[60px]'> {/* Fixed width container */}
            <button
              className={`cursor-pointer w-[50px] h-[50px] flex justify-center items-center p-1 rounded-lg border-2 transition-all duration-300
              ${
                selectedBrand === brand.name // Use prop for selected state
                  ? 'border-primary shadow-md' // Use primary color variable from Tailwind
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => handleSelect(brand.name)} // Use handler
              aria-pressed={selectedBrand === brand.id} // Accessibility
              aria-label={`Select ${brand.name}`}
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className='w-full h-full object-contain rounded' // Adjusted image style
              />
            </button>
            <span
              className={`text-[10px] text-center w-full font-medium mt-1 transition-colors duration-300 ${
                selectedBrand === brand.id // Use prop for selected state
                  ? 'text-primary font-semibold'
                  : 'text-gray-600'
              }`}
            >
              {/* Truncate if name is too long for the fixed width */}
              {truncateText(brand.name, 8)}
            </span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export default CinemaSelector;