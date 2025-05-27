import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const commentService = {
    // Get paginated comments for a movie
    getMovieComments: async (movieId, page = 0, size = 10) => {
        try {
            const response = await axios.get(`${API_URL}/comments/movie/${movieId}`, {
                params: { page, size },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get active comments for a movie (no pagination)
    getActiveComments: async (movieId) => {
        try {
            const response = await axios.get(`${API_URL}/comments/movie/${movieId}/active`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Add a new comment
    addComment: async (comment) => {
        try {
            const response = await axios.post(`${API_URL}/comments`, comment, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update a comment
    updateComment: async (commentId, comment) => {
        try {
            const response = await axios.put(`${API_URL}/comments/${commentId}`, comment, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete a comment
    deleteComment: async (commentId) => {
        try {
            const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get total comment count
    getCommentCount: async () => {
        try {
            const response = await axios.get(`${API_URL}/comments/count`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const userService = {
    updateProfile: async (userId, userData) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (userId, passwordData) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}/change-password`, passwordData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const forgotPasswordService = {
    sendResetCode: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, {email});
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const response = await axios.post(`${API_URL}/auth/verify-code`, {email, otp}, {withCredentials: true});
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                token, newPassword
            }, {withCredentials: true});
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};