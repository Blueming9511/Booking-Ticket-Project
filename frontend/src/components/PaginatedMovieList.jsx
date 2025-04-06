// components/PaginatedMovieList.jsx
import React, { useState, useMemo } from 'react'; // Import useMemo
import { Row, Col, Pagination, Select, Input, Space } from 'antd'; // Import Select, Input, Space
import PropTypes from 'prop-types';
import MovieCard from './MovieCard'; // Adjust path if necessary

const { Option } = Select;
const { Search } = Input;

const PaginatedMovieList = ({ moviesData: initialMoviesData = [], itemsPerPage = 8 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' or specific category
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  // --- Input Validation ---
  if (!Array.isArray(initialMoviesData)) {
    console.error("PaginatedMovieList: initialMoviesData prop must be an array.");
    return <div className="text-red-500 p-4">Error: Invalid movie data provided.</div>;
  }

  // --- Memoized Calculation for Unique Categories ---
  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    initialMoviesData.forEach(movie => {
      movie.categories?.forEach(cat => categories.add(cat));
    });
    // Sort categories alphabetically for the dropdown
    return ['all', ...Array.from(categories).sort()];
  }, [initialMoviesData]); // Recalculate only when initial data changes

  // --- Memoized Filtering and Searching ---
  const filteredMovies = useMemo(() => {
    return initialMoviesData
      .filter(movie => {
        // Category Filter
        const categoryMatch = selectedCategory === 'all' || movie.categories?.includes(selectedCategory);
        // Search Term Filter (case-insensitive)
        const searchMatch = !searchTerm || movie.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
      });
      // NOTE: If you wanted sorting combined, you would add the .sort() logic here
      // based on a sortOption state, before the pagination slice.
  }, [initialMoviesData, selectedCategory, searchTerm]); // Recalculate when data or filters change

  // --- Pagination Logic (Applied to filteredMovies) ---
  const totalFilteredItems = filteredMovies.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, endIndex);

  // --- Event Handlers ---
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to page 1 when category changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search term changes
  };

    // Optional: Handle search on pressing Enter or clicking icon (if using Search component's onSearch prop)
    // const handleSearch = (value) => {
    //   setSearchTerm(value);
    //   setCurrentPage(1);
    // };


  // --- Empty State ---
  const renderEmptyState = () => {
      if (initialMoviesData.length === 0) {
          return <div className="text-center text-gray-500 p-8">No movies available.</div>;
      }
      if (totalFilteredItems === 0) {
          return <div className="text-center text-gray-500 p-8">No movies match your filter criteria.</div>;
      }
      return null; // Should not happen if totalFilteredItems > 0
  }

  // --- Rendering ---
  return (
    <div className='w-full flex flex-col justify-center items-center mt-5 px-4'> {/* Added padding */}
      <div className='max-w-[1100px] w-full '>

        {/* Header Section: Title and Filters */}
        <Row gutter={[16, 16]} justify="space-between" align="middle" className="mb-6">
           <Col xs={24} sm={12}>
              <h2 className='text-2xl text-black font-bold m-0'> {/* Use h2, remove default margin */}
                Movie list
              </h2>
            </Col>
           <Col xs={24} sm={12} >
             <Space wrap size="middle" style={{ display: 'flex', justifyContent: 'flex-end'}}> {/* Wrap filters and align right on larger screens */}
                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  style={{ width: 180 }}
                  onChange={handleCategoryChange}
                  aria-label="Filter by category"
                >
                  {uniqueCategories.map(category => (
                    <Option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </Option>
                  ))}
                </Select>

                {/* Search Input */}
                <Input
                   placeholder="Search by title..."
                   value={searchTerm}
                   onChange={handleSearchChange}
                  //  onSearch={handleSearch} // Use if you want search on Enter/Icon click
                   style={{ width: 200 }}
                   allowClear // Add clear button
                   aria-label="Search movies by title"
                />
             </Space>
           </Col>
        </Row>


        {/* Movie Grid or Empty State */}
        {totalFilteredItems > 0 ? (
            <Row gutter={[16, 24]} style={{ width: "100%" }}> {/* Increased vertical gutter */}
            {currentMovies.map((movie) => (
                <Col key={movie.id} xs={12} sm={12} md={8} lg={6}>
                    <MovieCard movie={movie} />
                </Col>
            ))}
            </Row>
        ) : (
            renderEmptyState()
        )}


        {/* Pagination */}
        {totalFilteredItems > itemsPerPage && ( // Only show pagination if needed for the *filtered* results
          <div className="flex justify-center mt-8 mb-4">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalFilteredItems} // Base total on filtered items
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// --- PropTypes ---
// Ensure PropTypes match the data structure you're passing and using (e.g., 'img', 'categories', 'rate')
PaginatedMovieList.propTypes = {
  moviesData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    img: PropTypes.string, // Make sure your MovieCard uses 'img'
    categories: PropTypes.arrayOf(PropTypes.string),
    rate: PropTypes.number,
    // description: PropTypes.string, // If you use description
  })),
  itemsPerPage: PropTypes.number,
};

// --- Default Props ---
PaginatedMovieList.defaultProps = {
  moviesData: [],
  itemsPerPage: 8,
};



export default PaginatedMovieList;