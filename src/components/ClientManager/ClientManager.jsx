import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { clientsAPI } from '../../services/api';

const ClientManager = () => {
    const { clients, dispatch, showNotification } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        pricing_template: {
            metal_markup: 50,
            metal_wastage: 10,
            cad_base_rate: 850,
            cad_markup: 100,
            manufacturing_base_rate: 650,
            manufacturing_markup: 100,
            stone_markup: 50,
            finishing_cost: 350,
            finishing_markup: 100,
            findings_markup: 50
        }
    });

    const handleOpenModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                company: client.company,
                email: client.email || '',
                phone: client.phone || '',
                pricing_template: {
                    metal_markup: client.pricing_template?.metal_markup ?? 50,
                    metal_wastage: client.pricing_template?.metal_wastage ?? 10,
                    cad_base_rate: client.pricing_template?.cad_base_rate ?? 850,
                    cad_markup: client.pricing_template?.cad_markup ?? 100,
                    manufacturing_base_rate: client.pricing_template?.manufacturing_base_rate ?? 650,
                    manufacturing_markup: client.pricing_template?.manufacturing_markup ?? 100,
                    stone_markup: client.pricing_template?.stone_markup ?? 50,
                    finishing_cost: client.pricing_template?.finishing_cost ?? 350,
                    finishing_markup: client.pricing_template?.finishing_markup ?? 100,
                    findings_markup: client.pricing_template?.findings_markup ?? 50
                }
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '', company: '', email: '', phone: '',
                pricing_template: {
                    metal_markup: 50, metal_wastage: 10,
                    cad_base_rate: 850, cad_markup: 100,
                    manufacturing_base_rate: 650, manufacturing_markup: 100,
                    stone_markup: 50,
                    finishing_cost: 350, finishing_markup: 100,
                    findings_markup: 50
                }
            });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('pricing_')) {
            const field = name.replace('pricing_', '');
            setFormData(prev => ({
                ...prev,
                pricing_template: {
                    ...prev.pricing_template,
                    [field]: parseFloat(value) || 0
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingClient) {
                response = await clientsAPI.update(editingClient.id, formData);
                const updatedClient = response.data.client;
                dispatch({
                    type: 'SET_CLIENTS',
                    payload: clients.map(c => c.id === updatedClient.id ? updatedClient : c)
                });
                showNotification('Client updated successfully', 'success');
            } else {
                response = await clientsAPI.create(formData);
                const createdClient = response.data.client;
                dispatch({
                    type: 'SET_CLIENTS',
                    payload: [...clients, createdClient]
                });
                showNotification('Client created successfully', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            showNotification(`Failed to ${editingClient ? 'update' : 'create'} client`, 'error');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    + Add Client
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {clients.map((client) => (
                        <li key={client.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 truncate">{client.name}</p>
                                    <p className="text-sm text-gray-500">{client.company}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right mr-4">
                                        <p className="text-sm text-gray-900">{client.profile_number}</p>
                                        <p className="text-sm text-gray-500">Markup: {client.pricing_template?.metal_markup || 50}%</p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenModal(client)}
                                        className="text-secondary hover:text-secondary-dark font-medium text-sm"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full my-8">
                        <h3 className="text-lg font-medium mb-4">{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <h4 className="text-sm font-medium text-gray-900 border-b pb-2 mb-4">Contact Details</h4>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field mt-1" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company</label>
                                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="input-field mt-1" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field mt-1" />
                                </div>

                                <div className="sm:col-span-2 mt-4">
                                    <h4 className="text-sm font-medium text-gray-900 border-b pb-2 mb-4">Pricing Configuration</h4>
                                </div>
                                {/* Metal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Metal Markup (%)</label>
                                    <input type="number" name="pricing_metal_markup" value={formData.pricing_template.metal_markup} onChange={handleInputChange} className="input-field mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Metal Wastage (%)</label>
                                    <input type="number" name="pricing_metal_wastage" value={formData.pricing_template.metal_wastage} onChange={handleInputChange} className="input-field mt-1" />
                                </div>

                                {/* CAD */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CAD Base Rate (R)</label>
                                    <input type="number" name="pricing_cad_base_rate" value={formData.pricing_template.cad_base_rate} onChange={handleInputChange} className="input-field mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CAD Markup (%)</label>
                                    <input type="number" name="pricing_cad_markup" value={formData.pricing_template.cad_markup} onChange={handleInputChange} className="input-field mt-1" />
                                </div>

                                {/* Manufacturing */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mfg Base Rate (R)</label>
                                    <input type="number" name="pricing_manufacturing_base_rate" value={formData.pricing_template.manufacturing_base_rate} onChange={handleInputChange} className="input-field mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mfg Markup (%)</label>
                                    <input type="number" name="pricing_manufacturing_markup" value={formData.pricing_template.manufacturing_markup} onChange={handleInputChange} className="input-field mt-1" />
                                </div>

                                {/* Stone & Findings */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stone Markup (%)</label>
                                    <input type="number" name="pricing_stone_markup" value={formData.pricing_template.stone_markup} onChange={handleInputChange} className="input-field mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Findings Markup (%)</label>
                                    <input type="number" name="pricing_findings_markup" value={formData.pricing_template.findings_markup} onChange={handleInputChange} className="input-field mt-1" />
                                </div>

                                {/* Finishing */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Finishing Cost (R)</label>
                                    <input type="number" name="pricing_finishing_cost" value={formData.pricing_template.finishing_cost} onChange={handleInputChange} className="input-field mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Finishing Markup (%)</label>
                                    <input type="number" name="pricing_finishing_markup" value={formData.pricing_template.finishing_markup} onChange={handleInputChange} className="input-field mt-1" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    {editingClient ? 'Update Client' : 'Save Client'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManager;
