import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import ClientManager from '../ClientManager/ClientManager';
import AdminPanel from '../Admin/AdminPanel';
import StoneManager from '../Admin/StoneManager';
import OrganizationDashboard from '../Organization/OrganizationDashboard';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user, logout } = useApp();
    const [activeTab, setActiveTab] = useState('details');

    if (!user) return null;

    const isOrgAdmin = user.role === 'admin' || user.is_org_owner;

    // Build tabs dynamically based on user permissions
    const tabs = [
        { id: 'details', label: '👤 Profile', always: true },
        { id: 'billing', label: '💳 Billing', always: true },
        { id: 'team', label: '👥 Team', always: true },
        { id: 'clients', label: '📋 Clients', always: true },
        { id: 'org-dashboard', label: '📊 Dashboard', admin: true },
        { id: 'metals', label: '🥇 Metals', admin: true },
        { id: 'stones', label: '💎 Stones', admin: true },
    ].filter(tab => tab.always || (tab.admin && isOrgAdmin));

    return (
        <div className="min-h-screen bg-surface-alt">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-heading font-bold text-primary">Settings</h1>
                    </div>
                    <button onClick={logout} className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <nav className="space-y-1 bg-white rounded-lg shadow p-2">
                            {tabs.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                                        } group flex items-center px-3 py-2.5 text-sm font-medium w-full transition-colors duration-150 rounded-r-md`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 bg-white shadow rounded-lg min-h-[500px]">
                        {activeTab === 'details' && (
                            <div className="p-6 space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 border-b pb-4">User Details</h2>
                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-500 sm:text-sm">
                                            {user.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-500 sm:text-sm capitalize">
                                            {user.role}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Organization</label>
                                        <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-500 sm:text-sm">
                                            {user.organization_name || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Admin Status</label>
                                        <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm text-gray-500 sm:text-sm">
                                            {isOrgAdmin ? '✓ Organization Admin' : 'Standard User'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="p-6 space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Billing & Subscription</h2>
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-4">💳</div>
                                    <p className="text-gray-500 mb-4">Manage your subscription and billing details</p>
                                    <button
                                        onClick={() => navigate('/billing')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Open Billing Page
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'team' && (
                            <div className="p-6 space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Team Management</h2>
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-4">👥</div>
                                    <p className="text-gray-500 mb-4">Manage your team members and invitations</p>
                                    <button
                                        onClick={() => navigate('/org-dashboard?tab=team')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Open Team Settings
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'clients' && (
                            <div className="p-2">
                                <ClientManager />
                            </div>
                        )}

                        {activeTab === 'org-dashboard' && (
                            <div className="p-6 space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Organization Dashboard</h2>
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-4">📊</div>
                                    <p className="text-gray-500 mb-4">View organization statistics and activity</p>
                                    <button
                                        onClick={() => navigate('/org-dashboard')}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Open Dashboard
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'metals' && (
                            <div className="p-2">
                                <AdminPanel />
                            </div>
                        )}

                        {activeTab === 'stones' && (
                            <div className="p-2">
                                <StoneManager />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
