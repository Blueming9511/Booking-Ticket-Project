import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT to the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor to handle 401 Unauthorized errors (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token'); // Remove invalid token
      window.location.href = '/login'; // Or use your routing library's navigation method
    }
    return Promise.reject(error); // Re-throw the error for further handling if needed
  }
);

export default api;