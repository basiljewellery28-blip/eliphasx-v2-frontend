import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * UpgradeModal Component
 * Displays a modal prompting users to upgrade when they hit plan limits.
 * 
 * Props:
 * - isOpen: boolean - controls modal visibility
 * - onClose: function - called when modal should close
 * - feature: string - the feature they're trying to access (e.g., "Team Members", "Quotes")
 * - currentPlan: string - their current plan name
 * - requiredPlan: string - the plan they need to upgrade to (optional, defaults to "Professional")
 */
const UpgradeModal = ({ isOpen, onClose, feature, currentPlan, requiredPlan = 'Professional' }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        onClose();
        navigate('/billing');
    };

    // Feature-specific messaging
    const getFeatureDetails = () => {
        switch (feature) {
            case 'Team Members':
                return {
                    icon: '👥',
                    description: 'Add more team members to collaborate on quotes and manage clients together.',
                    benefits: ['Up to 5 team members', 'Role-based access', 'Activity tracking']
                };
            case 'Quotes':
                return {
                    icon: '📄',
                    description: "You've reached your monthly quote limit. Upgrade to create unlimited quotes.",
                    benefits: ['Unlimited quotes', 'Advanced templates', 'Priority PDF generation']
                };
            case 'White Label':
                return {
                    icon: '🎨',
                    description: 'Remove ELIPHASx branding and use your own logo on all PDF quotes.',
                    benefits: ['Your logo on PDFs', 'Custom header/footer', 'Professional presentation']
                };
            case 'API Access':
                return {
                    icon: '🔌',
                    description: 'Connect ELIPHASx to your existing systems with our powerful API.',
                    benefits: ['RESTful API', 'Webhook integrations', 'Custom automation']
                };
            default:
                return {
                    icon: '🚀',
                    description: `Unlock ${feature} by upgrading to ${requiredPlan}.`,
                    benefits: ['More features', 'Better limits', 'Premium support']
                };
        }
    };

    const details = getFeatureDetails();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <span className="text-4xl block mb-2">{details.icon}</span>
                    <h2 className="text-xl font-bold">Upgrade to Unlock</h2>
                    <p className="text-blue-100 text-sm mt-1">
                        {feature} • {requiredPlan} Plan
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 text-center mb-4">
                        {details.description}
                    </p>

                    {/* Benefits List */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-xs uppercase text-gray-500 font-semibold mb-2">
                            What you'll get:
                        </p>
                        <ul className="space-y-2">
                            {details.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-center text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Current Plan Badge */}
                    <div className="text-center text-sm text-gray-500 mb-4">
                        Current Plan: <span className="font-medium capitalize">{currentPlan || 'Trial'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={handleUpgrade}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 text-center">
                    <p className="text-xs text-gray-500">
                        All plans come with a 28-day money-back guarantee
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
