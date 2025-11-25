import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const Dashboard = () => {
    const { user, quotes, clients, logout, loadInitialData } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        loadInitialData(true);
    }, []);

    const draftQuotes = quotes.filter(q => q.status === 'draft');
    const completedQuotes = quotes.filter(q => q.status === 'completed');

    return (
        <div className="min-h-screen bg-surface-alt">
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-heading font-bold text-primary">ELIPHASx</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500 font-medium">Welcome, {user?.email}</span>
                            <Link to="/profile" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                Profile
                            </Link>
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
                            onChange={(e) => {
                                if (e.target.value) {
                                    navigate(`/quote/new?client_id=${e.target.value}`);
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Client...</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                        <Link
                            to="/quote/new"
                            className="btn-primary whitespace-nowrap"
                        >
                            Start Blank
                        </Link>
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
                                            <Link to={`/quote/${quote.id}`} className="text-secondary hover:text-secondary-dark mr-4">
                                                View
                                            </Link>
                                            <a href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                PDF
                                            </a>
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
