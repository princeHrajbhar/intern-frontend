import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { isAdmin, getUserEmail } from '../utils/roleCheck';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [view, setView] = useState('users');
    const navigate = useNavigate();
    const currentUserEmail = getUserEmail();
    const userIsAdmin = isAdmin();

    useEffect(() => {
        if (!userIsAdmin) {
            navigate('/dashboard');
            return;
        }
        fetchData();
    }, [view]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            if (view === 'users') {
                const response = await api.get('/admin/users');
                setUsers(Array.isArray(response.data) ? response.data : response.data.users || []);
            } else {
                const response = await api.get('/admin/tasks');
                setTasks(Array.isArray(response.data) ? response.data : response.data.tasks || []);
            }
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                `Failed to fetch ${view}`
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async (email) => {
        try {
            await api.post('/admin/promote', { email });
            setSuccess(`User ${email} promoted to ADMIN`);
            setTimeout(() => setSuccess(''), 3000);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.detail || 'Promotion failed');
        }
    };

    const handleDemote = async (email) => {
        try {
            await api.post('/admin/demote', { email });
            setSuccess(`User ${email} demoted to USER`);
            setTimeout(() => setSuccess(''), 3000);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.detail || 'Demotion failed');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/admin/tasks/${taskId}`);
            setSuccess('Task deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.detail || 'Deletion failed');
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Panel</h1>
                <div className="admin-nav-buttons">
                    <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${view === 'users' ? 'active' : ''}`}
                    onClick={() => setView('users')}
                >
                    Manage Users
                </button>
                <button
                    className={`tab-btn ${view === 'tasks' ? 'active' : ''}`}
                    onClick={() => setView('tasks')}
                >
                    Manage All Tasks
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="admin-content">
                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : view === 'users' ? (
                    <div className="admin-table-container">
                        {users.length === 0 ? (
                            <p className="no-data">No users found</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id || user.email}>
                                            <td>{user.id || 'N/A'}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                {user.role === 'USER' ? (
                                                    <button 
                                                        onClick={() => handlePromote(user.email)} 
                                                        className="btn-promote"
                                                    >
                                                        Promote
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleDemote(user.email)} 
                                                        className="btn-demote"
                                                        disabled={user.email === currentUserEmail}
                                                        title={user.email === currentUserEmail ? 'Cannot demote yourself' : ''}
                                                    >
                                                        Demote
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ) : (
                    <div className="admin-table-container">
                        {tasks.length === 0 ? (
                            <p className="no-data">No tasks found</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task.id}>
                                            <td>{task.id}</td>
                                            <td>{task.title}</td>
                                            <td>
                                                <span className={`status-badge status-${task.status?.toLowerCase()}`}>
                                                    {task.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                {task.created_at 
                                                    ? new Date(task.created_at).toLocaleDateString() 
                                                    : 'N/A'}
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDeleteTask(task.id)} 
                                                    className="btn-delete"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;