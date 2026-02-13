import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';

const VerifyEmail = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        otp: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await api.post(
                '/auth/verify-email',
                formData
            );

            setMessage('Email verified successfully! Redirecting to login...');

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.message ||
                'Verification failed. Please try again.';

            // Handle specific error cases
            if (errorMessage.toLowerCase().includes('expired')) {
                setError('OTP has expired. Please register again to get a new OTP.');
            } else if (errorMessage.toLowerCase().includes('invalid')) {
                setError('Invalid OTP. Please check and try again.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Verify Email</h2>
                <p className="info-text">Please enter the OTP sent to your email</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                <p className="auth-link">
                    Back to <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
