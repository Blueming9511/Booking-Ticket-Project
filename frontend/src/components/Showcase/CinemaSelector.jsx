// ========================================================================
//                  src/components/CinemaSelector/CinemaSelector.js
// ========================================================================
// (Pasting the previously provided and adapted CinemaSelector code here)

// import React, { useMemo } from 'react'; // Already imported above in ShowcaseComponent
// import PropTypes from 'prop-types';    // Already imported above in ShowcaseComponent
// import { Tooltip } from 'antd';          // Already imported above in ShowcaseComponent
import { useMemo } from 'react';
import cgvLogo from '../../assets/Cinemas_Logo/CGV.jpg'; // Adjust path
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
// Import other logos as needed and update cinemaBrandUIData below
// import lotteLogo from '../../assets/Cinemas_Logo/Lotte.png';
// import galaxyLogo from '../../assets/Cinemas_Logo/Galaxy.png';

// Static data for BRAND UI (Logos, Display Names)
const cinemaBrandUIData = [
  { id: 'all', name: 'Tất cả', logo: cgvLogo }, // 'All' option
  { id: 'cgv', name: 'CGV', logo: cgvLogo },
  { id: 'lotte', name: 'Lotte Cinema', logo: cgvLogo /* replace with lotteLogo */ },
  { id: 'galaxy', name: 'Galaxy Cinema', logo: cgvLogo /* replace with galaxyLogo */ },
  { id: 'bhd', name: 'BHD Star', logo: cgvLogo /* replace with bhdLogo */ },
  { id: 'mega', name: 'Mega GS', logo: cgvLogo /* replace with megaLogo */ },
  // Add entries here for any other 'owner' values from your API
];

// Helper function
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const CinemaSelector = ({ selectedBrand, onBrandChange, availableBrands = [] }) => {

  const brandsToDisplay = useMemo(() => {
    const availableLower = availableBrands.map(b => b?.toLowerCase());
    return cinemaBrandUIData.filter(brandUIData =>
      brandUIData.id === 'all' ||
      availableLower.includes(brandUIData.id.toLowerCase())
    );
  }, [availableBrands]);

  const handleSelect = brandId => {
    onBrandChange(brandId);
  };

   if (brandsToDisplay.length <= 1 && !availableBrands.length) {
        // Optional: Render placeholder if only 'All' is available or nothing found
        // return <div className="text-sm text-gray-500 px-1">No specific brands found.</div>;
   }

  return (
    <div className='flex gap-4 sm:gap-5 overflow-x-auto justify-start px-1 pb-2 cinema-brand-selector'>
      {brandsToDisplay.map(brand => (
        <Tooltip key={brand.id} title={brand.name} placement="bottom">
          <div className='flex flex-col items-center flex-shrink-0 w-[65px] cursor-pointer group' onClick={() => handleSelect(brand.id)} >
            <div
              className={`w-[50px] h-[50px] flex justify-center items-center p-1 rounded-lg border-2 transition-all duration-200 ease-in-out
              ${
                selectedBrand?.toLowerCase() === brand.id.toLowerCase()
                  ? 'border-red-500 shadow-md scale-105 bg-red-50' // Example Red Theme Selected
                  : 'border-gray-300 hover:border-gray-400 hover:shadow-sm bg-white'
              }`}
              role="button"
              aria-pressed={selectedBrand?.toLowerCase() === brand.id.toLowerCase()}
              aria-label={`Select ${brand.name}`}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleSelect(brand.id)}
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className='w-[90%] h-[90%] object-contain rounded-sm transition-transform duration-200 group-hover:scale-105'
              />
            </div>
            <span
              className={`text-[10px] sm:text-[11px] text-center w-full font-medium mt-1.5 transition-colors duration-200 ease-in-out ${
                selectedBrand?.toLowerCase() === brand.id.toLowerCase()
                  ? 'text-red-600 font-semibold' // Example Red Theme Selected
                  : 'text-gray-600 group-hover:text-gray-800'
              }`}
              title={brand.name}
            >
              {truncateText(brand.name, 9)}
            </span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

// Add PropTypes for validation
CinemaSelector.propTypes = {
    selectedBrand: PropTypes.string.isRequired,
    onBrandChange: PropTypes.func.isRequired,
    availableBrands: PropTypes.arrayOf(PropTypes.string)
};

export default CinemaSelector; // NOTE: Only ShowcaseComponent should be the default export from this *file*