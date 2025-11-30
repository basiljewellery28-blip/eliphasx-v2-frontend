import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { quotesAPI } from '../../services/api';
import { useQuoteCalculations } from '../../hooks/useQuoteCalculations';

import MetalTab from './tabs/MetalTab';
import CadTab from './tabs/CadTab';
import ManufacturingTab from './tabs/ManufacturingTab';
import StoneTab from './tabs/StoneTab';
import FinishingTab from './tabs/FinishingTab';
import FindingsTab from './tabs/FindingsTab';

import { PRICING_DEFAULTS } from '../../constants/pricingDefaults';

const QuoteBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clients, metalPrices, showNotification, isAdmin } = useApp();
    const [activeTab, setActiveTab] = useState('metal');
    const [collectionMode, setCollectionMode] = useState(false);
    const [variations, setVariations] = useState([]);
    const [showValidation, setShowValidation] = useState(false);

    const [quote, setQuote] = useState({
        client_id: '',
        piece_category: '',
        brief_id: '',
        metal_type: '',
        metal_weight: 0,
        metal_spot_price: 0,
        metal_wastage: 10,
        metal_markup: 0,
        stone_markup: 0,
        findings_markup: 0,
        include_rendering_cost: false,
        include_technical_cost: false,
        include_plating_cost: false,
        cad_markup_image: '',
    });

    const { sections, totals } = useQuoteCalculations(quote, collectionMode, variations);

    useEffect(() => {
        if (id && id !== 'new') {
            loadQuote(id);
        } else {
            // Initialize new quote
            const params = new URLSearchParams(window.location.search);
            const clientIdParam = params.get('client_id');

            let initialQuote = {
                client_id: '',
                piece_category: '',
                brief_id: '',
                metal_type: '',
                metal_weight: 0,
                metal_spot_price: 0,
                metal_wastage: 10,
                metal_markup: 0,
                stone_markup: 0,
                findings_markup: 0,
                include_rendering_cost: false,
                include_technical_cost: false,
                include_plating_cost: false,
            };

            if (clientIdParam) {
                const selectedClient = clients.find(c => c.id.toString() === clientIdParam.toString());
                if (selectedClient) {
                    const clientPricing = selectedClient.pricing_template || {};
                    initialQuote = {
                        ...initialQuote,
                        client_id: clientIdParam,
                        metal_wastage: clientPricing.metal_wastage ?? PRICING_DEFAULTS.metal_wastage,
                        metal_markup: clientPricing.metal_markup ?? PRICING_DEFAULTS.metal_markup,
                        cad_base_rate: clientPricing.cad_base_rate ?? PRICING_DEFAULTS.cad_base_rate,
                        cad_rendering_cost: clientPricing.cad_rendering_cost ?? PRICING_DEFAULTS.cad_rendering_cost,
                        cad_technical_cost: clientPricing.cad_technical_cost ?? PRICING_DEFAULTS.cad_technical_cost,
                        cad_markup: clientPricing.cad_markup ?? PRICING_DEFAULTS.cad_markup,
                        manufacturing_base_rate: clientPricing.manufacturing_base_rate ?? PRICING_DEFAULTS.manufacturing_base_rate,
                        manufacturing_markup: clientPricing.manufacturing_markup ?? PRICING_DEFAULTS.manufacturing_markup,
                        stone_markup: clientPricing.stone_markup ?? PRICING_DEFAULTS.stone_markup,
                        finishing_cost: clientPricing.finishing_cost ?? PRICING_DEFAULTS.finishing_cost,
                        plating_cost: clientPricing.plating_cost ?? PRICING_DEFAULTS.plating_cost,
                        finishing_markup: clientPricing.finishing_markup ?? PRICING_DEFAULTS.finishing_markup,
                        findings_markup: clientPricing.findings_markup ?? PRICING_DEFAULTS.findings_markup,
                    };
                }
            }

            setQuote(initialQuote);
            setActiveTab('metal');
        }
    }, [id, clients]);

    const loadQuote = async (quoteId) => {
        try {
            const response = await quotesAPI.getById(quoteId);
            setQuote(response.data.quote);
        } catch (error) {
            showNotification('Failed to load quote', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'client_id') {
            const selectedClient = clients.find(c => c.id.toString() === value.toString());

            if (selectedClient) {
                const clientPricing = selectedClient.pricing_template || {};

                const newPricing = {
                    metal_wastage: clientPricing.metal_wastage ?? PRICING_DEFAULTS.metal_wastage,
                    metal_markup: clientPricing.metal_markup ?? PRICING_DEFAULTS.metal_markup,
                    cad_base_rate: clientPricing.cad_base_rate ?? PRICING_DEFAULTS.cad_base_rate,
                    cad_rendering_cost: clientPricing.cad_rendering_cost ?? PRICING_DEFAULTS.cad_rendering_cost,
                    cad_technical_cost: clientPricing.cad_technical_cost ?? PRICING_DEFAULTS.cad_technical_cost,
                    cad_markup: clientPricing.cad_markup ?? PRICING_DEFAULTS.cad_markup,
                    manufacturing_base_rate: clientPricing.manufacturing_base_rate ?? PRICING_DEFAULTS.manufacturing_base_rate,
                    manufacturing_markup: clientPricing.manufacturing_markup ?? PRICING_DEFAULTS.manufacturing_markup,
                    stone_markup: clientPricing.stone_markup ?? PRICING_DEFAULTS.stone_markup,
                    finishing_cost: clientPricing.finishing_cost ?? PRICING_DEFAULTS.finishing_cost,
                    plating_cost: clientPricing.plating_cost ?? PRICING_DEFAULTS.plating_cost,
                    finishing_markup: clientPricing.finishing_markup ?? PRICING_DEFAULTS.finishing_markup,
                    findings_markup: clientPricing.findings_markup ?? PRICING_DEFAULTS.findings_markup,
                };

                setQuote(prev => ({
                    ...prev,
                    [name]: value,
                    ...newPricing
                }));
                return;
            }
        }

        setQuote(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (status = 'draft') => {
        // Validation Check
        if (!quote.client_id || !quote.metal_type || (!quote.metal_weight && !collectionMode)) {
            setShowValidation(true);
            showNotification('Please fill in all required fields (marked in red)', 'error');
            return;
        }

        try {
            const quoteData = { ...quote, status };

            if (id && id !== 'new') {
                await quotesAPI.update(id, quoteData);
            } else {
                const response = await quotesAPI.create(quoteData);
                // If we just created a draft, go to edit mode. If completed, go to dashboard.
                if (status === 'draft') {
                    navigate(`/quote/${response.data.quote.id}`);
                }
            }

            showNotification(`Quote ${status === 'draft' ? 'saved as draft' : 'completed'} successfully`, 'success');

            if (status === 'completed') {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Save Error:', error);
            showNotification('Failed to save quote', 'error');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
    };

    const handleDownloadPDF = async (type = 'client') => {
        try {
            if (!id || id === 'new') {
                showNotification('Please save the quote first', 'warning');
                return;
            }

            const response = await quotesAPI.generatePDF(id, type);

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-${quote.quote_number || id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            showNotification('Failed to generate PDF', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-surface-alt flex flex-col">
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-display font-bold text-gray-900">
                            {id === 'new' ? 'New Quote' : `Quote #${quote.quote_number || 'DRAFT'}`}
                        </h1>
                    </div>
                    <div className="flex space-x-3">
                        {id && id !== 'new' && (
                            <>
                                <button
                                    onClick={() => handleDownloadPDF('client')}
                                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Client PDF
                                </button>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDownloadPDF('admin')}
                                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Admin PDF
                                    </button>
                                )}
                            </>
                        )}
                        <button
                            onClick={() => handleSave('draft')}
                            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={() => handleSave('completed')}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Complete Quote
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client Selection */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                            <select
                                name="client_id"
                                value={quote.client_id}
                                onChange={handleInputChange}
                                className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${showValidation && !quote.client_id ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            >
                                <option value="">Select a Client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex overflow-x-auto" aria-label="Tabs">
                                    {['metal', 'stones', 'cad', 'manufacturing', 'finishing', 'findings'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`${activeTab === tab
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize transition-colors duration-200`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6">
                                {activeTab === 'metal' && (
                                    <MetalTab
                                        quote={quote}
                                        onChange={handleInputChange}
                                        metalPrices={metalPrices}
                                        collectionMode={collectionMode}
                                        setCollectionMode={setCollectionMode}
                                        variations={variations}
                                        setVariations={setVariations}
                                        showValidation={showValidation}
                                    />
                                )}
                                {activeTab === 'stones' && <StoneTab quote={quote} onChange={handleInputChange} showValidation={showValidation} />}
                                {activeTab === 'cad' && <CadTab quote={quote} onChange={handleInputChange} showValidation={showValidation} />}
                                {activeTab === 'manufacturing' && <ManufacturingTab quote={quote} onChange={handleInputChange} showValidation={showValidation} />}
                                {activeTab === 'finishing' && <FinishingTab quote={quote} onChange={handleInputChange} showValidation={showValidation} />}
                                {activeTab === 'findings' && <FindingsTab quote={quote} onChange={handleInputChange} showValidation={showValidation} />}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24 space-y-6">
                            <h2 className="text-xl font-heading font-bold text-primary border-b border-gray-100 pb-4">Quote Summary</h2>

                            <div className="space-y-4">
                                {Object.entries(sections).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center text-sm">
                                        <span className="capitalize text-gray-600">{key}</span>
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900">{formatCurrency(value.price)}</div>
                                            <div className="text-xs text-gray-400">Cost: {formatCurrency(value.cost)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Subtotal (Cost)</span>
                                    <span>{formatCurrency(totals.subtotalCost)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span>Profit ({totals.margin.toFixed(1)}%)</span>
                                    <span>{formatCurrency(totals.profit)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold text-primary pt-2 border-t border-gray-100 mt-2">
                                    <span>Total Price</span>
                                    <span>{formatCurrency(totals.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuoteBuilder;
