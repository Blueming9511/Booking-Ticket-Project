import React, { useState, useEffect } from "react";
import { Card, Space, Button, message, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ModalMovieAdd from "../../components/ProviderManagement/Movie/ModalMovieAdd";
import MovieStatistics from "../../components/ProviderManagement/Movie/MovieStatistics";
import MovieTable from "../../components/ProviderManagement/Movie/MovieTable";
import axios from "axios";
import ModalDelete from "../../components/ui/Modal/ModalDelete";
import ModalMovieEdit from "../../components/ProviderManagement/Movie/ModalMovieEdit";
const { Search } = Input;

const Movies = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [modalState, setModalState] = useState({
    edit: false,
    add: false,
    delete: false
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalElements: 0
  })

  // Fetch movies data
  const fetchMovies = async (page = 0, size = 5) => {
    try {
      setLoading(true);
      messageApi.loading("Fetching movies...", 0);
      const response = await axios.get(`http://localhost:8080/api/provider/movies?page=${page}&size=${size}`, {
        withCredentials: true,
      });
      setMovies(response.data.content);
      setPagination((prev) => ({ ...prev, totalElements: response.data.totalElements }));
      messageApi.destroy();
      messageApi.success("Movies fetched successfully");
    } catch (error) {
      messageApi.destroy();
      messageApi.error("Failed to fetch movies");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies based on search text
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchText, movies]);

  // Initial data fetch
  useEffect(() => {
    fetchMovies(pagination.page, pagination.size);
  }, [pagination.page]);

  const toggleModal = (modalName, isOpen, movie = null) => {
    setModalState(prev => ({ ...prev, [modalName]: isOpen }));
    setCurrentMovie(isOpen ? movie : null);
  };

  const handleOperation = async (operation, values = null) => {
    try {
      setLoading(true);
      let response;

      switch (operation) {
        case 'add':
          response = await axios.post("http://localhost:8080/api/provider/movies", values, {
            withCredentials: true,
          });
          break;
        case 'edit':
          response = await axios.put(
            `http://localhost:8080/api/provider/movies/${currentMovie.id}`,
            values
          );
          break;
        case 'delete':
          response = await axios.delete(
            `http://localhost:8080/api/provider/movies/${currentMovie.id}`,
            { withCredentials: true }
          );
          break;
        default:
          throw new Error("Invalid operation");
      }

      if (response.status === 200) {
        messageApi.success(`Movie ${operation === 'delete' ? 'deleted' : operation === 'add' ? 'added' : 'updated'} successfully`);
        await fetchMovies();
        toggleModal(operation, false);
      }
    } catch (error) {
      messageApi.error(`Failed to ${operation} movie`);
      console.error(`${operation} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Card
        title={<span className="text-xl font-bold">Movie Management</span>}
        borderless
        style={{boxShadow: "none"}}
        styles={{header: {borderBottom: "none"}}}
        extra={
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search by movie title"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => toggleModal('add', true)}
              loading={loading}
              disabled={loading}
            >
              Add new movie
            </Button>
          </div>
        }
        variant="borderless"
        className="shadow-none"
      >
        <MovieTable
          data={movies}
          onEdit={(movie) => toggleModal('edit', true, movie)}
          onDelete={(movie) => toggleModal('delete', true, movie)}
          loading={loading}
          pagination={pagination}
          onChangePage={(page) => setPagination((prev) => ({...prev, page: page}))}
        />
      </Card>

      {/* Edit Modal */}
      <ModalMovieEdit
        visible={modalState.edit}
        onCancel={() => toggleModal('edit', false)}
        onSuccess={(values) => handleOperation('edit', values)}
        initialValues={{
          ...currentMovie,
          releaseDate: currentMovie?.releaseDate ? dayjs(currentMovie.releaseDate) : null,
          endDate: currentMovie?.endDate ? dayjs(currentMovie.endDate) : null
        }}
        loading={loading}
      />

      {/* Add Modal */}
      <ModalMovieAdd
        visible={modalState.add}
        onCancel={() => toggleModal('add', false)}
        onSuccess={(values) => handleOperation('add', values)}
        loading={loading}
      />

      {/* Delete Modal */}
      <ModalDelete
        title={currentMovie?.title}
        visible={modalState.delete}
        onSuccess={() => handleOperation('delete')}
        onCancel={() => toggleModal('delete', false)}
        loading={loading}
        extra={<p>Are you sure you want to delete {currentMovie?.title}?</p>}
      />
    </>
  );
};

export default Movies;