import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billingAPI } from '../../services/billingService';
import { useApp } from '../../contexts/AppContext';

const BillingPage = () => {
    const navigate = useNavigate();
    const { user } = useApp();
    const [billing, setBilling] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [processingPlan, setProcessingPlan] = useState(null);
    const [showComparison, setShowComparison] = useState(false);

    const plans = [
        {
            id: 'essential',
            name: 'Essential',
            description: 'Core toolset for craftsmen & independent jewelers',
            monthly: 899,
            annual: 8990,
            features: [
                '💎 Basic Quote Calculator',
                '📄 Standard PDF Exports',
                '👤 1 User Seat',
                '📊 50 Quotes per Month',
                '☁️ Daily Cloud Backups'
            ]
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Advanced capabilities for growing studios',
            monthly: 1999,
            annual: 19990,
            popular: true,
            features: [
                '🚀 All Essential Features, plus:',
                '♾️ Unlimited Quotes',
                '✨ White-label Branding',
                '👥 5 Team Members',
                '📈 Profit Analytics',
                '⚡ Priority Support'
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'Scalable solutions for manufacturing operations',
            monthly: 3999,
            annual: 39990,
            features: [
                '🏢 All Professional Features, plus:',
                '🌍 Unlimited Team Members',
                '🔌 API Access',
                '🛡️ Compliance & Logs',
                '💼 Dedicated Manager',
                '🎓 Staff Training Sessions'
            ]
        }
    ];

    useEffect(() => {
        fetchBillingStatus();
    }, []);

    const fetchBillingStatus = async () => {
        try {
            setLoading(true);
            const data = await billingAPI.getStatus();
            setBilling(data);
        } catch (err) {
            setError('Failed to load billing information');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId) => {
        try {
            setProcessingPlan(planId);
            const data = await billingAPI.initializePayment(planId, billingCycle);

            // Initialize Paystack popup
            if (window.PaystackPop && data.paystack) {
                const handler = window.PaystackPop.setup({
                    key: data.paystack.publicKey,
                    email: data.paystack.email,
                    amount: data.paystack.amount,
                    currency: data.paystack.currency,
                    ref: data.paystack.reference,
                    metadata: data.paystack.metadata,
                    callback: function (response) {
                        console.log('Payment successful:', response);
                        fetchBillingStatus();
                        alert('Payment successful! Your subscription is now active.');
                    },
                    onClose: function () {
                        console.log('Payment window closed');
                    }
                });
                handler.openIframe();
            } else {
                // Fallback for testing without Paystack
                alert(`Would redirect to Paystack for ${planId} plan (${billingCycle})`);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to initialize payment');
        } finally {
            setProcessingPlan(null);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
            return;
        }

        try {
            setProcessingPlan('cancel');
            await billingAPI.cancelSubscription();
            alert('Subscription cancelled. You will have access until the end of your current billing period.');
            fetchBillingStatus();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to cancel subscription');
        } finally {
            setProcessingPlan(null);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="absolute left-0 top-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full shadow-sm border border-gray-100"
                            title="Go Back"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    </div>
                    <h1 className="text-4xl font-heading font-bold text-primary-dark mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Premium jewelry manufacturing software for high-end businesses.
                        All plans include a 14-day free trial.
                    </p>
                </div>

                {/* Current Status Banner */}
                {billing?.organization && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {billing.organization.name}
                                </h3>
                                <p className="text-gray-600">
                                    Current Plan: <span className="font-medium capitalize">{billing.organization.plan}</span>
                                    {' • '}
                                    Status: <span className={`font-medium capitalize ${billing.organization.status === 'active' ? 'text-green-600' :
                                        billing.organization.status === 'trial' ? 'text-blue-600' :
                                            'text-red-600'
                                        }`}>{billing.organization.status}</span>
                                </p>
                                {billing.daysRemaining !== null && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {billing.organization.status === 'trial'
                                            ? `Trial ends in ${billing.daysRemaining} days`
                                            : `${billing.daysRemaining} days remaining in billing period`
                                        }
                                    </p>
                                )}
                            </div>
                            {billing.organization.status === 'active' && (
                                <button
                                    onClick={handleCancel}
                                    disabled={processingPlan === 'cancel'}
                                    className="mt-4 md:mt-0 text-sm text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    {processingPlan === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Billing Cycle Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-full p-1 shadow-sm border border-gray-200 inline-flex">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'annual'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Annual <span className="text-xs opacity-75">(Save 17%)</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8 text-center">
                        {error}
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${plan.popular
                                ? 'border-secondary ring-2 ring-secondary ring-opacity-20'
                                : 'border-gray-100'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-secondary text-white text-sm font-medium px-4 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold text-primary-dark">
                                    {formatCurrency(billingCycle === 'annual' ? plan.annual / 12 : plan.monthly)}
                                </span>
                                <span className="text-gray-500">/month</span>
                                {billingCycle === 'annual' && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        Billed {formatCurrency(plan.annual)} annually
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={processingPlan || billing?.organization?.plan === plan.id}
                                className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${billing?.organization?.plan === plan.id
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : plan.popular
                                        ? 'bg-secondary hover:bg-secondary-dark text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                        : 'bg-primary hover:bg-primary-light text-white shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {billing?.organization?.plan === plan.id
                                    ? 'Current Plan'
                                    : processingPlan === plan.id
                                        ? 'Processing...'
                                        : 'Get Started'
                                }
                            </button>
                        </div>
                    ))}
                </div>



                {/* Comparison Table Toggle */}
                <div className="text-center mt-12 mb-8">
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="text-primary font-medium hover:text-primary-dark flex items-center justify-center mx-auto transition-colors"
                    >
                        {showComparison ? 'Hide Plan Comparison' : 'Compare All Features'}
                        <svg className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${showComparison ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Comparison Chart */}
                {showComparison && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-12 animate-fade-in-down">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-4 font-bold text-gray-900 w-1/4">Feature</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-1/4">Essential</th>
                                        <th className="p-4 text-center font-bold text-primary w-1/4 bg-blue-50">Professional</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-1/4">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { metric: 'Team Size', essential: '1 User', professional: '5 Users', enterprise: 'Unlimited' },
                                        { metric: 'Quotes per Month', essential: '50', professional: 'Unlimited', enterprise: 'Unlimited' },
                                        { metric: 'Quote Calculator', essential: '✅ Basic', professional: '✅ Advanced', enterprise: '✅ Advanced' },
                                        { metric: 'PDF Branding', essential: 'Standard', professional: 'Your Logo', enterprise: 'Custom Layouts' },
                                        { metric: 'Cloud Backups', essential: 'Daily', professional: 'Hourly', enterprise: 'Real-time' },
                                        { metric: 'Support Channel', essential: 'Email', professional: 'Priority WhatsApp', enterprise: 'Dedicated Mgr' },
                                        { metric: 'API Access', essential: '-', professional: '-', enterprise: '✅' },
                                        { metric: 'Audit Logs', essential: '-', professional: '-', enterprise: '✅' },
                                        { metric: 'Staff Training', essential: '-', professional: '-', enterprise: '✅' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900 border-r border-gray-100">{row.metric}</td>
                                            <td className="p-4 text-center text-gray-600 border-r border-gray-100">{row.essential}</td>
                                            <td className="p-4 text-center font-medium text-gray-900 bg-blue-50/30 border-r border-blue-100">{row.professional}</td>
                                            <td className="p-4 text-center text-gray-600">{row.enterprise}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 text-sm">
                    <p>All prices in South African Rand (ZAR). Cancel anytime.</p>
                    <p className="mt-1">Questions? Contact us at <a href="mailto:eliphasxlegal@basilx.co.za" className="text-primary hover:underline">eliphasxlegal@basilx.co.za</a></p>
                </div>
            </div>
        </div>

    );
};

export default BillingPage;
