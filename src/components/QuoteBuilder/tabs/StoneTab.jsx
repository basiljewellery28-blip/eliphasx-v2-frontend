import React, { useEffect } from 'react';
import { useApp } from '../../../contexts/AppContext';

const StoneTab = ({ quote, onChange }) => {
    const { stonePrices } = useApp();

    // Extract unique options for dropdowns
    const stoneTypes = [...new Set(stonePrices.map(p => p.stone_type))];
    const settingStyles = [...new Set(stonePrices.map(p => p.setting_style))];
    const sizeCategories = ['Smalls', 'Medium', 'Center']; // Enforce order

    // Helper to handle stone array updates
    const handleStoneChange = (index, field, value) => {
        const stones = quote.stone_categories ? [...quote.stone_categories] : [];
        if (!stones[index]) stones[index] = {};

        stones[index][field] = value;

        // Auto-calculate setting cost if Type, Style, and Size are selected
        if (['type', 'setting_style', 'size_category'].includes(field)) {
            const currentStone = stones[index];
            if (currentStone.type && currentStone.setting_style && currentStone.size_category) {
                const priceEntry = stonePrices.find(p =>
                    p.stone_type === currentStone.type &&
                    p.setting_style === currentStone.setting_style &&
                    p.size_category === currentStone.size_category
                );

                if (priceEntry) {
                    stones[index].setting_cost = parseFloat(priceEntry.cost);
                }
            }
        }

        // Trigger update with new array
        onChange({
            target: {
                name: 'stone_categories',
                value: stones
            }
        });
    };

    const addStone = () => {
        const stones = quote.stone_categories ? [...quote.stone_categories] : [];
        stones.push({
            type: '',
            size_category: '',
            setting_style: '',
            count: 1,
            cost_per_stone: 0,
            setting_cost: 0
        });
        onChange({
            target: {
                name: 'stone_categories',
                value: stones
            }
        });
    };

    const removeStone = (index) => {
        const stones = quote.stone_categories ? [...quote.stone_categories] : [];
        stones.splice(index, 1);
        onChange({
            target: {
                name: 'stone_categories',
                value: stones
            }
        });
    };

    const stones = quote.stone_categories || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Setting</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Markup (%)</label>
                        <input
                            type="number"
                            name="stone_markup"
                            value={quote.stone_markup || 0}
                            readOnly
                            className="w-20 py-1 px-2 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addStone}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 text-sm"
                    >
                        + Add Stone
                    </button>
                </div>
            </div>

            {stones.map((stone, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md relative border border-gray-200">
                    <button
                        onClick={() => removeStone(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        &times;
                    </button>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 lg:grid-cols-6">
                        {/* Stone Type */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-medium text-gray-500">Stone Type</label>
                            <select
                                value={stone.type || ''}
                                onChange={(e) => handleStoneChange(index, 'type', e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            >
                                <option value="">Select Type</option>
                                {stoneTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Size Category */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-medium text-gray-500">Size</label>
                            <select
                                value={stone.size_category || ''}
                                onChange={(e) => handleStoneChange(index, 'size_category', e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            >
                                <option value="">Select Size</option>
                                {sizeCategories.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>

                        {/* Setting Style */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-medium text-gray-500">Setting Style</label>
                            <select
                                value={stone.setting_style || ''}
                                onChange={(e) => handleStoneChange(index, 'setting_style', e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            >
                                <option value="">Select Style</option>
                                {settingStyles.map(style => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>
                        </div>

                        {/* Count */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-medium text-gray-500">Count</label>
                            <input
                                type="number"
                                min="1"
                                value={stone.count || 1}
                                onChange={(e) => handleStoneChange(index, 'count', parseInt(e.target.value) || 1)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Cost Per Stone */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-medium text-gray-500">Cost/Stone (R)</label>
                            <input
                                type="number"
                                min="0"
                                value={stone.cost_per_stone || 0}
                                onChange={(e) => handleStoneChange(index, 'cost_per_stone', parseFloat(e.target.value) || 0)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Setting Cost (Auto-calculated) */}
                        <div className="sm:col-span-1">
                            <label className="block text-xs font-medium text-gray-500">Setting Cost (R)</label>
                            <input
                                type="number"
                                value={stone.setting_cost || 0}
                                readOnly
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Per stone (Auto)</p>
                        </div>
                    </div>
                </div>
            ))}

            {stones.length === 0 && (
                <p className="text-gray-500 text-sm text-center italic">No stones added.</p>
            )}
        </div>
    );
};

export default StoneTab;
