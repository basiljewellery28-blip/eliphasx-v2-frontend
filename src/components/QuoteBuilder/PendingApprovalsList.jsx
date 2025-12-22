import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApprovalStatusBadge } from './ApprovalComponents';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * PendingApprovalsList - Dashboard for managers to view and manage pending quotes
 */
const PendingApprovalsList = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingQuotes();
    }, []);

    const fetchPendingQuotes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/quotes/pending-approval`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    setError('You do not have permission to view pending approvals');
                    return;
                }
                throw new Error('Failed to fetch pending approvals');
            }

            const data = await response.json();
            setQuotes(data.quotes || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (quoteId) => {
        try {
            setActionLoading(quoteId);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/quotes/${quoteId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to approve quote');

            // Refresh the list
            fetchPendingQuotes();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (quoteId) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason || !reason.trim()) {
            alert('Rejection reason is required');
            return;
        }

        try {
            setActionLoading(quoteId);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/quotes/${quoteId}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason })
            });

            if (!response.ok) throw new Error('Failed to reject quote');

            // Refresh the list
            fetchPendingQuotes();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span>⏳</span>
                    Pending Approvals
                    {quotes.length > 0 && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">
                            {quotes.length}
                        </span>
                    )}
                </h2>
            </div>

            {quotes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    <span className="text-4xl mb-4 block">✅</span>
                    <p>No quotes pending approval</p>
                </div>
            ) : (
                <div className="divide-y">
                    {quotes.map((quote) => (
                        <div key={quote.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                            {quote.quote_number}
                                        </span>
                                        <ApprovalStatusBadge status={quote.status} />
                                    </div>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {quote.client_name || 'No client'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Submitted by: {quote.submitted_by_first_name} {quote.submitted_by_last_name}
                                        {' | '}
                                        Total: R{Number(quote.total || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/quotes/${quote.id}`)}
                                        className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleApprove(quote.id)}
                                        disabled={actionLoading === quote.id}
                                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {actionLoading === quote.id ? '...' : '✅ Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleReject(quote.id)}
                                        disabled={actionLoading === quote.id}
                                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                    >
                                        ❌ Reject
                                    </button>
                                </div>
                            </div>
                            {quote.approval_notes && (
                                <p className="mt-2 text-sm text-gray-600 italic">
                                    Note: {quote.approval_notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingApprovalsList;
