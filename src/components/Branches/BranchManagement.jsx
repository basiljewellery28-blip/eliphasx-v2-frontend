import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useApp } from '../../contexts/AppContext';

/**
 * BranchManagement - Admin page for managing organization branches
 * Only accessible to Enterprise plan users
 */
const BranchManagement = () => {
    const { user } = useApp();
    const [group, setGroup] = useState(null);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Create branch form
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [newBranchEmail, setNewBranchEmail] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchBranchData();
    }, []);

    const fetchBranchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/branches/group');
            setGroup(response.data.group);
            setBranches(response.data.branches || []);
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Multi-branch is only available on Enterprise plans.');
            } else {
                setError(err.response?.data?.error || 'Failed to load branch data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBranch = async (e) => {
        e.preventDefault();
        if (!newBranchName.trim()) return;

        try {
            setCreating(true);
            setError('');
            await api.post('/branches', {
                name: newBranchName,
                contactEmail: newBranchEmail
            });
            setSuccess('Branch created successfully!');
            setNewBranchName('');
            setNewBranchEmail('');
            setShowCreateForm(false);
            fetchBranchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create branch');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteBranch = async (branchId, branchName) => {
        if (!window.confirm(`Are you sure you want to delete "${branchName}"? All data will be moved to the parent organization.`)) {
            return;
        }

        try {
            setError('');
            await api.delete(`/branches/${branchId}`);
            setSuccess('Branch deleted successfully');
            fetchBranchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete branch');
        }
    };

    const handleCreateGroup = async () => {
        try {
            setError('');
            await api.post('/branches/group', { name: `${user?.organizationName || 'My'} Group` });
            setSuccess('Organization group created!');
            fetchBranchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create group');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading branches...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-xl font-bold text-primary">
                                ELIPHASx
                            </Link>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-600">Branch Management</span>
                        </div>
                        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                        <button onClick={() => setSuccess('')} className="float-right">×</button>
                    </div>
                )}

                {/* No Group Yet */}
                {!group && !error && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="text-6xl mb-4">🏢</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Up Multi-Branch</h2>
                        <p className="text-gray-600 mb-6">
                            Create an organization group to start adding branches.
                            This allows you to manage multiple locations under one account.
                        </p>
                        <button
                            onClick={handleCreateGroup}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                        >
                            Create Organization Group
                        </button>
                    </div>
                )}

                {/* Group Exists */}
                {group && (
                    <>
                        {/* Group Header */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
                                    <p className="text-gray-600">{branches.length} organization(s) in this group</p>
                                </div>
                                {user?.is_org_owner && (
                                    <button
                                        onClick={() => setShowCreateForm(!showCreateForm)}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                                    >
                                        + Add Branch
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Create Branch Form */}
                        {showCreateForm && (
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Create New Branch</h3>
                                <form onSubmit={handleCreateBranch} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Branch Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={newBranchName}
                                            onChange={(e) => setNewBranchName(e.target.value)}
                                            placeholder="e.g., Cape Town Branch"
                                            className="input-field w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            value={newBranchEmail}
                                            onChange={(e) => setNewBranchEmail(e.target.value)}
                                            placeholder="branch@company.com"
                                            className="input-field w-full"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={creating}
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50"
                                        >
                                            {creating ? 'Creating...' : 'Create Branch'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateForm(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Branches List */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quotes</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {branches.map((branch) => (
                                        <tr key={branch.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span>{branch.is_branch ? '🏪' : '🏢'}</span>
                                                    <span className="font-medium text-gray-900">{branch.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${branch.is_branch
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {branch.is_branch ? 'Branch' : 'Parent'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{branch.user_count || 0}</td>
                                            <td className="px-6 py-4 text-gray-600">{branch.quote_count || 0}</td>
                                            <td className="px-6 py-4 text-right">
                                                {branch.is_branch && user?.is_org_owner && (
                                                    <button
                                                        onClick={() => handleDeleteBranch(branch.id, branch.name)}
                                                        className="text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Help Info */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                            <strong>💡 Tip:</strong> Users can switch between branches using the organization
                            selector in the navigation bar. Each branch has its own clients, quotes, and branding settings.
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default BranchManagement;
