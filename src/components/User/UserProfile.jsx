import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import api from '../../services/api';
import ClientManager from '../ClientManager/ClientManager';
import AdminPanel from '../Admin/AdminPanel';
import StoneManager from '../Admin/StoneManager';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user, logout } = useApp();
    const [activeTab, setActiveTab] = useState('details');

    // Profile data
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        jobTitle: ''
    });
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const isOrgAdmin = user?.role === 'admin' || user?.is_org_owner;

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/auth/me');
            setProfile(response.data.user);
            setStats(response.data.stats);
            setFormData({
                firstName: response.data.user.firstName || '',
                lastName: response.data.user.lastName || '',
                phone: response.data.user.phone || '',
                jobTitle: response.data.user.jobTitle || ''
            });
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setSaveMessage('');
            const response = await api.put('/auth/profile', formData);
            setProfile(prev => ({ ...prev, ...response.data.user }));
            setIsEditing(false);
            setSaveMessage('Profile updated successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            setSaveMessage('Failed to save: ' + (err.response?.data?.error || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            setChangingPassword(true);
            setPasswordMessage({ type: '', text: '' });
            await api.put('/auth/change-password', passwordData);
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to change password'
            });
        } finally {
            setChangingPassword(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!user) return null;

    // Build tabs dynamically based on user permissions
    const tabs = [
        { id: 'details', label: '👤 Profile', always: true },
        { id: 'security', label: '🔐 Security', always: true },
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
                        {/* Profile Tab */}
                        {activeTab === 'details' && (
                            <div className="p-6 space-y-8">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            ✏️ Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                            >
                                                {saving ? 'Saving...' : '✓ Save Changes'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {saveMessage && (
                                    <div className={`p-3 rounded-lg text-sm ${saveMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {saveMessage}
                                    </div>
                                )}

                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-gray-500 mt-2">Loading profile...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-8 text-red-600">{error}</div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter first name"
                                                    />
                                                ) : (
                                                    <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                                        {profile?.firstName || <span className="text-gray-400 italic">Not set</span>}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter last name"
                                                    />
                                                ) : (
                                                    <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                                        {profile?.lastName || <span className="text-gray-400 italic">Not set</span>}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <div className="py-2 px-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">
                                                    {profile?.email}
                                                    <span className="ml-2 text-xs text-gray-400">(cannot be changed)</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                {isEditing ? (
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter phone number"
                                                    />
                                                ) : (
                                                    <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                                        {profile?.phone || <span className="text-gray-400 italic">Not set</span>}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={formData.jobTitle}
                                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="e.g., Sales Manager, Designer"
                                                    />
                                                ) : (
                                                    <div className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                                        {profile?.jobTitle || <span className="text-gray-400 italic">Not set</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Account Info Section */}
                                        <div className="pt-6 border-t">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Account Information</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="bg-blue-50 rounded-lg p-4">
                                                    <p className="text-xs text-blue-600 font-medium uppercase">Role</p>
                                                    <p className="text-lg font-semibold text-blue-900 capitalize">{profile?.role}</p>
                                                    {profile?.isOrgOwner && <span className="text-xs text-blue-600">+ Org Owner</span>}
                                                </div>
                                                <div className="bg-purple-50 rounded-lg p-4">
                                                    <p className="text-xs text-purple-600 font-medium uppercase">Organization</p>
                                                    <p className="text-lg font-semibold text-purple-900">{profile?.organizationName || 'N/A'}</p>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-4">
                                                    <p className="text-xs text-green-600 font-medium uppercase">Plan</p>
                                                    <p className="text-lg font-semibold text-green-900 capitalize">{profile?.organizationPlan || 'N/A'}</p>
                                                    <span className="text-xs text-green-600 capitalize">{profile?.subscriptionStatus}</span>
                                                </div>
                                                <div className="bg-orange-50 rounded-lg p-4">
                                                    <p className="text-xs text-orange-600 font-medium uppercase">Member Since</p>
                                                    <p className="text-lg font-semibold text-orange-900">{formatDate(profile?.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Usage Stats */}
                                        {stats && (
                                            <div className="pt-6 border-t">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Your Activity</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                                        <p className="text-3xl font-bold text-gray-900">{stats.totalQuotes}</p>
                                                        <p className="text-sm text-gray-600">Quotes Created</p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                                        <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
                                                        <p className="text-sm text-gray-600">Clients Added</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="p-6 space-y-8">
                                <h2 className="text-xl font-bold text-gray-900 border-b pb-4">🔐 Security Settings</h2>

                                {/* Password Change Form */}
                                <div className="max-w-md">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>

                                    {passwordMessage.text && (
                                        <div className={`p-3 rounded-lg text-sm mb-4 ${passwordMessage.type === 'success'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleChangePassword} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                                minLength={8}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Must be at least 8 characters with uppercase, lowercase, and a number
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={changingPassword}
                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {changingPassword ? 'Changing Password...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>

                                {/* Security Info */}
                                <div className="pt-6 border-t">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Two-Factor Authentication</span>
                                            <span className="text-gray-400">Coming Soon</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Last Password Change</span>
                                            <span className="text-gray-700">Not tracked</span>
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
                                        onClick={() => navigate('/organization')}
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
