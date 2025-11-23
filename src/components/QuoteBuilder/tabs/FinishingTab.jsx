import React from 'react';

const FinishingTab = ({ quote, onChange }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Finish Type</label>
                    <select
                        name="finish_type"
                        value={quote.finish_type || ''}
                        onChange={onChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Select Finish</option>
                        <option value="polished">High Polish</option>
                        <option value="matte">Matte / Satin</option>
                        <option value="brushed">Brushed</option>
                        <option value="hammered">Hammered</option>
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Finishing Cost</label>
                    <input
                        type="number"
                        name="finishing_cost"
                        value={quote.finishing_cost || 350}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Plating</label>
                    <select
                        name="plating_type"
                        value={quote.plating_type || ''}
                        onChange={onChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">None</option>
                        <option value="rhodium">Rhodium</option>
                        <option value="gold">Gold Plating</option>
                        <option value="rose_gold">Rose Gold Plating</option>
                        <option value="black_rhodium">Black Rhodium</option>
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Plating Cost</label>
                    <input
                        type="number"
                        name="plating_cost"
                        value={quote.plating_cost || 0}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Markup (%)</label>
                    <input
                        type="number"
                        name="finishing_markup"
                        value={quote.finishing_markup || 0}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default FinishingTab;
