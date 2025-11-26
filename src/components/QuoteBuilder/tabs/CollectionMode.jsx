import React, { useState } from 'react';

const CollectionMode = ({ quote, onChange, metalPrices, variations, setVariations }) => {
    const addVariation = () => {
        const newVariation = {
            id: Date.now().toString(),
            name: `Design ${variations.length + 1}`,
            enabled: true,
            metal_type: '',
            metal_weight: 0,
            metal_spot_price: 0,
            metal_wastage: quote.metal_wastage || 10,
            metal_markup: quote.metal_markup || 0,
        };
        setVariations([...variations, newVariation]);
    };

    const removeVariation = (id) => {
        setVariations(variations.filter(v => v.id !== id));
    };

    const updateVariation = (id, field, value) => {
        setVariations(variations.map(v => {
            if (v.id === id) {
                const updated = { ...v, [field]: value };

                // Auto-update spot price when metal type changes
                if (field === 'metal_type') {
                    const metal = metalPrices.find(m => m.metal_type === value);
                    updated.metal_spot_price = metal ? metal.price : 0;
                }

                return updated;
            }
            return v;
        }));
    };

    const calculateVariationSubtotal = (variation) => {
        if (!variation.enabled) return 0;

        const weight = parseFloat(variation.metal_weight) || 0;
        const spotPrice = parseFloat(variation.metal_spot_price) || 0;
        const wastage = parseFloat(variation.metal_wastage) || 0;
        const markup = parseFloat(variation.metal_markup) || 0;

        const metalCost = (weight + (weight * (wastage / 100))) * spotPrice;
        const metalPrice = metalCost * (1 + (markup / 100));

        return metalPrice;
    };

    const getCollectionTotal = () => {
        return variations.reduce((total, v) => total + calculateVariationSubtotal(v), 0);
    };

    const getEnabledVariations = () => {
        return variations.filter(v => v.enabled);
    };

    return (
        <div className="space-y-6">
            {/* Collection Mode Header */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">🎨 Collection Mode</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Create multiple design variations of the same category with individual costing
                </p>
                <button
                    onClick={addVariation}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                >
                    <span>➕</span> Add Design Variation
                </button>
            </div>

            {/* Variations Container */}
            {variations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm">No design variations yet. Click "Add Design Variation" to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {variations.map((variation, index) => (
                        <div
                            key={variation.id}
                            className={`p-4 rounded-lg border-2 transition-all ${variation.enabled
                                    ? 'border-green-400 bg-white opacity-100'
                                    : 'border-gray-300 bg-gray-50 opacity-60'
                                }`}
                        >
                            {/* Variation Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Toggle Switch */}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={variation.enabled}
                                            onChange={(e) => updateVariation(variation.id, 'enabled', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>

                                    {/* Editable Name */}
                                    <input
                                        type="text"
                                        value={variation.name}
                                        onChange={(e) => updateVariation(variation.id, 'name', e.target.value)}
                                        className="font-medium text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent px-1 outline-none"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Status Badge */}
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${variation.enabled
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {variation.enabled ? '✓ Enabled' : '⚪ Disabled'}
                                    </span>

                                    {/* Subtotal Badge */}
                                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800">
                                        {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(calculateVariationSubtotal(variation))}
                                    </span>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeVariation(variation.id)}
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-md transition-colors"
                                        title="Remove variation"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {/* Metal Fields */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
                                    <select
                                        value={variation.metal_type}
                                        onChange={(e) => updateVariation(variation.id, 'metal_type', e.target.value)}
                                        disabled={!variation.enabled}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Metal</option>
                                        {metalPrices.map(m => (
                                            <option key={m.id} value={m.metal_type}>
                                                {m.metal_type.replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
                                    <input
                                        type="number"
                                        value={variation.metal_weight}
                                        onChange={(e) => updateVariation(variation.id, 'metal_weight', e.target.value)}
                                        disabled={!variation.enabled}
                                        step="0.1"
                                        min="0"
                                        max="500"
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Spot Price (R/g)</label>
                                    <input
                                        type="number"
                                        value={variation.metal_spot_price}
                                        readOnly
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Wastage (%)</label>
                                    <input
                                        type="number"
                                        value={variation.metal_wastage}
                                        readOnly
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Markup (%)</label>
                                    <input
                                        type="number"
                                        value={variation.metal_markup}
                                        readOnly
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Collection Summary */}
            {variations.length > 0 && getEnabledVariations().length > 0 && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-3">💎 Collection Summary</h4>
                    <div className="space-y-2">
                        {getEnabledVariations().map((v) => (
                            <div key={v.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">{v.name}</span>
                                <span className="font-medium text-gray-900">
                                    {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(calculateVariationSubtotal(v))}
                                </span>
                            </div>
                        ))}
                        <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between items-center">
                            <span className="font-bold text-gray-900">
                                Collection Total ({getEnabledVariations().length} {getEnabledVariations().length === 1 ? 'piece' : 'pieces'})
                            </span>
                            <span className="font-bold text-lg text-blue-600">
                                {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(getCollectionTotal())}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionMode;
