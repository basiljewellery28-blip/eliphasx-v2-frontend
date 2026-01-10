import { useState, useEffect } from 'react';
import { billingAPI } from '../../services/billingService';
import api from '../../services/api';

/**
 * BranchSelector - Dropdown for switching between organization branches
 * Only shown for users with multi-branch access
 */
const BranchSelector = ({ currentOrgId, currentOrgName, onBranchSwitch }) => {
    const [branches, setBranches] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [switching, setSwitching] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, [currentOrgId]);

    const fetchBranches = async () => {
        try {
            setLoading(true);
            const response = await api.get('/branches');
            setBranches(response.data.branches || []);
        } catch (error) {
            console.error('Failed to fetch branches:', error);
            setBranches([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitch = async (branchId) => {
        if (branchId === currentOrgId) {
            setIsOpen(false);
            return;
        }

        try {
            setSwitching(true);
            const response = await api.post('/auth/switch-branch', { organizationId: branchId });

            // Update token in localStorage
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            // Notify parent component
            if (onBranchSwitch) {
                onBranchSwitch(response.data.organization);
            }

            // Refresh page to reload with new context
            window.location.reload();
        } catch (error) {
            console.error('Failed to switch branch:', error);
            alert(error.response?.data?.error || 'Failed to switch branch');
        } finally {
            setSwitching(false);
            setIsOpen(false);
        }
    };

    // Don't render if user only has access to one org
    if (branches.length <= 1) {
        return null;
    }

    const currentBranch = branches.find(b => b.id === currentOrgId);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={switching}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <span className="text-gray-500">🏢</span>
                <span className="font-medium text-gray-700 max-w-[120px] truncate">
                    {currentBranch?.name || currentOrgName}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                        <div className="py-2 max-h-64 overflow-y-auto">
                            {branches.map((branch) => (
                                <button
                                    key={branch.id}
                                    onClick={() => handleSwitch(branch.id)}
                                    disabled={switching}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${branch.id === currentOrgId ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{branch.is_branch ? '🏪' : '🏢'}</span>
                                        <span className="truncate">{branch.name}</span>
                                    </div>
                                    {branch.id === currentOrgId && (
                                        <span className="text-blue-600 text-xs">Current</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BranchSelector;
