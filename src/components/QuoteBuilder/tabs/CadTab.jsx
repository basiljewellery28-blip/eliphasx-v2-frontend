import React from 'react';

const CadTab = ({ quote, onChange }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">CAD Hours</label>
                    <input
                        type="number"
                        name="cad_hours"
                        value={quote.cad_hours || 0}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Base Rate (R/hr)</label>
                    <input
                        type="number"
                        name="cad_base_rate"
                        value={quote.cad_base_rate || 850}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Revisions</label>
                    <input
                        type="number"
                        name="cad_revisions"
                        value={quote.cad_revisions || 0}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Markup (%)</label>
                    <input
                        type="number"
                        name="cad_markup"
                        value={quote.cad_markup || 0}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Rendering Cost</label>
                    <input
                        type="number"
                        name="cad_rendering_cost"
                        value={quote.cad_rendering_cost || 450}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Technical Cost</label>
                    <input
                        type="number"
                        name="cad_technical_cost"
                        value={quote.cad_technical_cost || 750}
                        onChange={onChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default CadTab;
