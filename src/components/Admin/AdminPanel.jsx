import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { adminAPI } from '../../services/api';

const AdminPanel = () => {
    const { metalPrices, dispatch, showNotification, isAdmin } = useApp();
    const [prices, setPrices] = useState(metalPrices);
    const [hasChanges, setHasChanges] = useState(false);

    if (!isAdmin) {
        return <div className="p-6 text-red-600">Access Denied</div>;
    }

    const handlePriceChange = (index, value) => {
        const newPrices = [...prices];
        newPrices[index] = { ...newPrices[index], price: parseFloat(value) };
        setPrices(newPrices);
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            await adminAPI.updateMetalPrices(prices);
            dispatch({ type: 'SET_METAL_PRICES', payload: prices });
            setHasChanges(false);
            showNotification('Metal prices updated successfully', 'success');
        } catch (error) {
            showNotification('Failed to update prices', 'error');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Admin Panel - Metal Pricing</h2>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                )}
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Metal Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Price (R/g)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Alloy Composition
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {prices.map((metal, index) => (
                            <tr key={metal.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                    {metal.metal_type.replace(/_/g, ' ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <input
                                        type="number"
                                        value={metal.price}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-1 border w-32"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {metal.alloy_composition}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
