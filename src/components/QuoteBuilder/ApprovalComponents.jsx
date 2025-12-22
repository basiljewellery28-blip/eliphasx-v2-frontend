import React from 'react';

/**
 * ApprovalStatusBadge - Shows the approval status of a quote
 */
const ApprovalStatusBadge = ({ status }) => {
    const statusConfig = {
        draft: { label: 'Draft', color: 'bg-gray-500', icon: '📝' },
        pending_approval: { label: 'Pending Approval', color: 'bg-yellow-500', icon: '⏳' },
        approved: { label: 'Approved', color: 'bg-green-500', icon: '✅' },
        rejected: { label: 'Rejected', color: 'bg-red-500', icon: '❌' },
        sent: { label: 'Sent', color: 'bg-blue-500', icon: '📤' }
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium ${config.color}`}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

/**
 * ApprovalBanner - Shows approval status and actions in quote view
 */
const ApprovalBanner = ({ quote, onSubmit, onApprove, onReject, isManager, isLoading }) => {
    const [notes, setNotes] = React.useState('');
    const [rejectReason, setRejectReason] = React.useState('');
    const [showRejectForm, setShowRejectForm] = React.useState(false);

    if (!quote) return null;

    const status = quote.status;

    // Draft - Show submit for approval button
    if (status === 'draft' && !isManager) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📝</span>
                        <div>
                            <p className="font-medium text-blue-900">Draft Quote</p>
                            <p className="text-sm text-blue-700">Submit for manager approval when ready</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onSubmit(notes)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Submit for Approval'}
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Add notes for the manager (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-3 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>
        );
    }

    // Pending Approval - Show status for submitter
    if (status === 'pending_approval' && !isManager) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">⏳</span>
                    <div>
                        <p className="font-medium text-yellow-900">Pending Approval</p>
                        <p className="text-sm text-yellow-700">
                            Submitted on {new Date(quote.submitted_for_approval_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Pending Approval - Show approve/reject for managers
    if (status === 'pending_approval' && isManager) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⏳</span>
                        <div>
                            <p className="font-medium text-yellow-900">Awaiting Your Approval</p>
                            <p className="text-sm text-yellow-700">
                                Review the quote and approve or reject
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onApprove()}
                            disabled={isLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {isLoading ? '...' : '✅ Approve'}
                        </button>
                        <button
                            onClick={() => setShowRejectForm(true)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            ❌ Reject
                        </button>
                    </div>
                </div>

                {showRejectForm && (
                    <div className="mt-3 p-3 bg-red-100 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-2">Rejection Reason (required)</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Explain why this quote is being rejected..."
                            rows={3}
                            className="w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => onReject(rejectReason)}
                                disabled={isLoading || !rejectReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                Confirm Rejection
                            </button>
                            <button
                                onClick={() => { setShowRejectForm(false); setRejectReason(''); }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Approved
    if (status === 'approved') {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    <div>
                        <p className="font-medium text-green-900">Approved</p>
                        <p className="text-sm text-green-700">
                            Approved on {new Date(quote.approved_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Rejected
    if (status === 'rejected') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">❌</span>
                    <div>
                        <p className="font-medium text-red-900">Rejected</p>
                        <p className="text-sm text-red-700">
                            Reason: {quote.approval_notes || 'No reason provided'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export { ApprovalStatusBadge, ApprovalBanner };
