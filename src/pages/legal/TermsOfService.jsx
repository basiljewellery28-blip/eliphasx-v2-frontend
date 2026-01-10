import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const lastUpdated = "19 December 2024";
    const location = useLocation();
    const navigate = useNavigate();

    // Check if user came from registration flow
    const fromRegistration = location.state?.fromRegistration || false;
    const registrationData = location.state?.formData || null;

    // Handle "I Agree" button - return to registration with data preserved
    const handleAgree = () => {
        navigate('/register', {
            state: {
                formData: registrationData,
                acceptedTerms: true,
                returnFromLegal: true
            }
        });
    };

    // Handle back button
    const handleBack = () => {
        if (fromRegistration) {
            navigate('/register', {
                state: {
                    formData: registrationData,
                    returnFromLegal: true
                }
            });
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-10 pb-8 border-b">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">Terms of Service</h1>
                    <p className="text-gray-500">Last updated: {lastUpdated}</p>
                    <button
                        onClick={handleBack}
                        className="text-secondary hover:underline text-sm mt-4 inline-block"
                    >
                        ← {fromRegistration ? 'Back to Registration' : 'Back to ELIPHASx'}
                    </button>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none text-gray-700 space-y-8">

                    {/* 1. Introduction */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p>
                            Welcome to ELIPHASx, a jewellery manufacturing quote management platform operated by
                            BASIL & Co (Pty) Ltd ("we", "our", or "us"). By accessing or using our platform,
                            you agree to be bound by these Terms of Service ("Terms").
                        </p>
                        <p>
                            These Terms govern your use of the ELIPHASx software-as-a-service platform, including
                            all features, applications, and services provided through our website and applications.
                        </p>
                    </section>

                    {/* 2. Account Registration */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Account Registration</h2>
                        <p>To use ELIPHASx, you must:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Be at least 18 years of age or the legal age of majority in your jurisdiction</li>
                            <li>Provide accurate, complete, and current information during registration</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Accept responsibility for all activities that occur under your account</li>
                            <li>Notify us immediately of any unauthorized access or security breach</li>
                        </ul>
                    </section>

                    {/* 3. Service Description */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. Service Description</h2>
                        <p>ELIPHASx provides a platform for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Creating and managing jewellery manufacturing quotes</li>
                            <li>Client and contact management</li>
                            <li>Material and pricing calculations</li>
                            <li>Quote generation and PDF export</li>
                            <li>Business analytics and reporting</li>
                            <li>Multi-user team collaboration</li>
                        </ul>
                        <p className="mt-4">
                            We reserve the right to modify, suspend, or discontinue any part of the service at
                            any time with reasonable notice.
                        </p>
                    </section>

                    {/* 4. Subscription and Payment */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Subscription and Payment</h2>
                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.1 Free Trial</h3>
                        <p>
                            New accounts receive a 28-day free trial with full access to platform features.
                            No payment information is required during the trial period.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.2 Subscription Plans</h3>
                        <p>
                            After the trial period, you may choose a subscription plan. Subscriptions are billed
                            monthly or annually as selected. All prices are in South African Rand (ZAR) unless
                            otherwise stated.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.3 Payment Processing</h3>
                        <p>
                            Payments are processed securely through our payment partner, Paystack. By providing
                            payment information, you authorize us to charge the applicable subscription fees.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.4 Refunds</h3>
                        <p>
                            Subscription fees are non-refundable except as required by law or at our sole discretion.
                        </p>
                    </section>

                    {/* 5. User Obligations */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. User Obligations</h2>
                        <p>You agree NOT to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Use the platform for any unlawful purpose</li>
                            <li>Share your account credentials with unauthorized persons</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the platform's operation</li>
                            <li>Upload malicious code, viruses, or harmful content</li>
                            <li>Reverse engineer or attempt to extract source code</li>
                            <li>Resell or redistribute the service without authorization</li>
                            <li>Use the platform to send spam or unsolicited communications</li>
                        </ul>
                    </section>

                    {/* 6. Intellectual Property */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">6.1 Our Property</h3>
                        <p>
                            ELIPHASx, including all software, design, content, logos, and trademarks, is the
                            exclusive property of BASIL & Co (Pty) Ltd. All rights are reserved.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">6.2 Your Data</h3>
                        <p>
                            You retain ownership of all data you upload to the platform. By using our service,
                            you grant us a limited license to store, process, and display your data as necessary
                            to provide the service.
                        </p>
                    </section>

                    {/* 7. Data Protection */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">7. Data Protection</h2>
                        <p>
                            We are committed to protecting your personal information in accordance with the
                            Protection of Personal Information Act (POPIA) of South Africa. Please review our{' '}
                            <Link to="/legal/privacy" className="text-secondary hover:underline">
                                Privacy Policy
                            </Link>{' '}
                            for detailed information about how we collect, use, and protect your data.
                        </p>
                    </section>

                    {/* 8. Limitation of Liability */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                The platform is provided "as is" without warranties of any kind, express or implied
                            </li>
                            <li>
                                We do not guarantee uninterrupted or error-free service
                            </li>
                            <li>
                                We shall not be liable for any indirect, incidental, special, consequential,
                                or punitive damages
                            </li>
                            <li>
                                Our total liability shall not exceed the amount paid by you in the 12 months
                                preceding the claim
                            </li>
                        </ul>
                    </section>

                    {/* 9. Termination */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">9. Termination</h2>
                        <p>
                            Either party may terminate this agreement at any time. Upon termination:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your access to the platform will be revoked</li>
                            <li>You may export your data within 30 days of termination</li>
                            <li>We may delete your data after 90 days unless legally required to retain it</li>
                            <li>Any outstanding fees remain due and payable</li>
                        </ul>
                    </section>

                    {/* 10. Governing Law */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the
                            Republic of South Africa. Any disputes arising from these Terms shall be subject to
                            the exclusive jurisdiction of the courts of South Africa.
                        </p>
                    </section>

                    {/* 11. Changes to Terms */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                        <p>
                            We may update these Terms from time to time. We will notify you of material changes
                            via email or through the platform. Your continued use of the service after such
                            notification constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    {/* 12. Contact Information */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                        <p>If you have questions about these Terms, please contact us:</p>
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <p className="font-semibold">BASIL & Co (Pty) Ltd</p>
                            <p>Email: legal@basilx.co.za</p>
                            <p>Support: eliphasxsupport@basilx.co.za</p>
                            <p>Website: www.basilx.co.za</p>
                        </div>
                    </section>

                </div>

                {/* Footer with I Agree button */}
                <div className="mt-12 pt-8 border-t text-center">
                    {fromRegistration ? (
                        <>
                            <button
                                onClick={handleAgree}
                                className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl inline-block font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                ✓ I Agree to the Terms of Service
                            </button>
                            <p className="text-gray-500 text-sm mt-4">
                                Click to accept and continue with your registration.
                            </p>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="btn-primary px-8 py-3 rounded-xl inline-block">
                                Create Your Account
                            </Link>
                            <p className="text-gray-500 text-sm mt-4">
                                By creating an account, you agree to these Terms of Service.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
