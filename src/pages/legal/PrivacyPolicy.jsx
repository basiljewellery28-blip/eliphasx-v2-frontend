import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                acceptedPrivacy: true,
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
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">Privacy Policy</h1>
                    <p className="text-gray-500">Last updated: {lastUpdated}</p>
                    <p className="text-sm text-green-600 mt-2 font-medium">✓ POPIA Compliant</p>
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
                            BASIL & Co (Pty) Ltd ("we", "our", or "us") is committed to protecting your privacy
                            in accordance with the Protection of Personal Information Act, 2013 (POPIA) and other
                            applicable data protection laws.
                        </p>
                        <p>
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your personal
                            information when you use the ELIPHASx platform.
                        </p>
                    </section>

                    {/* 2. Information We Collect */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, phone number, job title</li>
                            <li><strong>Company Information:</strong> Company name, size, industry, province, address,
                                VAT number, registration number</li>
                            <li><strong>Client Data:</strong> Client names, contact details, project information you
                                enter into the platform</li>
                            <li><strong>Payment Information:</strong> Billing details processed securely by our
                                payment provider (Paystack)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">2.2 Information Collected Automatically</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                            <li><strong>Cookies:</strong> Session and preference cookies (see Section 8)</li>
                        </ul>
                    </section>

                    {/* 3. How We Use Your Information */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p>We use your personal information to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve the ELIPHASx platform</li>
                            <li>Process your account registration and manage your subscription</li>
                            <li>Send service-related communications and updates</li>
                            <li>Provide customer support and respond to inquiries</li>
                            <li>Process payments and prevent fraud</li>
                            <li>Analyze usage patterns to improve our services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    {/* 4. Legal Basis for Processing */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">4. Legal Basis for Processing</h2>
                        <p>Under POPIA, we process your personal information based on:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Consent:</strong> When you agree to our Terms of Service and this Privacy Policy</li>
                            <li><strong>Contract:</strong> To fulfill our service agreement with you</li>
                            <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
                            <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                        </ul>
                    </section>

                    {/* 5. Data Sharing */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">5. Data Sharing</h2>
                        <p>We may share your information with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Service Providers:</strong> Third parties that help us operate our platform
                                (e.g., cloud hosting, payment processing)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                                sale of assets</li>
                        </ul>
                        <p className="mt-4 font-semibold text-green-700">
                            We do NOT sell your personal information to third parties.
                        </p>
                    </section>

                    {/* 6. Data Retention */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                        <p>We retain your personal information for as long as:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your account is active</li>
                            <li>Necessary to provide our services</li>
                            <li>Required by law (e.g., tax records for 5 years)</li>
                        </ul>
                        <p className="mt-4">
                            Upon account deletion, we will delete or anonymize your data within 90 days,
                            except where retention is required by law.
                        </p>
                    </section>

                    {/* 7. Your Rights */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">7. Your Rights Under POPIA</h2>
                        <p>You have the right to:</p>
                        <div className="bg-blue-50 p-6 rounded-lg mt-4">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    <span><strong>Access:</strong> Request a copy of your personal information</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    <span><strong>Correction:</strong> Request correction of inaccurate information</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    <span><strong>Deletion:</strong> Request deletion of your information</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    <span><strong>Objection:</strong> Object to processing of your information</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    <span><strong>Portability:</strong> Request your data in a portable format</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3">✓</span>
                                    <span><strong>Withdraw Consent:</strong> Withdraw your consent at any time</span>
                                </li>
                            </ul>
                        </div>
                        <p className="mt-4">
                            To exercise these rights, contact us at privacy@basilx.co.za
                        </p>
                    </section>

                    {/* 8. Cookies */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">8. Cookies</h2>
                        <p>We use cookies to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Essential Cookies:</strong> Enable core functionality (required)</li>
                            <li><strong>Analytics Cookies:</strong> Understand how you use our platform</li>
                            <li><strong>Preference Cookies:</strong> Remember your settings</li>
                        </ul>
                        <p className="mt-4">
                            You can manage cookie preferences through your browser settings.
                        </p>
                    </section>

                    {/* 9. Data Security */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">9. Data Security</h2>
                        <p>We implement appropriate security measures including:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>SSL/TLS encryption for data in transit</li>
                            <li>Encrypted database storage</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and authentication</li>
                            <li>Secure password hashing (bcrypt)</li>
                            <li>Rate limiting to prevent abuse</li>
                        </ul>
                    </section>

                    {/* 10. International Transfers */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                        <p>
                            Our servers are located in the AWS Africa (Cape Town) region. If we transfer your
                            data internationally, we ensure appropriate safeguards are in place as required by POPIA.
                        </p>
                    </section>

                    {/* 11. Children's Privacy */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
                        <p>
                            ELIPHASx is not intended for use by children under 18. We do not knowingly collect
                            personal information from children.
                        </p>
                    </section>

                    {/* 12. Changes to This Policy */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of material
                            changes via email or through the platform. The "Last updated" date indicates when
                            the policy was last revised.
                        </p>
                    </section>

                    {/* 13. Contact Information */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                        <p>For privacy-related inquiries or to exercise your rights:</p>
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <p className="font-semibold">Information Officer</p>
                            <p>BASIL & Co (Pty) Ltd</p>
                            <p>Email: privacy@basilx.co.za</p>
                            <p>Support: eliphasxsupport@basilx.co.za</p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg mt-4 border border-yellow-200">
                            <p className="font-semibold text-yellow-800">Information Regulator (South Africa)</p>
                            <p className="text-sm text-yellow-700">
                                If you are not satisfied with our response, you may lodge a complaint with
                                the Information Regulator at: inforeg.org.za
                            </p>
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
                                ✓ I Agree to the Privacy Policy
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
                                By creating an account, you agree to this Privacy Policy.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
