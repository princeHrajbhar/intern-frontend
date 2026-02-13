import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { isAdmin } from '../utils/roleCheck';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    // Form state for creating/editing tasks
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [editingTaskId, setEditingTaskId] = useState(null);

    const userIsAdmin = isAdmin();

    // Fetch tasks
    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/tasks?page=${page}&limit=${pageSize}`);
            const fetchedTasks = response.data.tasks || response.data;
            setTasks(fetchedTasks);

            // Check if there are more pages
            setHasMore(fetchedTasks.length === pageSize);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Failed to fetch tasks'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page]);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Create task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.post('/tasks', formData);
            setSuccess('Task created successfully!');
            setFormData({ title: '', description: '' });
            fetchTasks(); // Refresh task list
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Failed to create task'
            );
        }
    };

    // Update task
    const handleUpdateTask = async (taskId) => {
        setError('');
        setSuccess('');

        try {
            await api.put(`/tasks/${taskId}`, formData);
            setSuccess('Task updated successfully!');
            setFormData({ title: '', description: '' });
            setEditingTaskId(null);
            fetchTasks(); // Refresh task list
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Failed to update task'
            );
        }
    };

    // Delete task
    const handleDeleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            // If admin, use admin endpoint, otherwise use standard endpoint
            const endpoint = userIsAdmin ? `/admin/tasks/${taskId}` : `/tasks/${taskId}`;
            await api.delete(endpoint);
            setSuccess('Task deleted successfully!');
            fetchTasks(); // Refresh task list
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Failed to delete task.'
            );
        }
    };

    // Start editing a task
    const startEdit = (task) => {
        setEditingTaskId(task.id);
        setFormData({
            title: task.title,
            description: task.description,
        });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingTaskId(null);
        setFormData({ title: '', description: '' });
    };

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h1>Tasks</h1>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                    Back to Dashboard
                </button>
            </div>

            {/* Create/Edit Task Form */}
            <div className="task-form-card">
                <h2>{editingTaskId ? 'Edit Task' : 'Create New Task'}</h2>
                <form onSubmit={editingTaskId ? (e) => { e.preventDefault(); handleUpdateTask(editingTaskId); } : handleCreateTask}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter task title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter task description"
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {editingTaskId ? 'Update Task' : 'Create Task'}
                        </button>
                        {editingTaskId && (
                            <button type="button" onClick={cancelEdit} className="btn-secondary">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Tasks List */}
            <div className="tasks-list">
                <h2>All Tasks</h2>

                {loading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks found. Create your first task!</p>
                ) : (
                    <div className="tasks-grid">
                        {tasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <div className="task-actions">
                                    <button
                                        onClick={() => startEdit(task)}
                                        className="btn-edit"
                                    >
                                        Edit
                                    </button>
                                    {userIsAdmin && (
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="pagination">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="btn-secondary"
                    >
                        Previous
                    </button>
                    <span>Page {page}</span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={!hasMore}
                        className="btn-secondary"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
