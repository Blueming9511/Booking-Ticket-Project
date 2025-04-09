// components/PaginatedMovieList.jsx
import React, { useState, useMemo } from 'react';
import { Row, Col, Pagination, Select, Input, Space } from 'antd';
import PropTypes from 'prop-types';
import MovieCard from './MovieCard';

const { Option } = Select;

const PaginatedMovieList = ({ moviesData: initialMoviesData = [], itemsPerPage = 8 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    if (!Array.isArray(initialMoviesData)) {
        console.error("PaginatedMovieList: initialMoviesData prop must be an array.");
        return <div className="text-red-500 p-4">Error: Invalid movie data provided.</div>;
    }

    const uniqueGenres = useMemo(() => {
        const genres = new Set();
        initialMoviesData.forEach(movie => movie.genre?.forEach(g => genres.add(g)));
        return ['all', ...Array.from(genres).sort()];
    }, [initialMoviesData]);

    const filteredMovies = useMemo(() => {
        return initialMoviesData
            .filter(movie => {
                const genreMatch = selectedGenre === 'all' || movie.genre?.includes(selectedGenre);
                const searchMatch = !searchTerm || movie.title?.toLowerCase().includes(searchTerm.toLowerCase());
                return genreMatch && searchMatch;
            });
    }, [initialMoviesData, selectedGenre, searchTerm]);

    const totalFilteredItems = filteredMovies.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMovies = filteredMovies.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGenreChange = (value) => {
        setSelectedGenre(value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const renderEmptyState = () => {
        if (initialMoviesData.length === 0) {
            return <div className="text-center text-gray-500 p-8">No movies available.</div>;
        }
        if (totalFilteredItems === 0) {
            return <div className="text-center text-gray-500 p-8">No movies match your filter criteria.</div>;
        }
        return null;
    };

    return (
        <div className="w-full flex flex-col justify-center items-center mt-5 px-4">
            <div className="max-w-[1100px] w-full">
                <Row gutter={[16, 16]} justify="space-between" align="middle" className="mb-6">
                    <Col xs={24} sm={12}>
                        <h2 className="text-2xl text-black font-bold m-0">Movie list</h2>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Space wrap size="middle" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Select value={selectedGenre} onChange={handleGenreChange} style={{ width: 180 }} aria-label="Filter by genre">
                                {uniqueGenres.map(genre => (
                                    <Option key={genre} value={genre}>
                                        {genre === 'all' ? 'All Genres' : genre}
                                    </Option>
                                ))}
                            </Select>

                            <Input
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{ width: 200 }}
                                allowClear
                                aria-label="Search movies by title"
                            />
                        </Space>
                    </Col>
                </Row>

                {totalFilteredItems > 0 ? (
                    <Row gutter={[16, 24]}>
                        {currentMovies.map(movie => (
                            <Col key={movie._id} xs={12} sm={12} md={8} lg={6}>
                                <MovieCard movie={movie} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    renderEmptyState()
                )}

                {totalFilteredItems > itemsPerPage && (
                    <div className="flex justify-center mt-8 mb-4">
                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={totalFilteredItems}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


PaginatedMovieList.propTypes = {
    moviesData: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        genre: PropTypes.array,
        rating: PropTypes.number,
        description: PropTypes.string
    })),
    itemsPerPage: PropTypes.number,
};

PaginatedMovieList.defaultProps = {
    moviesData: [],
    itemsPerPage: 8,
};

export default PaginatedMovieList;