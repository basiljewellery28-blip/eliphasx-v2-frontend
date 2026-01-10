import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const AcceptInvite = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [invitation, setInvitation] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    // Form data
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        jobTitle: '',
        acceptedTerms: false,
        acceptedPrivacy: false
    });

    // Fetch invitation details on mount
    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const response = await api.get(`/auth/accept-invite/${token}`);
                setInvitation(response.data.invitation);
            } catch (err) {
                setError(err.response?.data?.error || 'Invalid or expired invitation');
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [token]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateStep = () => {
        if (currentStep === 1) {
            if (!formData.password || !formData.confirmPassword) {
                setError('Please enter your password');
                return false;
            }
            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters');
                return false;
            }
            if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/\d/.test(formData.password)) {
                setError('Password must contain uppercase, lowercase, and a number');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
            return true;
        }
        if (currentStep === 2) {
            if (!formData.firstName || !formData.lastName) {
                setError('First name and last name are required');
                return false;
            }
            if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
                setError('You must accept the Terms of Service and Privacy Policy');
                return false;
            }
            return true;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(2);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setSubmitting(true);
        setError('');

        try {
            await api.post('/auth/register-invite', {
                token,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                jobTitle: formData.jobTitle,
                acceptedTerms: formData.acceptedTerms,
                acceptedPrivacy: formData.acceptedPrivacy
            });

            navigate('/login', {
                state: { message: 'Account created successfully! You can now log in.' }
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account');
        } finally {
            setSubmitting(false);
        }
    };

    // Navigate to legal pages with state
    const goToTerms = () => {
        navigate('/legal/terms', {
            state: { fromInvite: true, token: token, formData: formData }
        });
    };

    const goToPrivacy = () => {
        navigate('/legal/privacy', {
            state: { fromInvite: true, token: token, formData: formData }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                    <p>Loading invitation...</p>
                </div>
            </div>
        );
    }

    if (!invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h2>
                    <p className="text-gray-600 mb-6">{error || 'This invitation link is invalid or has expired.'}</p>
                    <Link to="/login" className="btn-primary px-6 py-3 rounded-xl inline-block">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // Step 1: Password
    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Set Your Password</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    type="email"
                    value={invitation.email}
                    disabled
                    className="input-field py-3 px-4 bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">This is the email you were invited with</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className="input-field py-3 px-4"
                    placeholder="Min 8 chars, upper/lower/number"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="input-field py-3 px-4"
                    placeholder="Confirm your password"
                    required
                />
            </div>
        </div>
    );

    // Step 2: Personal Info
    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="input-field py-3 px-4"
                        placeholder="First name"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className="input-field py-3 px-4"
                        placeholder="Last name"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="input-field py-3 px-4"
                    placeholder="+27 XX XXX XXXX"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => updateField('jobTitle', e.target.value)}
                    className="input-field py-3 px-4"
                    placeholder="e.g., Sales Rep, Jeweller"
                />
            </div>

            <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={formData.acceptedTerms}
                        onChange={(e) => updateField('acceptedTerms', e.target.checked)}
                        className="h-4 w-4 text-primary border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                        I agree to the{' '}
                        <button
                            type="button"
                            onClick={goToTerms}
                            className="text-secondary hover:underline font-medium"
                        >
                            Terms of Service
                        </button> *
                    </label>
                </div>

                <div className="flex items-start">
                    <input
                        type="checkbox"
                        id="privacy"
                        checked={formData.acceptedPrivacy}
                        onChange={(e) => updateField('acceptedPrivacy', e.target.checked)}
                        className="h-4 w-4 text-primary border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="privacy" className="ml-3 text-sm text-gray-600">
                        I agree to the{' '}
                        <button
                            type="button"
                            onClick={goToPrivacy}
                            className="text-secondary hover:underline font-medium"
                        >
                            Privacy Policy
                        </button> *
                    </label>
                </div>
            </div>
        </div>
    );

    // Progress indicator
    const ProgressBar = () => (
        <div className="mb-6">
            <div className="flex justify-center items-center mb-2 gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                    {currentStep > 1 ? '✓' : '1'}
                </div>
                <div className={`w-16 h-1 ${currentStep > 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                    2
                </div>
            </div>
            <div className="flex justify-center gap-16 text-xs text-gray-500">
                <span>Password</span>
                <span>Your Info</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary py-12 px-4">
            <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-heading font-bold text-primary-dark">ELIPHASx</h2>
                    <p className="text-gray-600 mt-1">Join {invitation.organizationName}</p>
                </div>

                {/* Invitation info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-800">
                        <strong>{invitation.inviterName}</strong> has invited you to join <strong>{invitation.organizationName}</strong> as a <strong>{invitation.role}</strong>.
                    </p>
                </div>

                <ProgressBar />

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={(e) => e.preventDefault()}>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}

                    <div className={`mt-8 gap-4 flex ${currentStep === 1 ? 'justify-center' : 'justify-between'}`}>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Back
                            </button>
                        )}

                        {currentStep < 2 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className={`py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary-light transition-all shadow-lg hover:shadow-xl font-medium ${currentStep === 1 ? 'w-full max-w-xs' : 'flex-1'}`}
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
                            >
                                {submitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                        )}
                    </div>
                </form>

                <div className="text-center mt-6 pt-6 border-t">
                    <span className="text-sm text-gray-600">Already have an account? </span>
                    <Link to="/login" className="text-sm font-medium text-secondary hover:text-secondary-dark">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AcceptInvite;
