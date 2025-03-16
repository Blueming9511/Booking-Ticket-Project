const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

export const loginWithGoogle = () => {
    window.location.href = GOOGLE_AUTH_URL;
};