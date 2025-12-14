import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const LegalPage = () => {
    const { document } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const documents = {
        'privacy-policy': {
            title: 'Privacy Policy',
            file: '/legal/privacy-policy.md'
        },
        'terms-of-service': {
            title: 'Terms of Service',
            file: '/legal/terms-of-service.md'
        },
        'cookie-policy': {
            title: 'Cookie Policy',
            file: '/legal/cookie-policy.md'
        }
    };

    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true);
                const doc = documents[document];
                if (!doc) {
                    setError('Document not found');
                    return;
                }

                const response = await fetch(doc.file);
                if (!response.ok) throw new Error('Failed to load document');

                const text = await response.text();
                setContent(text);
            } catch (err) {
                setError('Failed to load document. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDocument();
    }, [document]);

    const docInfo = documents[document];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to="/" className="text-primary hover:underline">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/login" className="text-primary hover:underline text-sm">
                        ← Back to ELIPHASx
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
                    {Object.entries(documents).map(([key, doc]) => (
                        <Link
                            key={key}
                            to={`/legal/${key}`}
                            className={`text-sm font-medium transition-colors ${document === key
                                ? 'text-primary border-b-2 border-primary pb-2'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {doc.title}
                        </Link>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <article className="prose prose-lg max-w-none prose-headings:text-primary-dark prose-a:text-secondary">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </article>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Basil & Co (Pty) Ltd. All rights reserved.</p>
                    <p className="mt-2">
                        Questions? Contact us at{' '}
                        <a href="mailto:eliphasxlegal@basilx.co.za" className="text-primary hover:underline">
                            eliphasxlegal@basilx.co.za
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
