import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';

const OrganizationDashboard = () => {
    const navigate = useNavigate();
    const { user, organization, logout } = useApp();
    const [stats, setStats] = useState(null);
    const [clients, setClients] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState('overview');

    // Check if user is admin or org owner
    const isOrgAdmin = user?.role === 'admin' || user?.is_org_owner;

    useEffect(() => {
        if (!isOrgAdmin) {
            navigate('/dashboard');
            return;
        }
        loadData();
    }, [isOrgAdmin]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');
            const [statsRes, clientsRes, logsRes] = await Promise.all([
                api.get('/organizations/dashboard-stats'),
                api.get('/clients'),
                api.get('/organizations/audit-logs').catch(() => ({ data: { logs: [] } }))
            ]);
            setStats(statsRes.data);
            setClients(clientsRes.data.clients || []);
            setAuditLogs(logsRes.data.logs || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load dashboard data');
            console.error('Org Dashboard Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyClient = async (clientId) => {
        try {
            await api.put(`/clients/${clientId}/verify`);
            loadData();
        } catch (err) {
            alert('Failed to verify client: ' + (err.response?.data?.error || err.message));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOrgAdmin) {
        return <div className="p-8 text-center text-red-600">🚫 Access Denied - Admin Only</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Organization Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => navigate('/dashboard')} className="mr-4 text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-purple-400">📊 Organization Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">{organization?.name || 'Organization'}</span>
                        <span className="text-sm text-gray-500">|</span>
                        <span className="text-sm text-gray-400">{user?.email}</span>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex space-x-2 mb-6">
                    {['overview', 'clients', 'audit-logs'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize ${activeTab === tab ? 'bg-purple-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-4 rounded-lg mb-6">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">⚠️ {error}</span>
                            <button onClick={loadData} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded">
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-gray-400 text-sm mb-2">Total Quotes</h3>
                            <p className="text-3xl font-bold text-white">{stats.quotes?.total || 0}</p>
                            <p className="text-sm text-green-400">Completed: {stats.quotes?.completed || 0}</p>
                            <p className="text-sm text-yellow-400">Drafts: {stats.quotes?.draft || 0}</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-gray-400 text-sm mb-2">Revenue</h3>
                            <p className="text-3xl font-bold text-white">R {(stats.revenue?.total || 0).toLocaleString()}</p>
                            <p className="text-sm text-blue-400">This month: R {(stats.revenue?.thisMonth || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-gray-400 text-sm mb-2">Clients</h3>
                            <p className="text-3xl font-bold text-white">{stats.clients?.total || 0}</p>
                            <p className="text-sm text-green-400">Verified: {stats.clients?.verified || 0}</p>
                            <p className="text-sm text-orange-400">Pending: {stats.clients?.pending || 0}</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-gray-400 text-sm mb-2">Team Members</h3>
                            <p className="text-3xl font-bold text-white">{stats.team?.members || 0}</p>
                        </div>
                    </div>
                )}

                {/* Clients Tab */}
                {activeTab === 'clients' && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No clients found</td>
                                    </tr>
                                ) : (
                                    clients.map(client => (
                                        <tr key={client.id} className="hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{client.name}</div>
                                                <div className="text-sm text-gray-400">{client.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {client.company || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${client.is_verified
                                                    ? 'bg-green-900 text-green-300'
                                                    : 'bg-yellow-900 text-yellow-300'
                                                    }`}>
                                                    {client.is_verified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                {formatDate(client.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/clients/${client.id}`)}
                                                        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                                                    >
                                                        View
                                                    </button>
                                                    {!client.is_verified && (
                                                        <button
                                                            onClick={() => handleVerifyClient(client.id)}
                                                            className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Audit Logs Tab */}
                {activeTab === 'audit-logs' && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No audit logs available</td>
                                    </tr>
                                ) : (
                                    auditLogs.map((log, index) => (
                                        <tr key={index} className="hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-purple-400">{log.action}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {log.user_email || 'System'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                                                {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                {formatDate(log.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Invite Team Member</h3>

                        {inviteSuccess ? (
                            <div className="bg-green-900/50 border border-green-500 text-green-200 p-4 rounded-lg text-center">
                                <p className="font-medium">✅ {inviteSuccess}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleInviteUser} className="space-y-4">
                                {inviteError && (
                                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm">
                                        {inviteError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="colleague@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1">Role</label>
                                    <select
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        <option value="user">Standard User</option>
                                        <option value="admin">Administrator</option>
                                        <option value="sales">Sales</option>
                                        <option value="designer">Designer</option>
                                    </select>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowInviteModal(false);
                                            setInviteError('');
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inviteLoading}
                                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {inviteLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Send Invite'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationDashboard;
