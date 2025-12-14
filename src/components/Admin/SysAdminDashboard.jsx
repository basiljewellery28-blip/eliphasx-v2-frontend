import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sysadminAPI } from '../../services/api';
import { useApp } from '../../contexts/AppContext';

// Super Admin email whitelist (must match backend)
const SUPER_ADMIN_EMAILS = ['ntobekom@basilx.co.za', 'eliphasxsupport@basilx.co.za'];

const SysAdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useApp();
    const [stats, setStats] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    // Check if user is super admin
    const isSuperAdmin = user?.email && SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase());

    useEffect(() => {
        if (!isSuperAdmin) {
            navigate('/dashboard');
            return;
        }
        loadData();
    }, [isSuperAdmin]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, logsRes, orgsRes, healthRes] = await Promise.all([
                sysadminAPI.getStats(),
                sysadminAPI.getAuditLogs({ limit: 20 }),
                sysadminAPI.getOrganizations(),
                sysadminAPI.getHealth()
            ]);
            setStats(statsRes.data);
            setAuditLogs(logsRes.data.logs);
            setOrganizations(orgsRes.data.organizations);
            setHealth(healthRes.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load system data');
        } finally {
            setLoading(false);
        }
    };

    const handleOrgStatusChange = async (orgId, newStatus) => {
        try {
            await sysadminAPI.updateOrgStatus(orgId, newStatus);
            loadData(); // Refresh data
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (!isSuperAdmin) {
        return <div className="p-8 text-center text-red-600">🚫 Access Denied - Super Admin Only</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                        <h1 className="text-2xl font-bold text-yellow-400">🛡️ Super Admin Dashboard</h1>
                    </div>
                    <span className="text-sm text-gray-400">Logged in as: {user?.email}</span>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex space-x-2 mb-6">
                    {['overview', 'organizations', 'audit-logs', 'health'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize ${activeTab === tab ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-gray-400 text-sm mb-2">Organizations</h3>
                            <p className="text-3xl font-bold text-white">{stats.overview.organizations.total}</p>
                            <p className="text-sm text-green-400">Active: {stats.overview.organizations.active}</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-gray-400 text-sm mb-2">Users</h3>
                            <p className="text-3xl font-bold text-white">{stats.overview.users}</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-gray-400 text-sm mb-2">Quotes</h3>
                            <p className="text-3xl font-bold text-white">{stats.overview.quotes.total}</p>
                            <p className="text-sm text-blue-400">Completed: {stats.overview.quotes.completed}</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-gray-400 text-sm mb-2">Clients</h3>
                            <p className="text-3xl font-bold text-white">{stats.overview.clients}</p>
                        </div>
                    </div>
                )}

                {/* Organizations Tab */}
                {activeTab === 'organizations' && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Users</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Quotes</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {organizations.map(org => (
                                    <tr key={org.id}>
                                        <td className="px-6 py-4 text-sm font-medium">{org.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${org.status === 'active' ? 'bg-green-600' :
                                                    org.status === 'trial' ? 'bg-blue-600' : 'bg-red-600'
                                                }`}>
                                                {org.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{org.user_count}</td>
                                        <td className="px-6 py-4 text-sm">{org.quote_count}</td>
                                        <td className="px-6 py-4">
                                            {org.status !== 'suspended' ? (
                                                <button
                                                    onClick={() => handleOrgStatusChange(org.id, 'suspended')}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleOrgStatusChange(org.id, 'active')}
                                                    className="text-green-400 hover:text-green-300 text-sm"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {auditLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{log.user_email || 'System'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{log.ip_address || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Health Tab */}
                {activeTab === 'health' && health && (
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-lg font-bold mb-4 text-green-400">
                                ✅ System Status: {health.status.toUpperCase()}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Node Version:</span>
                                    <span className="ml-2">{health.server.nodeVersion}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Uptime:</span>
                                    <span className="ml-2">{Math.floor(health.server.uptime / 60)} minutes</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Memory (Heap):</span>
                                    <span className="ml-2">{Math.round(health.server.memory.heapUsed / 1024 / 1024)} MB</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">DB Server Time:</span>
                                    <span className="ml-2">{new Date(health.database.serverTime).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="text-lg font-bold mb-4">Database Tables</h3>
                            <div className="space-y-2">
                                {health.database.tables.map(table => (
                                    <div key={table.table_name} className="flex justify-between text-sm">
                                        <span className="font-mono text-gray-300">{table.table_name}</span>
                                        <span className="text-gray-400">{table.row_count} rows</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SysAdminDashboard;
