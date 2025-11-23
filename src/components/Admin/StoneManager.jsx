import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { adminAPI } from '../../services/api';

const StoneManager = () => {
    const { showNotification, isAdmin } = useApp();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState('Diamond');

    useEffect(() => {
        loadPrices();
    }, []);

    const loadPrices = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getStonePrices();
            setPrices(response.data.stonePrices);
        } catch (error) {
            showNotification('Failed to load stone prices', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (id, value) => {
        setPrices(prev => prev.map(p =>
            p.id === id ? { ...p, cost: parseFloat(value) || 0 } : p
        ));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            await adminAPI.updateStonePrices(prices);
            setHasChanges(false);
            showNotification('Stone prices updated successfully', 'success');
        } catch (error) {
            showNotification('Failed to update prices', 'error');
        }
    };

    if (loading) return <div className="p-6">Loading stone prices...</div>;
    if (!isAdmin) return <div className="p-6 text-red-600">Access Denied</div>;

    // Get unique stone types for tabs
    const stoneTypes = [...new Set(prices.map(p => p.stone_type))];

    // Get unique sizes and styles for the matrix
    const sizes = ['Smalls', 'Medium', 'Center']; // Enforce order
    const styles = [...new Set(prices.map(p => p.setting_style))];

    // Filter prices for active tab
    const activePrices = prices.filter(p => p.stone_type === activeTab);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Stone Setting Rates</h2>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {stoneTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type)}
                            className={`${activeTab === type
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {type}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Matrix Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">
                                Setting Style
                            </th>
                            {sizes.map(size => (
                                <th key={size} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {size}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {styles.map(style => (
                            <tr key={style}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                    {style}
                                </td>
                                {sizes.map(size => {
                                    const priceItem = activePrices.find(p => p.setting_style === style && p.size_category === size);
                                    return (
                                        <td key={`${style}-${size}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {priceItem ? (
                                                <div className="relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">R</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={priceItem.cost}
                                                        onChange={(e) => handlePriceChange(priceItem.id, e.target.value)}
                                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-sm text-gray-500">
                * Prices shown are for <strong>{activeTab}</strong> stones. Enter the setting cost (Labor + Consumables) for each style and size combination.
            </p>
        </div>
    );
};

export default StoneManager;
