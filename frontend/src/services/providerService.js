import axios from 'axios';
import { message } from 'antd';

const API_URL = 'http://localhost:8080/api/provider';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true'
    },
    withCredentials: true
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Add CORS headers to every request
        config.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
        config.headers['Access-Control-Allow-Credentials'] = 'true';
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
    response => response,
    error => {
        console.error('Response error:', error);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            switch (error.response.status) {
                case 401:
                    message.error('Please login to access this resource');
                    // Redirect to login page
                    window.location.href = '/login';
                    break;
                case 403:
                    message.error('You do not have permission to access this resource');
                    break;
                case 404:
                    message.error('Resource not found');
                    break;
                case 500:
                    message.error('Internal server error. Please try again later.');
                    break;
                default:
                    message.error(error.response.data?.message || 'An error occurred');
            }
        } else if (error.request) {
            // The request was made but no response was received
            message.error('No response from server. Please check your connection.');
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            message.error('Error setting up the request');
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

// Dashboard Services
export const getDashboardSales = () => api.get('/dashboard/sales');
export const getDashboardRevenue = (type) => api.get(`/dashboard/revenue?type=${type}`);

// Cinema Services
export const getCinemas = (page = 0, size = 5, address = '', status = '') => 
    api.get('/cinemas', { params: { page, size, address, status }});
export const addCinema = (cinema) => api.post('/cinemas', cinema);
export const updateCinema = (id, cinema) => api.put(`/cinemas/${id}`, cinema);
export const getCinemaOptions = () => api.get('/cinemaOptions');
export const deleteCinema = (id) => api.delete(`/cinemas/${id}`);

// Movie Services
export const getMovies = (page = 0, size = 5, status = '', title = '') => 
    api.get('/movies', { params: { page, size, status, title }});
export const addMovie = (movie) => api.post('/movies', movie);
export const updateMovie = (id, movie) => api.put(`/movies/${id}`, movie);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

// Screen Services
export const getScreens = (page = 0, size = 5, cinema = '', status = '', type = '') => 
    api.get('/screens', { params: { page, size, cinema, status, type }});
export const addScreen = (screen) => api.post('/screens', screen);
export const updateScreen = (id, screen) => api.put(`/screens/${id}`, screen);
export const deleteScreen = (id) => api.delete(`/screens/${id}`);

// Showtime Services
export const getShowtimes = (page = 0, size = 5, movie = '', status = '') => 
    api.get('/showtimes', { params: { page, size, movie, status }});
export const addShowtime = (showtime) => api.post('/showtimes', showtime);
export const updateShowtime = (id, showtime) => api.put(`/showtimes/${id}`, showtime);
export const deleteShowtime = (id) => api.delete(`/showtimes/${id}`);

// Booking Services
export const getBookings = (page = 0, size = 5, status = '', movie = '') => 
    api.get('/bookings', { params: { page, size, status, movie }});

// Payment Services
export const getPayments = (params) => api.get('/payments', { params });

// Coupon Services
export const getCoupons = (params) => api.get('/coupons', { params });
export const addCoupon = (coupon) => api.post('/coupons', coupon);
export const updateCoupon = (id, coupon) => api.put(`/coupons/${id}`, coupon);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`); 