import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from '../../services/api';

const GlobalSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ clients: [], quotes: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                try {
                    const response = await searchAPI.search(query);
                    setResults(response.data);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Search failed', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults({ clients: [], quotes: [] });
                setIsOpen(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectClient = (clientId) => {
        navigate(`/clients/${clientId}`);
        setIsOpen(false);
        setQuery('');
    };

    const handleSelectQuote = (quoteId) => {
        navigate(`/quote/${quoteId}`);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search clients, IDs, or quotes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
                {loading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>

            {isOpen && (results.clients.length > 0 || results.quotes.length > 0) && (
                <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {results.clients.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                                Clients
                            </div>
                            {results.clients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => handleSelectClient(client.id)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">{client.name}</div>
                                        <div className="text-xs text-gray-500">{client.company}</div>
                                    </div>
                                    <div className="text-xs text-gray-400">{client.profile_number}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {results.quotes.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-t border-gray-100">
                                Quotes
                            </div>
                            {results.quotes.map((quote) => (
                                <button
                                    key={quote.id}
                                    onClick={() => handleSelectQuote(quote.id)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">{quote.quote_number}</div>
                                        <div className="text-xs text-gray-500">{quote.client_name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-medium text-gray-900">
                                            {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(quote.total || 0)}
                                        </div>
                                        <div className={`text-xs ${quote.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {quote.status}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isOpen && query.length >= 2 && results.clients.length === 0 && results.quotes.length === 0 && !loading && (
                <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-4 text-center text-sm text-gray-500 ring-1 ring-black ring-opacity-5">
                    No results found.
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
