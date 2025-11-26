import React from 'react';

const ManufacturingTab = ({ quote, onChange }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Technique</label>
                    <select
                        name="manufacturing_technique"
                        value={quote.manufacturing_technique || ''}
                        onChange={onChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Select Technique</option>
                        <option value="casting">Casting</option>
                        <option value="handmade">Handmade</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Hours</label>
                    <input
                        type="number"
                        name="manufacturing_hours"
                        value={quote.manufacturing_hours || 0}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Base Rate (R/hr)</label>
                    <input
                        type="number"
                        name="manufacturing_base_rate"
                        value={quote.manufacturing_base_rate}
                        readOnly
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Markup (%)</label>
                    <input
                        type="number"
                        name="manufacturing_markup"
                        value={quote.manufacturing_markup}
                        readOnly
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>
            </div>
        </div>
    );
};

export default ManufacturingTab;
