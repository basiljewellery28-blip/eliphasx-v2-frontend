import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizationAPI, billingAPI } from '../../services/billingService';
import { useApp } from '../../contexts/AppContext';
import UpgradeModal from './UpgradeModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrganizationSettings = () => {
    const navigate = useNavigate();
    const { user } = useApp();
    const isOrgAdmin = user?.role === 'admin' || user?.is_org_owner;
    const [org, setOrg] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('sales');
    const [inviting, setInviting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [orgName, setOrgName] = useState('');

    // Branding state
    const [branding, setBranding] = useState({
        logoUrl: '',
        headerText: '',
        tagline: '',
        footerText: '',
        footerValidityText: ''
    });
    const [brandingEditMode, setBrandingEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Upgrade modal state
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeFeature, setUpgradeFeature] = useState('');
    const [usage, setUsage] = useState(null);

    useEffect(() => {
        fetchOrganization();
        fetchUsers();
        fetchBranding();
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const data = await billingAPI.getUsage();
            setUsage(data);
        } catch (err) {
            console.error('Failed to fetch usage:', err);
        }
    };

    const fetchOrganization = async () => {
        try {
            const data = await organizationAPI.getCurrent();
            setOrg(data.organization);
            setOrgName(data.organization.name);
        } catch (err) {
            setError('Failed to load organization');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await organizationAPI.getUsers();
            setUsers(data.users);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    const fetchBranding = async () => {
        try {
            const data = await organizationAPI.getBranding();
            setBranding({
                logoUrl: data.branding?.logoUrl || '',
                headerText: data.branding?.headerText || '',
                tagline: data.branding?.tagline || '',
                footerText: data.branding?.footerText || '',
                footerValidityText: data.branding?.footerValidityText || ''
            });
        } catch (err) {
            console.error('Failed to load branding:', err);
        }
    };

    const handleUpdateOrg = async (e) => {
        e.preventDefault();
        try {
            await organizationAPI.update({ name: orgName });
            setSuccess('Organization updated successfully');
            setEditMode(false);
            fetchOrganization();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update organization');
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail) return;

        try {
            setInviting(true);
            const data = await organizationAPI.inviteUser(inviteEmail, inviteRole);
            setSuccess(`Invitation created! Share this link: ${data.invitation.signupUrl}`);
            setInviteEmail('');
            setTimeout(() => setSuccess(''), 10000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send invitation');
        } finally {
            setInviting(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            setError('Only PNG and JPG images are allowed');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError('File size must be less than 2MB');
            return;
        }

        try {
            setUploading(true);
            const data = await organizationAPI.uploadLogo(file);
            setBranding(prev => ({ ...prev, logoUrl: data.logoUrl }));
            setSuccess('Logo uploaded successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteLogo = async () => {
        try {
            await organizationAPI.deleteLogo();
            setBranding(prev => ({ ...prev, logoUrl: '' }));
            setSuccess('Logo removed successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to remove logo');
        }
    };

    const handleUpdateBranding = async (e) => {
        e.preventDefault();
        try {
            await organizationAPI.updateBranding({
                headerText: branding.headerText,
                tagline: branding.tagline,
                footerText: branding.footerText,
                footerValidityText: branding.footerValidityText
            });
            setSuccess('Branding updated successfully');
            setBrandingEditMode(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update branding');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-3xl font-heading font-bold text-primary-dark">
                    Organization Settings
                </h1>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                    {error}
                    <button onClick={() => setError('')} className="float-right text-red-400 hover:text-red-600">×</button>
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
                    {success}
                    <button onClick={() => setSuccess('')} className="float-right text-green-400 hover:text-green-600">×</button>
                </div>
            )}

            {/* Organization Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Organization Details</h2>
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="text-sm text-primary hover:text-primary-dark"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {editMode ? (
                    <form onSubmit={handleUpdateOrg} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Organization Name
                            </label>
                            <input
                                type="text"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditMode(false);
                                    setOrgName(org.name);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-gray-500">Name</span>
                            <p className="font-medium">{org?.name}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Plan</span>
                            <p className="font-medium capitalize">{org?.plan}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Status</span>
                            <p className={`font-medium capitalize ${org?.status === 'active' ? 'text-green-600' :
                                org?.status === 'trial' ? 'text-blue-600' : 'text-red-600'
                                }`}>
                                {org?.status}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* PDF Branding */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">PDF Branding</h2>
                        <p className="text-sm text-gray-500 mt-1">Customize how your quotes appear to clients</p>
                    </div>
                    {!brandingEditMode && (
                        <button
                            onClick={() => setBrandingEditMode(true)}
                            className="text-sm text-primary hover:text-primary-dark"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {/* Logo Upload Section */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Company Logo</label>
                    <div className="flex items-center gap-6">
                        {/* Logo Preview */}
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                            {branding.logoUrl ? (
                                <img
                                    src={`${API_URL.replace('/api', '')}${branding.logoUrl}`}
                                    alt="Company Logo"
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm text-center px-2">No logo uploaded</span>
                            )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleLogoUpload}
                                accept="image/png,image/jpeg,image/jpg"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 text-sm"
                            >
                                {uploading ? 'Uploading...' : branding.logoUrl ? 'Change Logo' : 'Upload Logo'}
                            </button>
                            {branding.logoUrl && (
                                <button
                                    type="button"
                                    onClick={handleDeleteLogo}
                                    className="px-4 py-2 text-red-600 hover:text-red-700 text-sm"
                                >
                                    Remove Logo
                                </button>
                            )}
                            <p className="text-xs text-gray-500">PNG or JPG, max 2MB</p>
                        </div>
                    </div>
                </div>

                {/* Text Fields */}
                {brandingEditMode ? (
                    <form onSubmit={handleUpdateBranding} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Header Text (Company Name)
                            </label>
                            <input
                                type="text"
                                value={branding.headerText}
                                onChange={(e) => setBranding(prev => ({ ...prev, headerText: e.target.value }))}
                                className="input-field"
                                placeholder="Your Company Name"
                            />
                            <p className="text-xs text-gray-500 mt-1">Displayed when no logo is uploaded</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tagline
                            </label>
                            <input
                                type="text"
                                value={branding.tagline}
                                onChange={(e) => setBranding(prev => ({ ...prev, tagline: e.target.value }))}
                                className="input-field"
                                placeholder="Quality Jewelry Manufacturing"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Footer Text
                            </label>
                            <input
                                type="text"
                                value={branding.footerText}
                                onChange={(e) => setBranding(prev => ({ ...prev, footerText: e.target.value }))}
                                className="input-field"
                                placeholder="Thank you for your business."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quote Validity Text
                            </label>
                            <input
                                type="text"
                                value={branding.footerValidityText}
                                onChange={(e) => setBranding(prev => ({ ...prev, footerValidityText: e.target.value }))}
                                className="input-field"
                                placeholder="This quote is valid for 7 days from the date of issue."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
                            >
                                Save Branding
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setBrandingEditMode(false);
                                    fetchBranding();
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-500">Header Text</span>
                            <p className="font-medium">{branding.headerText || <span className="text-gray-400 italic">Not set</span>}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Tagline</span>
                            <p className="font-medium">{branding.tagline || <span className="text-gray-400 italic">Not set</span>}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Footer Text</span>
                            <p className="font-medium">{branding.footerText || <span className="text-gray-400 italic">Not set</span>}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Quote Validity</span>
                            <p className="font-medium">{branding.footerValidityText || <span className="text-gray-400 italic">Not set</span>}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Email</th>
                                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Role</th>
                                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((member) => (
                                <tr key={member.id} className="border-b border-gray-100">
                                    <td className="py-3 px-2">{member.email}</td>
                                    <td className="py-3 px-2 capitalize">{member.role}</td>
                                    <td className="py-3 px-2">
                                        {member.is_org_owner && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                                Owner
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite User Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Invite Team Member</h2>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    // Check if user can invite
                    if (!isOrgAdmin) {
                        setUpgradeFeature('Team Members');
                        setShowUpgradeModal(true);
                        return;
                    }
                    // Check user limit - but allow accountants (they don't count)
                    if (inviteRole !== 'accountant' && usage && !usage.users.unlimited && usage.users.count >= usage.users.limit) {
                        setUpgradeFeature('Team Members');
                        setShowUpgradeModal(true);
                        return;
                    }
                    // Proceed with invite
                    handleInvite(e);
                }} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="input-field flex-1"
                        required
                    />
                    <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="input-field w-full sm:w-48"
                    >
                        <option value="sales">Sales</option>
                        <option value="designer">Designer (No Prices)</option>
                        <option value="admin">Admin</option>
                        <option value="accountant">Accountant (Read-only)</option>
                    </select>
                    <button
                        type="submit"
                        disabled={inviting}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50"
                    >
                        {inviting ? 'Inviting...' : 'Invite'}
                    </button>
                </form>

                {/* Show limit info and seat addons for non-unlimited plans */}
                {usage && !usage.users.unlimited && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm text-gray-600">
                                    Team: <strong>{usage.users.count}</strong> / {usage.users.totalLimit} members
                                    {usage.users.addonSeats > 0 && (
                                        <span className="text-blue-600 ml-1">
                                            ({usage.users.baseLimit} plan + {usage.users.addonSeats} addons)
                                        </span>
                                    )}
                                </span>
                                {usage.users.percent >= 80 && (
                                    <span className="text-yellow-600 ml-2">⚠️ Approaching limit</span>
                                )}
                            </div>
                        </div>

                        {/* Seat Addon Purchase - Only for Professional plan */}
                        {usage.seatAddons?.available && isOrgAdmin && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Need more seats?</span>
                                        <p className="text-xs text-gray-500">R{usage.seatAddons.pricePerSeat}/month per seat</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            try {
                                                const data = await billingAPI.purchaseSeatAddons(1);
                                                // If Paystack popup needed
                                                if (window.PaystackPop && data.paystack) {
                                                    const handler = window.PaystackPop.setup({
                                                        key: data.paystack.publicKey,
                                                        email: data.paystack.email,
                                                        amount: data.paystack.amount,
                                                        currency: data.paystack.currency,
                                                        ref: data.paystack.reference,
                                                        metadata: data.paystack.metadata,
                                                        callback: function (response) {
                                                            setSuccess('Seat addon purchased!');
                                                            fetchUsage();
                                                        },
                                                        onClose: function () { }
                                                    });
                                                    handler.openIframe();
                                                } else {
                                                    setSuccess(data.message);
                                                    fetchUsage();
                                                }
                                            } catch (err) {
                                                setError(err.response?.data?.error || 'Failed to purchase seat');
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        + Buy 1 Seat
                                    </button>
                                </div>
                                {usage.seatAddons.currentAddons > 0 && (
                                    <p className="mt-2 text-xs text-gray-500">
                                        Current addons: {usage.seatAddons.currentAddons} seat(s) = R{usage.seatAddons.currentAddons * usage.seatAddons.pricePerSeat}/mo extra
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                feature={upgradeFeature}
                currentPlan={usage?.plan || org?.plan}
                requiredPlan={upgradeFeature === 'Team Members' ? 'Professional' : 'Enterprise'}
            />
        </div>
    );
};

export default OrganizationSettings;
