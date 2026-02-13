import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens, getRefreshToken } from '../utils/auth';
import { getUserEmail, getUserRole, isAdmin } from '../utils/roleCheck';
import api from '../api/axios';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userEmail = getUserEmail();
    const userRole = getUserRole();
    const userIsAdmin = isAdmin();

    useEffect(() => {
        // Just verify we can get user data, but don't show verification status
        const checkAuth = async () => {
            try {
                await api.get('/auth/me');
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                await api.post('/auth/logout', {
                    refresh_token: refreshToken
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearTokens();
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="btn-secondary">
                    Logout
                </button>
            </div>

            <div className="dashboard-content">
                <div className="welcome-card">
                    <h2>Welcome!</h2>
                    <p><strong>Email:</strong> {userEmail || 'N/A'}</p>
                    <p><strong>Role:</strong> {userRole || 'N/A'}</p>
                </div>

                <div className="navigation-card">
                    <h3>Quick Actions</h3>
                    <button
                        onClick={() => navigate('/tasks')}
                        className="btn-primary"
                    >
                        Go to Tasks
                    </button>
                    {userIsAdmin && (
                        <button
                            onClick={() => navigate('/admin')}
                            className="btn-admin"
                        >
                            Admin Panel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;