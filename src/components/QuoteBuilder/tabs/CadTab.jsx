import React from 'react';
import MarkupCanvas from './MarkupCanvas.jsx';

const CadTab = ({ quote, onChange, showValidation }) => {
    const handleMarkupChange = (markupData) => {
        onChange({ target: { name: 'cad_markup_image', value: markupData } });
    };

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
                        value={quote.cad_base_rate}
                        readOnly
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
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
                        value={quote.cad_markup}
                        readOnly
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="sm:col-span-3">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Rendering Cost</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="include_rendering_cost"
                                checked={quote.include_rendering_cost !== false}
                                onChange={(e) => onChange({ target: { name: 'include_rendering_cost', value: e.target.checked } })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-xs text-gray-500">Include</span>
                        </div>
                    </div>
                    <input
                        type="number"
                        name="cad_rendering_cost"
                        value={quote.cad_rendering_cost}
                        readOnly
                        className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${quote.include_rendering_cost !== false ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-300'} cursor-not-allowed`}
                    />
                </div>

                <div className="sm:col-span-3">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Technical Cost</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="include_technical_cost"
                                checked={quote.include_technical_cost !== false}
                                onChange={(e) => onChange({ target: { name: 'include_technical_cost', value: e.target.checked } })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-xs text-gray-500">Include</span>
                        </div>
                    </div>
                    <input
                        type="number"
                        name="cad_technical_cost"
                        value={quote.cad_technical_cost}
                        readOnly
                        className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${quote.include_technical_cost !== false ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-300'} cursor-not-allowed`}
                    />
                </div>
            </div>

            {/* CAD Markup Canvas */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🎨 Design Markup Canvas</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Upload reference images and annotate them with design specifications, revisions, and notes.
                </p>
                <MarkupCanvas
                    value={quote.cad_markup_image}
                    onChange={handleMarkupChange}
                />
            </div>
        </div>
    );
};

export default CadTab;
