import React from 'react';

const StoneTab = ({ quote, onChange }) => {
    // Helper to handle stone array updates
    const handleStoneChange = (index, field, value) => {
        const stones = quote.stone_categories ? [...quote.stone_categories] : [];
        if (!stones[index]) stones[index] = {};
        stones[index][field] = value;

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
        stones.push({ type: '', count: 1, cost_per_stone: 0, setting_cost: 0 });
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
                <h3 className="text-lg font-medium text-gray-900">Stones</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Markup (%)</label>
                        <input
                            type="number"
                            name="stone_markup"
                            value={quote.stone_markup || 0}
                            onChange={onChange}
                            className="w-20 py-1 px-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Type</label>
                            <input
                                type="text"
                                value={stone.type || ''}
                                onChange={(e) => handleStoneChange(index, 'type', e.target.value)}
                                placeholder="e.g. Diamond 0.5ct"
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Count</label>
                            <input
                                type="number"
                                value={stone.count || 0}
                                onChange={(e) => handleStoneChange(index, 'count', parseInt(e.target.value))}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Cost/Stone (R)</label>
                            <input
                                type="number"
                                value={stone.cost_per_stone || 0}
                                onChange={(e) => handleStoneChange(index, 'cost_per_stone', parseFloat(e.target.value))}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Setting Cost (R)</label>
                            <input
                                type="number"
                                value={stone.setting_cost || 0}
                                onChange={(e) => handleStoneChange(index, 'setting_cost', parseFloat(e.target.value))}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
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
