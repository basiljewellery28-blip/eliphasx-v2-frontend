import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [debugLink, setDebugLink] = useState(''); // For demo purposes only
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        setDebugLink('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`, {
                email
            });
            setMessage(response.data.message);
            if (response.data.debugLink) {
                setDebugLink(response.data.debugLink);
            }
        } catch (err) {
            setError('Failed to process request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-white/20">
                <div>
                    <h2 className="mt-6 text-center text-4xl font-heading font-bold text-primary-dark">
                        ELIPHASx
                    </h2>
                    <h3 className="mt-2 text-center text-xl font-bold text-gray-900">
                        Reset Password
                    </h3>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {message && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                            {message}
                            {debugLink && (
                                <div className="mt-2 pt-2 border-t border-green-200 text-xs text-gray-500 break-all">
                                    <strong>Development Link (Click to Reset):</strong><br />
                                    <Link to={new URL(debugLink).pathname} className="text-blue-600 underline">
                                        {debugLink}
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input-field py-3 px-4"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors">
                            Back to Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
