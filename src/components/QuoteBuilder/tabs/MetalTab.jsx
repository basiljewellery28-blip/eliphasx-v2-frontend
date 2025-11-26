import React from 'react';

const MetalTab = ({ quote, onChange, metalPrices }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Metal Type</label>
                    <select
                        name="metal_type"
                        value={quote.metal_type}
                        onChange={(e) => {
                            const metal = metalPrices.find(m => m.metal_type === e.target.value);
                            // We need to pass both the type and the price update
                            onChange({
                                target: {
                                    name: 'metal_type',
                                    value: e.target.value
                                }
                            });
                            // Also update spot price if found
                            if (metal) {
                                onChange({
                                    target: {
                                        name: 'metal_spot_price',
                                        value: metal.price
                                    }
                                });
                            }
                        }}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Select Metal</option>
                        {metalPrices.map(m => (
                            <option key={m.id} value={m.metal_type}>
                                {m.metal_type.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Weight (g)</label>
                    <input
                        type="number"
                        name="metal_weight"
                        value={quote.metal_weight}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Spot Price (R/g)</label>
                    <input
                        type="number"
                        name="metal_spot_price"
                        value={quote.metal_spot_price}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500">Auto-filled from Admin settings</p>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Wastage (%)</label>
                    <input
                        type="number"
                        name="metal_wastage"
                        value={quote.metal_wastage}
                        readOnly
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Markup (%)</label>
                    <input
                        type="number"
                        name="metal_markup"
                        value={quote.metal_markup}
                        readOnly
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>
            </div>
        </div>
    );
};

export default MetalTab;
