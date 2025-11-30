import React from 'react';
import CollectionMode from './CollectionMode.jsx';

const MetalTab = ({ quote, onChange, metalPrices, collectionMode, setCollectionMode, variations, setVariations, showValidation }) => {
    return (
        <div className="space-y-6">
            {/* Piece Description Section */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">📋 Piece Description</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="piece_category"
                            value={quote.piece_category || ''}
                            onChange={onChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Select Category</option>
                            <option value="ring">Ring</option>
                            <option value="earrings">Earrings</option>
                            <option value="bracelet">Bracelet</option>
                            <option value="pendant">Pendant</option>
                            <option value="necklace">Necklace</option>
                            <option value="bangle">Bangle</option>
                            <option value="cufflinks">Cufflinks</option>
                            <option value="brooch">Brooch</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brief ID</label>
                        <input
                            type="text"
                            name="brief_id"
                            value={quote.brief_id || ''}
                            onChange={onChange}
                            placeholder="e.g., BRIEF-202-001"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">For future MAYX integration</p>
                    </div>
                </div>
            </div>

            {/* Collection Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">Collection Mode</h4>
                    <p className="text-xs text-gray-500">Create multiple design variations with individual costing</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={collectionMode}
                        onChange={(e) => setCollectionMode(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{collectionMode ? 'ON' : 'OFF'}</span>
                </label>
            </div>

            {/* Conditional Rendering: Collection Mode or Standard Metal Fields */}
            {collectionMode ? (
                <CollectionMode
                    quote={quote}
                    onChange={onChange}
                    metalPrices={metalPrices}
                    variations={variations}
                    setVariations={setVariations}
                />
            ) : (
                /* Existing Metal Fields */
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
                            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${showValidation && !quote.metal_type ? 'border-red-500 ring-1 ring-red-500' : ''}`}
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
                            className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${showValidation && !quote.metal_weight ? 'border-red-500 ring-1 ring-red-500' : ''}`}
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
            )}
        </div>
    );
};

export default MetalTab;
