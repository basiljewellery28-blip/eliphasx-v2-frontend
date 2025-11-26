import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { clientAPI } from '../../services/api';

const ClientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clients, quotes, user } = useApp();
    const [client, setClient] = useState(null);
    const [stats, setStats] = useState({
        completed: 0,
        draft: 0,
        pending_approval: 0,
        approved: 0
    });
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const hasChangesRef = React.useRef(false);

    const isPricingEditable = user?.role === 'admin';

    // Update ref when state changes
    useEffect(() => {
        hasChangesRef.current = hasChanges;
    }, [hasChanges]);

    useEffect(() => {
        const loadClientData = async () => {
            try {
                // Find client from context
                const foundClient = clients.find(c => c.id.toString() === id);
                if (foundClient) {
                    setClient(foundClient);
                    // Initialize form data if not already edited
                    if (!hasChangesRef.current) {
                        let template = foundClient.pricing_template || {};
                        if (typeof template === 'string') {
                            try {
                                template = JSON.parse(template);
                            } catch (e) {
                                template = {};
                            }
                        }

                        setFormData({
                            name: foundClient.name,
                            company: foundClient.company,
                            email: foundClient.email || '',
                            phone: foundClient.phone || '',
                            pricing_template: {
                                metal_markup: template.metal_markup ?? 50,
                                metal_wastage: template.metal_wastage ?? 10,
                                cad_base_rate: template.cad_base_rate ?? 850,
                                cad_markup: template.cad_markup ?? 100,
                                manufacturing_base_rate: template.manufacturing_base_rate ?? 650,
                                manufacturing_markup: template.manufacturing_markup ?? 100,
                                stone_markup: template.stone_markup ?? 50,
                                finishing_cost: template.finishing_cost ?? 350,
                                finishing_markup: template.finishing_markup ?? 100,
                                findings_markup: template.findings_markup ?? 50
                            }
                        });
                    }
                }

                // Fetch Stats
                const statsResponse = await clientAPI.getStats(id);
                setStats(statsResponse.data.stats);
            } catch (error) {
                console.error('Failed to load client profile', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadClientData();
            const interval = setInterval(loadClientData, 30000);
            return () => clearInterval(interval);
        }
    }, [id, clients]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Prevent non-admins from editing pricing
        if (name.startsWith('pricing_') && !isPricingEditable) {
            return;
        }

        setHasChanges(true);

        if (name.startsWith('pricing_')) {
            const field = name.replace('pricing_', '');
            setFormData(prev => ({
                ...prev,
                pricing_template: {
                    ...prev.pricing_template,
                    [field]: value // Store as string to allow decimals/typing
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCancel = () => {
        setHasChanges(false);
        // Reset form data to current client data
        if (client) {
            let template = client.pricing_template || {};
            if (typeof template === 'string') {
                try {
                    template = JSON.parse(template);
                } catch (e) {
                    template = {};
                }
            }

            setFormData({
                name: client.name,
                company: client.company,
                email: client.email || '',
                phone: client.phone || '',
                pricing_template: {
                    metal_markup: template.metal_markup ?? 50,
                    metal_wastage: template.metal_wastage ?? 10,
                    cad_base_rate: template.cad_base_rate ?? 850,
                    cad_markup: template.cad_markup ?? 100,
                    manufacturing_base_rate: template.manufacturing_base_rate ?? 650,
                    manufacturing_markup: template.manufacturing_markup ?? 100,
                    stone_markup: template.stone_markup ?? 50,
                    finishing_cost: template.finishing_cost ?? 350,
                    finishing_markup: template.finishing_markup ?? 100,
                    findings_markup: template.findings_markup ?? 50
                }
            });
        }
    };

    const handleSave = async () => {
        try {
            console.log('=== SAVE ATTEMPT ===');
            console.log('Client ID:', client?.id);
            console.log('User Role:', user?.role);
            console.log('isPricingEditable:', isPricingEditable);

            // Parse numbers before sending
            const dataToSend = {
                ...formData,
                pricing_template: Object.entries(formData.pricing_template).reduce((acc, [key, val]) => ({
                    ...acc,
                    [key]: parseFloat(val) || 0
                }), {})
            };

            console.log('Data being sent:', JSON.stringify(dataToSend, null, 2));

            const response = await clientAPI.update(client.id, dataToSend);
            console.log('Success response:', response);

            setHasChanges(false);
            window.location.reload();
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response?.data);

            const errorMsg = error.response?.data?.details || error.response?.data?.error || error.message;
            alert(`Failed to update client: ${errorMsg}`);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;
    if (!client || !formData) return <div className="p-8 text-center">Client not found</div>;

    return (
        <div className="min-h-screen bg-surface-alt">
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-primary">{formData.name}</h1>
                            <p className="text-sm text-gray-500">{formData.company} | {client.profile_number}</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        {hasChanges && (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
                                >
                                    Save Changes
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => navigate(`/quote/new?client_id=${client.id}`)}
                            className="btn-primary"
                        >
                            Start New Quote
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="card border-l-4 border-green-500 p-5">
                        <dt className="text-sm font-medium text-gray-500 truncate">Completed Quotes</dt>
                        <dd className="mt-1 text-3xl font-heading font-semibold text-primary">{stats.completed}</dd>
                    </div>
                    <div className="card border-l-4 border-yellow-500 p-5">
                        <dt className="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                        <dd className="mt-1 text-3xl font-heading font-semibold text-primary">{stats.draft}</dd>
                    </div>
                    <div className="card border-l-4 border-blue-500 p-5">
                        <dt className="text-sm font-medium text-gray-500 truncate">Waiting Approval</dt>
                        <dd className="mt-1 text-3xl font-heading font-semibold text-primary">{stats.pending_approval}</dd>
                    </div>
                    <div className="card border-l-4 border-purple-500 p-5">
                        <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                        <dd className="mt-1 text-3xl font-heading font-semibold text-primary">{stats.approved}</dd>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="card p-6 lg:col-span-1 h-fit">
                        <h3 className="text-lg font-heading font-bold text-primary mb-4 border-b pb-2">Contact Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company</label>
                                <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="input-field mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field mt-1" />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Configuration */}
                    <div className="card p-6 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-lg font-heading font-bold text-primary">Pricing Configuration</h3>
                            {!isPricingEditable && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Admin Only</span>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Metal */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Metal</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Markup (%)</label>
                                    <input type="number" name="pricing_metal_markup" value={formData.pricing_template.metal_markup} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Wastage (%)</label>
                                    <input type="number" name="pricing_metal_wastage" value={formData.pricing_template.metal_wastage} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                            </div>

                            {/* CAD */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">CAD</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base Rate (R)</label>
                                    <input type="number" name="pricing_cad_base_rate" value={formData.pricing_template.cad_base_rate} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Markup (%)</label>
                                    <input type="number" name="pricing_cad_markup" value={formData.pricing_template.cad_markup} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                            </div>

                            {/* Manufacturing */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Manufacturing</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base Rate (R)</label>
                                    <input type="number" name="pricing_manufacturing_base_rate" value={formData.pricing_template.manufacturing_base_rate} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Markup (%)</label>
                                    <input type="number" name="pricing_manufacturing_markup" value={formData.pricing_template.manufacturing_markup} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                            </div>

                            {/* Finishing & Others */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Finishing & Others</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Finishing Cost (R)</label>
                                    <input type="number" name="pricing_finishing_cost" value={formData.pricing_template.finishing_cost} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Finish %</label>
                                    <input type="number" name="pricing_finishing_markup" value={formData.pricing_template.finishing_markup} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Stone %</label>
                                    <input type="number" name="pricing_stone_markup" value={formData.pricing_template.stone_markup} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Find %</label>
                                    <input type="number" name="pricing_findings_markup" value={formData.pricing_template.findings_markup} onChange={handleInputChange} disabled={!isPricingEditable} className={`input-field mt-1 ${!isPricingEditable ? 'bg-gray-100' : ''}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientProfile;
