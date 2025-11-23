import React from 'react';

const FindingsTab = ({ quote, onChange }) => {
    const handleFindingChange = (index, field, value) => {
        const findings = quote.findings ? [...quote.findings] : [];
        if (!findings[index]) findings[index] = {};
        findings[index][field] = value;

        onChange({
            target: {
                name: 'findings',
                value: findings
            }
        });
    };

    const addFinding = () => {
        const findings = quote.findings ? [...quote.findings] : [];
        findings.push({ type: '', count: 1, cost: 0 });
        onChange({
            target: {
                name: 'findings',
                value: findings
            }
        });
    };

    const removeFinding = (index) => {
        const findings = quote.findings ? [...quote.findings] : [];
        findings.splice(index, 1);
        onChange({
            target: {
                name: 'findings',
                value: findings
            }
        });
    };

    const findings = quote.findings || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Findings & Extras</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Markup (%)</label>
                        <input
                            type="number"
                            name="findings_markup"
                            value={quote.findings_markup || 0}
                            onChange={onChange}
                            className="w-20 py-1 px-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addFinding}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 text-sm"
                    >
                        + Add Finding
                    </button>
                </div>
            </div>

            {findings.map((finding, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md relative border border-gray-200">
                    <button
                        onClick={() => removeFinding(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                        &times;
                    </button>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Type</label>
                            <input
                                type="text"
                                value={finding.type || ''}
                                onChange={(e) => handleFindingChange(index, 'type', e.target.value)}
                                placeholder="e.g. Chain, Clasp, Box"
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Count</label>
                            <input
                                type="number"
                                value={finding.count || 0}
                                onChange={(e) => handleFindingChange(index, 'count', parseInt(e.target.value))}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Cost (R)</label>
                            <input
                                type="number"
                                value={finding.cost || 0}
                                onChange={(e) => handleFindingChange(index, 'cost', parseFloat(e.target.value))}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {findings.length === 0 && (
                <p className="text-gray-500 text-sm text-center italic">No findings added.</p>
            )}
        </div>
    );
};

export default FindingsTab;
