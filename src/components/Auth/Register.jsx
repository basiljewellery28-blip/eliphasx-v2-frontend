import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';

// South African Provinces
const SA_PROVINCES = [
    { value: '', label: 'Select Province' },
    { value: 'EC', label: 'Eastern Cape' },
    { value: 'FS', label: 'Free State' },
    { value: 'GP', label: 'Gauteng' },
    { value: 'KZN', label: 'KwaZulu-Natal' },
    { value: 'LP', label: 'Limpopo' },
    { value: 'MP', label: 'Mpumalanga' },
    { value: 'NC', label: 'Northern Cape' },
    { value: 'NW', label: 'North West' },
    { value: 'WC', label: 'Western Cape' }
];

// Company Sizes
const COMPANY_SIZES = [
    { value: '', label: 'Select Company Size' },
    { value: 'solo', label: '1 person (Solo)' },
    { value: 'micro', label: '2-5 employees' },
    { value: 'small', label: '6-20 employees' },
    { value: 'medium', label: '21-50 employees' },
    { value: 'large', label: '51-200 employees' },
    { value: 'enterprise', label: '200+ employees' }
];

// Industries
const INDUSTRIES = [
    { value: '', label: 'Select Industry' },
    { value: 'jewellery_manufacturing', label: 'Jewellery Manufacturing' },
    { value: 'jewellery_retail', label: 'Jewellery Retail' },
    { value: 'goldsmith', label: 'Goldsmith' },
    { value: 'silversmith', label: 'Silversmith' },
    { value: 'watch_repair', label: 'Watch Repair' },
    { value: 'gemstone_dealer', label: 'Gemstone Dealer' },
    { value: 'pawnbroker', label: 'Pawnbroker' },
    { value: 'other', label: 'Other' }
];

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        // Step 1: Account
        email: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
        acceptedPrivacy: false,
        // Step 2: Personal
        firstName: '',
        lastName: '',
        phone: '',
        jobTitle: '',
        // Step 3: Company
        companyName: '',
        companySize: '',
        industry: '',
        province: '',
        // Step 4: Contact (Optional)
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        registrationNumber: '',
        vatNumber: ''
    });

    // Restore form data if returning from legal pages
    useEffect(() => {
        if (location.state?.returnFromLegal && location.state?.formData) {
            setFormData(prev => ({ ...prev, ...location.state.formData }));
            // Auto-check the appropriate checkbox if user clicked I Agree
            if (location.state.acceptedTerms) {
                setFormData(prev => ({ ...prev, acceptedTerms: true }));
            }
            if (location.state.acceptedPrivacy) {
                setFormData(prev => ({ ...prev, acceptedPrivacy: true }));
            }
        }
    }, [location.state]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    // Navigate to legal pages with form data preserved
    const goToTerms = () => {
        navigate('/legal/terms', {
            state: { fromRegistration: true, formData: formData }
        });
    };

    const goToPrivacy = () => {
        navigate('/legal/privacy', {
            state: { fromRegistration: true, formData: formData }
        });
    };

    // Validate current step
    const validateStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.email || !formData.password || !formData.confirmPassword) {
                    setError('Please fill in all required fields');
                    return false;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    setError('Please enter a valid email address');
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
                if (!formData.acceptedTerms || !formData.acceptedPrivacy) {
                    setError('You must accept the Terms of Service and Privacy Policy');
                    return false;
                }
                return true;
            case 2:
                if (!formData.firstName || !formData.lastName) {
                    setError('First name and last name are required');
                    return false;
                }
                return true;
            case 3:
                if (!formData.companyName || !formData.companySize || !formData.province) {
                    setError('Company name, size, and province are required');
                    return false;
                }
                return true;
            case 4:
                return true; // All fields optional
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        setError('');
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                jobTitle: formData.jobTitle,
                organizationName: formData.companyName,
                companySize: formData.companySize,
                industry: formData.industry || 'jewellery_manufacturing',
                province: formData.province,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                postalCode: formData.postalCode,
                registrationNumber: formData.registrationNumber,
                vatNumber: formData.vatNumber,
                acceptedTerms: formData.acceptedTerms,
                acceptedPrivacy: formData.acceptedPrivacy
            });

            navigate('/login', {
                state: { message: 'Registration successful! Your 14-day trial has started. Please sign in.' }
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Account Credentials
    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Your Account</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="input-field py-3 px-4"
                    placeholder="your@company.com"
                    required
                />
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

    // Step 2: Personal Information
    const renderStep2 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Details</h3>

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
                    placeholder="e.g., Owner, Manager, Jeweller"
                />
            </div>
        </div>
    );

    // Step 3: Company Information
    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="input-field py-3 px-4"
                    placeholder="Your company name"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size *</label>
                <select
                    value={formData.companySize}
                    onChange={(e) => updateField('companySize', e.target.value)}
                    className="input-field py-3 px-4"
                    required
                >
                    {COMPANY_SIZES.map(size => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select
                    value={formData.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    className="input-field py-3 px-4"
                >
                    {INDUSTRIES.map(ind => (
                        <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                <select
                    value={formData.province}
                    onChange={(e) => updateField('province', e.target.value)}
                    className="input-field py-3 px-4"
                    required
                >
                    {SA_PROVINCES.map(prov => (
                        <option key={prov.value} value={prov.value}>{prov.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );

    // Step 4: Contact Details (Optional)
    const renderStep4 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Details</h3>
            <p className="text-sm text-gray-500 mb-4">All fields are optional. You can complete these later.</p>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => updateField('addressLine1', e.target.value)}
                    className="input-field py-3 px-4"
                    placeholder="Street address"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => updateField('addressLine2', e.target.value)}
                    className="input-field py-3 px-4"
                    placeholder="Suite, unit, building (optional)"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="input-field py-3 px-4"
                        placeholder="City"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => updateField('postalCode', e.target.value)}
                        className="input-field py-3 px-4"
                        placeholder="Postal code"
                    />
                </div>
            </div>

            <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-3">Business Registration (Optional)</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                        <input
                            type="text"
                            value={formData.registrationNumber}
                            onChange={(e) => updateField('registrationNumber', e.target.value)}
                            className="input-field py-3 px-4"
                            placeholder="Company reg. no."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
                        <input
                            type="text"
                            value={formData.vatNumber}
                            onChange={(e) => updateField('vatNumber', e.target.value)}
                            className="input-field py-3 px-4"
                            placeholder="VAT number"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Progress indicator
    const ProgressBar = () => (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                {[1, 2, 3, 4].map(step => (
                    <div
                        key={step}
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${step < currentStep
                            ? 'bg-green-500 text-white'
                            : step === currentStep
                                ? 'bg-primary text-white ring-4 ring-primary/30'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {step < currentStep ? '✓' : step}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>Account</span>
                <span>Personal</span>
                <span>Company</span>
                <span>Contact</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary py-12 px-4">
            <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-heading font-bold text-primary-dark">ELIPHASx</h2>
                    <p className="text-gray-600 mt-1">Create your account</p>
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
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}

                    <div className="flex justify-between mt-8 gap-4">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Back
                            </button>
                        ) : (
                            <div className="flex-1" />
                        )}

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex-1 py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary-light transition-all shadow-lg hover:shadow-xl font-medium"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Complete Registration'}
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

export default Register;
