import React, { useState, useEffect } from 'react';

// Documentation with rich content
const docs = {
    'first-quote': {
        title: 'Creating Your First Quote',
        description: 'Step-by-step guide to create quotes in under 5 minutes',
        category: 'Getting Started',
        icon: '📝',
        color: 'from-blue-500 to-blue-600',
        readTime: '3 min',
        content: [
            { type: 'heading', text: 'Step 1: Add a Client' },
            { type: 'text', text: 'Before creating a quote, you need a client on file.' },
            {
                type: 'steps', items: [
                    'Go to Clients in the sidebar',
                    'Click + Add Client',
                    'Fill in name, email, and phone',
                    'Click Save'
                ]
            },
            { type: 'tip', text: 'You can also add a new client directly from the quote builder!' },
            { type: 'heading', text: 'Step 2: Start a New Quote' },
            {
                type: 'steps', items: [
                    'Click Create Quote from the dashboard',
                    'Select the client from the dropdown',
                    'Choose the piece category (Ring, Necklace, etc.)'
                ]
            },
            { type: 'heading', text: 'Step 3: Enter Details' },
            { type: 'text', text: 'Fill in the metal, CAD, stones, and labor sections. The system calculates totals automatically.' },
            { type: 'heading', text: 'Step 4: Download PDF' },
            { type: 'text', text: 'Click Download PDF and choose Client (clean) or Admin (full breakdown) version.' }
        ]
    },
    'team-setup': {
        title: 'Team Setup Guide',
        description: 'Invite members and assign roles to your team',
        category: 'Team Management',
        icon: '👥',
        color: 'from-purple-500 to-purple-600',
        readTime: '4 min',
        content: [
            { type: 'heading', text: 'User Roles' },
            {
                type: 'table', headers: ['Role', 'Permissions'], rows: [
                    ['Admin', 'Full access, billing, team management'],
                    ['Manager', 'Approve quotes, view all quotes'],
                    ['Sales', 'Create quotes, manage own clients']
                ]
            },
            { type: 'heading', text: 'Inviting Team Members' },
            {
                type: 'steps', items: [
                    'Go to Profile → Team',
                    'Click + Invite Member',
                    'Enter their email and select a role',
                    'Click Send Invite'
                ]
            },
            { type: 'warning', text: 'Team size is limited by your subscription plan.' },
            { type: 'heading', text: 'Plan Limits' },
            {
                type: 'table', headers: ['Plan', 'Team Members'], rows: [
                    ['14-Day Trial', '1 user'],
                    ['Essential', '1 user'],
                    ['Professional', '5 users'],
                    ['Enterprise', 'Unlimited']
                ]
            }
        ]
    },
    'billing-faq': {
        title: 'Billing & Plans',
        description: 'Pricing, payments, and subscription management',
        category: 'Billing',
        icon: '💳',
        color: 'from-green-500 to-green-600',
        readTime: '5 min',
        content: [
            { type: 'heading', text: 'Available Plans' },
            { type: 'text', text: 'All plans include a 14-day free trial. Save 17% with annual billing.' },
            {
                type: 'table', headers: ['Plan', 'Monthly Price', 'Team Size', 'Quotes'], rows: [
                    ['Essential', 'R899/mo', '1 User', '50/month'],
                    ['Professional', 'R1,999/mo', '5 Users', 'Unlimited'],
                    ['Enterprise', 'R3,999/mo', 'Unlimited', 'Unlimited']
                ]
            },
            { type: 'heading', text: 'Payment Methods' },
            { type: 'text', text: 'We accept credit cards, debit cards, and bank transfers through Paystack.' },
            { type: 'heading', text: 'How to Upgrade' },
            {
                type: 'steps', items: [
                    'Go to Profile → Billing',
                    'Click Upgrade Plan',
                    'Select your new plan',
                    'Complete payment'
                ]
            },
            { type: 'heading', text: 'Refund Policy' },
            { type: 'text', text: 'Refunds are available within 7 days of payment. Contact support@basilx.co.za' }
        ]
    },
    'keyboard-shortcuts': {
        title: 'Keyboard Shortcuts',
        description: 'Work faster with these handy shortcuts',
        category: 'Tips & Tricks',
        icon: '⌨️',
        color: 'from-orange-500 to-orange-600',
        readTime: '1 min',
        content: [
            { type: 'heading', text: 'Navigation (Dashboard)' },
            {
                type: 'shortcuts', items: [
                    { keys: 'Ctrl + N', action: 'Create new quote' },
                    { keys: 'Ctrl + K', action: 'Focus search bar' },
                    { keys: '?', action: 'Open Help Center' },
                    { keys: 'Escape', action: 'Close modal / Help Center' }
                ]
            },
            { type: 'heading', text: 'In Quote Builder' },
            {
                type: 'shortcuts', items: [
                    { keys: 'Ctrl + S', action: 'Save as draft' },
                    { keys: 'Tab', action: 'Move to next field' },
                    { keys: 'Shift + Tab', action: 'Move to previous field' }
                ]
            }
        ]
    }
};

const categories = [
    { id: 'all', label: 'All', icon: '📚' },
    { id: 'Getting Started', label: 'Getting Started', icon: '🚀' },
    { id: 'Team Management', label: 'Team', icon: '👥' },
    { id: 'Billing', label: 'Billing', icon: '💳' },
    { id: 'Tips & Tricks', label: 'Tips', icon: '💡' }
];

/**
 * HelpCenter - Premium in-app help documentation
 */
const HelpCenter = ({ isOpen, onClose }) => {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filteredDocs = Object.entries(docs).filter(([key, doc]) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${selectedDoc ? docs[selectedDoc].color : 'from-blue-600 to-purple-600'} text-white p-6`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {selectedDoc && (
                                <button
                                    onClick={() => setSelectedDoc(null)}
                                    className="p-2 hover:bg-white/20 rounded-full transition-all"
                                    aria-label="Go back"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl">{selectedDoc ? docs[selectedDoc].icon : '📖'}</span>
                                    <h2 className="text-2xl font-bold">
                                        {selectedDoc ? docs[selectedDoc].title : 'Help Center'}
                                    </h2>
                                </div>
                                <p className="text-white/80 mt-1 text-sm">
                                    {selectedDoc ? docs[selectedDoc].description : 'Find answers to your questions'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-all"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {!selectedDoc && (
                        <div className="mt-4 relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search help articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {selectedDoc ? (
                        <DocViewer doc={docs[selectedDoc]} />
                    ) : (
                        <div className="p-6">
                            {/* Category Pills */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                            ? 'bg-blue-600 text-white shadow-md scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                                            }`}
                                    >
                                        <span>{cat.icon}</span>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Article Cards */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {filteredDocs.map(([key, doc]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedDoc(key)}
                                        className="text-left bg-white rounded-xl p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] border border-gray-100 transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doc.color} flex items-center justify-center text-2xl text-white shadow-md`}>
                                                {doc.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {doc.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                                        {doc.category}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        ⏱️ {doc.readTime} read
                                                    </span>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {filteredDocs.length === 0 && (
                                <div className="text-center py-12">
                                    <span className="text-5xl mb-4 block">🔍</span>
                                    <p className="text-gray-500">No articles found for "{searchQuery}"</p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-4 text-blue-600 hover:underline"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            )}

                            {/* Support Card */}
                            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                                        💬
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">Still need help?</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Our support team is ready to assist you
                                        </p>
                                    </div>
                                    <a
                                        href="mailto:support@basilx.co.za"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between text-sm text-gray-500">
                    <span>Press <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">Esc</kbd> to close</span>
                    <span>❓ Help Center v1.0</span>
                </div>
            </div>
        </div>
    );
};

/**
 * DocViewer - Renders documentation with rich formatting
 */
const DocViewer = ({ doc }) => {
    const renderContent = (item, index) => {
        switch (item.type) {
            case 'heading':
                return (
                    <h3 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                        {item.text}
                    </h3>
                );
            case 'text':
                return <p key={index} className="text-gray-600 leading-relaxed mb-4">{item.text}</p>;
            case 'steps':
                return (
                    <ol key={index} className="space-y-2 mb-4">
                        {item.items.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                    {i + 1}
                                </span>
                                <span className="text-gray-700">{step}</span>
                            </li>
                        ))}
                    </ol>
                );
            case 'tip':
                return (
                    <div key={index} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
                        <p className="text-green-800 text-sm">
                            <span className="font-bold">💡 Tip:</span> {item.text}
                        </p>
                    </div>
                );
            case 'warning':
                return (
                    <div key={index} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
                        <p className="text-yellow-800 text-sm">
                            <span className="font-bold">⚠️ Note:</span> {item.text}
                        </p>
                    </div>
                );
            case 'table':
                return (
                    <div key={index} className="overflow-x-auto mb-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    {item.headers.map((h, i) => (
                                        <th key={i} className="px-4 py-2 text-left font-semibold text-gray-700">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {item.rows.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        {row.map((cell, j) => (
                                            <td key={j} className="px-4 py-2 text-gray-600">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'shortcuts':
                return (
                    <div key={index} className="space-y-2 mb-4">
                        {item.items.map((shortcut, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <span className="text-gray-600">{shortcut.action}</span>
                                <kbd className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-mono text-gray-700 shadow-sm">
                                    {shortcut.keys}
                                </kbd>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-white">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span>{doc.icon}</span>
                    <span>{doc.category}</span>
                    <span>•</span>
                    <span>⏱️ {doc.readTime} read</span>
                </div>
                {doc.content.map((item, index) => renderContent(item, index))}
            </div>
        </div>
    );
};

export default HelpCenter;
