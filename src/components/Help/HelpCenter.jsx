import React, { useState } from 'react';

// Import documentation content as raw text
const docs = {
    'first-quote': {
        title: '📝 Creating Your First Quote',
        description: 'Step-by-step guide to create quotes',
        category: 'Getting Started'
    },
    'team-setup': {
        title: '👥 Team Setup Guide',
        description: 'Invite members and manage roles',
        category: 'Team Management'
    },
    'billing-faq': {
        title: '💳 Billing & Plans FAQ',
        description: 'Pricing, payments, and subscriptions',
        category: 'Billing'
    }
};

const categories = [
    { id: 'all', label: '📚 All Topics' },
    { id: 'Getting Started', label: '🚀 Getting Started' },
    { id: 'Team Management', label: '👥 Team Management' },
    { id: 'Billing', label: '💳 Billing' }
];

/**
 * HelpCenter - In-app help documentation browser
 */
const HelpCenter = ({ isOpen, onClose }) => {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    if (!isOpen) return null;

    const filteredDocs = Object.entries(docs).filter(([key, doc]) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDocClick = (docKey) => {
        setSelectedDoc(docKey);
    };

    const handleBack = () => {
        setSelectedDoc(null);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {selectedDoc && (
                                <button
                                    onClick={handleBack}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    ←
                                </button>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {selectedDoc ? docs[selectedDoc].title : '📖 Help Center'}
                                </h2>
                                <p className="text-blue-100 mt-1">
                                    {selectedDoc ? docs[selectedDoc].description : 'Find answers to your questions'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    {!selectedDoc && (
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="🔍 Search help articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-blue-200 focus:bg-white/30 outline-none"
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {selectedDoc ? (
                        <DocViewer docKey={selectedDoc} />
                    ) : (
                        <div className="p-6">
                            {/* Categories */}
                            <div className="flex gap-2 mb-6 flex-wrap">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Article List */}
                            <div className="grid gap-4">
                                {filteredDocs.map(([key, doc]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleDocClick(key)}
                                        className="text-left p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all"
                                    >
                                        <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                        <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">
                                            {doc.category}
                                        </span>
                                    </button>
                                ))}

                                {filteredDocs.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <span className="text-4xl mb-4 block">🔍</span>
                                        <p>No articles found matching "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Contact Support */}
                            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                                <h4 className="font-semibold text-blue-900">💬 Need more help?</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    Contact our support team at{' '}
                                    <a href="mailto:support@basilx.co.za" className="underline">
                                        support@basilx.co.za
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * DocViewer - Renders markdown documentation
 */
const DocViewer = ({ docKey }) => {
    const [content, setContent] = useState('Loading...');

    React.useEffect(() => {
        // In a production app, you'd fetch the markdown file
        // For now, we'll show placeholder content based on the doc key
        const contentMap = {
            'first-quote': `
# Creating Your First Quote

Welcome to ELIPHASx! This guide will walk you through creating your first jewelry quote.

## Step 1: Add a Client
1. Go to **Clients** in the sidebar
2. Click **+ Add Client**
3. Fill in the required information
4. Click **Save**

## Step 2: Start a New Quote
1. Click **Create Quote** from the dashboard
2. Select the client from the dropdown
3. Choose the piece category

## Step 3: Add Metal Details
Enter weight, type, spot price, wastage, and markup.

## Step 4: Add Production Costs
Include CAD hours, stones, and labor.

## Step 5: Generate PDF
Click **Download PDF** to get client or admin versions.
            `,
            'team-setup': `
# Team Setup Guide

Learn how to invite team members and manage roles.

## User Roles
| Role | Permissions |
|------|-------------|
| Admin | Full access |
| Manager | Approve quotes |
| Sales | Create quotes |

## Inviting Members
1. Go to **Team** settings
2. Click **+ Invite Member**
3. Enter email and select role
4. Click **Send Invite**

## Plan Limits
- Trial: 1 user
- Starter: 3 users
- Professional: 10 users
- Enterprise: Unlimited
            `,
            'billing-faq': `
# Billing & Plans FAQ

## Available Plans
| Plan | Price | Quotes |
|------|-------|--------|
| Trial | Free | 5 |
| Starter | R299/mo | 50 |
| Professional | R599/mo | Unlimited |

## Payment Methods
We accept credit cards, debit cards, and bank transfers via Paystack.

## How to Upgrade
1. Go to **Billing** settings
2. Click **Upgrade Plan**
3. Select your new plan
4. Confirm payment

## Refunds
Contact support within 7 days of payment.
            `
        };

        setContent(contentMap[docKey] || 'Content not found');
    }, [docKey]);

    return (
        <div className="p-6 prose prose-blue max-w-none">
            <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
                {content}
            </div>
        </div>
    );
};

/**
 * HelpButton - Floating help button for the app header
 */
export const HelpButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Help Center"
        >
            <span className="text-lg">❓</span>
            <span className="hidden sm:inline text-sm font-medium">Help</span>
        </button>
    );
};

export default HelpCenter;
