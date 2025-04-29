import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
    baseURL: `${API_URL}/auth/refresh-token`, withCredentials: true
});

axiosInstance.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const user = localStorage.getItem("user");
            const refreshResponse = await axiosInstance.post('/api/auth/refresh-token', {id: user.id}, {withCredentials: true});
            const newAccessToken = refreshResponse.data.accessToken;
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default axiosInstance;