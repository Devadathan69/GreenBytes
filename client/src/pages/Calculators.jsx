import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Calculators = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('fertilizer');

    // Fertilizer State
    const [landArea, setLandArea] = useState('');
    const [crop, setCrop] = useState('Wheat');
    const [fertilizerResult, setFertilizerResult] = useState(null);

    // Pesticide State
    const [pestArea, setPestArea] = useState('');
    const [disease, setDisease] = useState('Rust');
    const [pesticideResult, setPesticideResult] = useState(null);

    const calculateFertilizer = (e) => {
        e.preventDefault();
        // Mock Calculation Logic (Standard NPK for Wheat per acre: 100-50-40 kg approx)
        // Urea (46% N), DAP (18% N, 46% P), MOP (60% K)
        const area = parseFloat(landArea) || 0;
        if (area > 0) {
            setFertilizerResult({
                urea: (50 * area).toFixed(1) + ' kg',
                dap: (25 * area).toFixed(1) + ' kg',
                mop: (15 * area).toFixed(1) + ' kg'
            });
        }
    };

    const calculatePesticide = (e) => {
        e.preventDefault();
        const area = parseFloat(pestArea) || 0;
        if (area > 0) {
            setPesticideResult({
                name: "Propiconazole 25% EC",
                dosage: (200 * area).toFixed(0) + " ml mixed in " + (200 * area) + " Liters of water."
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-primary">{t('calculators')}</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`flex-1 py-3 font-bold text-center ${activeTab === 'fertilizer' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('fertilizer')}
                >
                    Fertilizer
                </button>
                <button
                    className={`flex-1 py-3 font-bold text-center ${activeTab === 'pesticide' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('pesticide')}
                >
                    Pesticide
                </button>
            </div>

            {/* Fertilizer View */}
            {activeTab === 'fertilizer' && (
                <div className="bg-surface p-6 rounded-lg shadow-card animate-fade-in">
                    <h2 className="text-lg font-bold text-secondary mb-4">Fertilizer Dosing</h2>
                    <form onSubmit={calculateFertilizer} className="space-y-4">
                        <div>
                            <label className="block text-text font-medium mb-1">Select Crop</label>
                            <select value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full p-3 border rounded bg-white">
                                <option value="Wheat">Wheat</option>
                                <option value="Rice">Rice</option>
                                <option value="Cotton">Cotton</option>
                                <option value="Maize">Maize</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-text font-medium mb-1">Land Area (Acres)</label>
                            <input
                                type="number"
                                value={landArea}
                                onChange={(e) => setLandArea(e.target.value)}
                                className="w-full p-3 border rounded"
                                placeholder="e.g. 1.5"
                                step="0.1"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-700">
                            Calculate
                        </button>
                    </form>

                    {fertilizerResult && (
                        <div className="mt-6 bg-green-50 p-4 rounded border border-green-100">
                            <h3 className="font-bold text-green-800 mb-2">Recommended Application:</h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between"><span>Urea:</span> <span className="font-bold">{fertilizerResult.urea}</span></li>
                                <li className="flex justify-between"><span>DAP:</span> <span className="font-bold">{fertilizerResult.dap}</span></li>
                                <li className="flex justify-between"><span>MOP:</span> <span className="font-bold">{fertilizerResult.mop}</span></li>
                            </ul>
                            <p className="text-xs text-green-700 mt-2">*Values are approximate baselines.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pesticide View */}
            {activeTab === 'pesticide' && (
                <div className="bg-surface p-6 rounded-lg shadow-card animate-fade-in">
                    <h2 className="text-lg font-bold text-secondary mb-4">Pesticide Dosing</h2>
                    <form onSubmit={calculatePesticide} className="space-y-4">
                        <div>
                            <label className="block text-text font-medium mb-1">Select Disease / Pest</label>
                            <select value={disease} onChange={(e) => setDisease(e.target.value)} className="w-full p-3 border rounded bg-white">
                                <option value="Rust">Rust (Wheat)</option>
                                <option value="Blight">Leaf Blight</option>
                                <option value="Aphids">Aphids (Sucking pest)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-text font-medium mb-1">Land Area (Acres)</label>
                            <input
                                type="number"
                                value={pestArea}
                                onChange={(e) => setPestArea(e.target.value)}
                                className="w-full p-3 border rounded"
                                placeholder="e.g. 1.5"
                                step="0.1"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700">
                            Calculate Dosage
                        </button>
                    </form>

                    {pesticideResult && (
                        <div className="mt-6 bg-red-50 p-4 rounded border border-red-100">
                            <h3 className="font-bold text-red-800 mb-2">Recommendation:</h3>
                            <p className="font-bold text-lg text-red-900">{pesticideResult.name}</p>
                            <p className="mt-1 font-medium">Dosage: {pesticideResult.dosage}</p>
                            <div className="mt-3 text-sm bg-white p-2 rounded border border-red-200 text-red-700">
                                <strong>⚠️ Safety:</strong> Wear gloves and mask while spraying. Keep away from children.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Calculators;
