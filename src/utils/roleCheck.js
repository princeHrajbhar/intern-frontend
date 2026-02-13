import { getAccessToken, getUserData } from './auth';
import { jwtDecode } from 'jwt-decode';

// Decode JWT token
export const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Get current user's role from stored user data (not from token)
export const getUserRole = () => {
    const userData = getUserData();
    return userData?.role || null;
};

// Get current user's email from stored user data (not from token)
export const getUserEmail = () => {
    const userData = getUserData();
    return userData?.email || null;
};

// Check if current user is ADMIN
export const isAdmin = () => {
    return getUserRole() === 'ADMIN';
};

// Check if current user is USER
export const isUser = () => {
    return getUserRole() === 'USER';
};