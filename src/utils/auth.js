// Token management utilities

export const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
    return localStorage.getItem('refresh_token');
};

export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
};

export const isAuthenticated = () => {
    return !!getAccessToken();
};

// Store user data from /auth/me endpoint
export const setUserData = (userData) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
};

export const getUserData = () => {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
};