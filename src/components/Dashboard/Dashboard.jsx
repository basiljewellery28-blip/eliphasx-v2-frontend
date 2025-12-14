import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { clientAPI } from '../../services/api';

import GlobalSearch from '../Search/GlobalSearch';

const Dashboard = () => {
    const { user, quotes, clients, logout, loadInitialData } = useApp();
    const navigate = useNavigate();
    const [unverifiedCount, setUnverifiedCount] = useState(0);
    const [selectedClientId, setSelectedClientId] = useState('');

    useEffect(() => {
        loadInitialData(true);
    }, []);

    // Poll for unverified clients (Admin only)
    useEffect(() => {
        if (user && user.role === 'admin') {
            const fetchCount = async () => {
                try {
                    const response = await clientAPI.getUnverifiedCount();
                    setUnverifiedCount(response.data.count);
                } catch (error) {
                    console.error('Failed to fetch unverified count', error);
                }
            };

            fetchCount();
            const interval = setInterval(fetchCount, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const draftQuotes = quotes.filter(q => q.status === 'draft');
    const completedQuotes = quotes.filter(q => q.status === 'completed');

    return (
        <div className="min-h-screen bg-surface-alt">
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-heading font-bold text-primary mr-8">ELIPHASx</h1>
                            <div className="hidden md:block w-96">
                                <GlobalSearch />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user?.role === 'admin' && (
                                <Link to="/clients" className="relative p-2 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">View notifications</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unverifiedCount > 0 && (
                                        <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-xs text-white font-bold flex items-center justify-center">
                                            {unverifiedCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                            <span className="text-sm text-gray-500 font-medium">Welcome, {user?.email}</span>
                            <Link to="/billing" className="text-sm font-medium text-secondary hover:text-secondary-dark transition-colors">
                                Billing
                            </Link>
                            <Link to="/organization" className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                                Team
                            </Link>
                            <Link to="/profile" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                Profile
                            </Link>
                            {/* Super Admin Link - Only for whitelisted emails */}
                            {['ntobekom@basilx.co.za', 'eliphasxsupport@basilx.co.za'].includes(user?.email?.toLowerCase()) && (
                                <Link to="/sysadmin" className="text-sm font-medium text-yellow-600 hover:text-yellow-800 transition-colors flex items-center">
                                    🛡️ SysAdmin
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="card border-l-4 border-secondary">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Quotes</dt>
                        <dd className="mt-1 text-3xl font-heading font-semibold text-primary">{quotes.length}</dd>
                    </div>
                    <div className="card border-l-4 border-primary">
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Clients</dt>
                        <dd className="mt-1 text-3xl font-heading font-semibold text-primary">{clients.length}</dd>
                    </div>
                    <div className="card border-l-4 border-yellow-500">
                        <dt className="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                        <dd className="mt-1 text-3xl font-heading font-semibold text-primary">{draftQuotes.length}</dd>
                    </div>
                    <div className="card border-l-4 border-green-500">
                        <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                        <dd className="mt-1 text-3xl font-heading font-semibold text-primary">{completedQuotes.length}</dd>
                    </div>
                </div>

                {/* Start New Quote Section */}
                <div className="card p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-white border-blue-100">
                    <div>
                        <h3 className="text-lg font-heading font-bold text-primary">Start a New Quote</h3>
                        <p className="text-sm text-gray-500">Select a client to begin a new calculation.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            className="input-field w-full sm:w-64"
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            value={selectedClientId}
                        >
                            <option value="">Select Client...</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                if (selectedClientId) {
                                    navigate(`/quote/new?client_id=${selectedClientId}`);
                                } else {
                                    navigate('/quote/new');
                                }
                            }}
                            className="btn-primary whitespace-nowrap"
                        >
                            Start Blank
                        </button>
                        <button
                            onClick={() => navigate('/clients', { state: { openAddModal: true } })}
                            className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-md hover:bg-blue-50 font-medium whitespace-nowrap transition-colors"
                        >
                            + Add Client
                        </button>
                    </div>
                </div>

                {/* Draft Quotes */}
                <div className="card overflow-hidden mb-8">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-100">
                        <h3 className="text-lg leading-6 font-heading font-medium text-primary">
                            Draft Quotes
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {draftQuotes.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                            {quote.quote_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {quote.client_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(quote.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/quote/${quote.id}`} className="text-secondary hover:text-secondary-dark mr-4">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {draftQuotes.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                                            No draft quotes found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Completed Quotes */}
                <div className="card overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-100">
                        <h3 className="text-lg leading-6 font-heading font-medium text-primary">
                            Completed Quotes
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {completedQuotes.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                            {quote.quote_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {quote.client_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(quote.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(quote.total || 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/quote/${quote.id}`} className="text-secondary hover:text-secondary-dark font-medium">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {completedQuotes.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                            No completed quotes found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
