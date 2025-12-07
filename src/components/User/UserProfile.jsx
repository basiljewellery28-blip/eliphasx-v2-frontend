import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import ClientManager from '../ClientManager/ClientManager';
import AdminPanel from '../Admin/AdminPanel';
import StoneManager from '../Admin/StoneManager';

const UserProfile = () => {
    const { user, logout } = useApp();
    const [activeTab, setActiveTab] = useState('details');

    if (!user) return null;

    return (
        <div className="min-h-screen bg-surface-alt">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => window.location.href = '/dashboard'} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-heading font-bold text-primary">User Profile</h1>
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
                        <nav className="space-y-1">
                            {[
                                { id: 'details', label: 'User Details', icon: 'User' },
                                { id: 'clients', label: 'Manage Clients', icon: 'Users' },
                                ...(user.role === 'admin' ? [
                                    { id: 'metals', label: 'Manage Metals', icon: 'Database' },
                                    { id: 'stones', label: 'Manage Stones', icon: 'Diamond' },
                                ] : []),
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                        : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                                        } group flex items-center px-3 py-2 text-sm font-medium w-full transition-colors duration-150`}
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
                                </div>
                            </div>
                        )}

                        {activeTab === 'clients' && (
                            <div className="p-2">
                                <ClientManager />
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
