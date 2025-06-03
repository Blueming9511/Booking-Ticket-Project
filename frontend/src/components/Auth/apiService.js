import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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