import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DiseaseDetection = () => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleAnalyze = () => {
        if (!selectedImage) return;

        setAnalyzing(true);
        // Simulate AI Analysis
        setTimeout(() => {
            setAnalyzing(false);
            // Mock Result with detailed info
            setResult({
                diseaseName: "Late Blight",
                localName: "Pichhela Jhulsa (Pacheti)",
                confidence: 92,
                severity: "High",
                explanation: "Fungal infection affecting leaves and stems. Causes dark lesions.",
                organicSolution: "Spray Neem Oil (5ml/liter). Use Copper Oxychloride (3g/liter).",
                chemicalSolution: "Apply Metalaxyl or Mancozeb fungicides immediately.",
                prevention: "Ensure proper drainage. Rotate crops next season."
            });
        }, 2500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-primary">{t('disease_detection')}</h1>

            <div className="bg-surface p-6 rounded-lg shadow-card">
                <label className="block text-lg font-medium text-secondary mb-4 text-center">
                    {t('upload_image')}
                </label>

                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative overflow-hidden">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center text-gray-400 p-4">
                                <span className="text-5xl block mb-2">📸</span>
                                <p>Tap to take a photo of the affected leaf</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!selectedImage || analyzing}
                        className={`w-full py-4 rounded-lg font-bold text-white text-lg shadow-md transition-all ${!selectedImage || analyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-700'
                            }`}
                    >
                        {analyzing ? 'Checking...' : t('analyze')}
                    </button>
                </div>
            </div>

            {result && (
                <div className="bg-surface rounded-lg shadow-card overflow-hidden animate-fade-in">
                    <div className="bg-red-50 border-l-8 border-red-500 p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-red-700">{result.diseaseName}</h2>
                                <p className="text-red-600 font-medium">({result.localName})</p>
                            </div>
                            <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-bold uppercase">{result.severity} Severity</span>
                        </div>
                        <p className="mt-2 text-gray-700">{result.explanation}</p>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Solutions */}
                        <div>
                            <h3 className="text-lg font-bold text-primary flex items-center">
                                <span className="mr-2">🍃</span> Organic Solution
                            </h3>
                            <p className="text-gray-700 bg-green-50 p-3 rounded mt-1 border border-green-100">
                                {result.organicSolution}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-secondary flex items-center">
                                <span className="mr-2">🧪</span> Chemical Solution
                            </h3>
                            <p className="text-gray-700 bg-yellow-50 p-3 rounded mt-1 border border-yellow-100">
                                {result.chemicalSolution}
                            </p>
                        </div>

                        <div className="text-sm text-gray-500 pt-4 border-t">
                            <strong>Prevention:</strong> {result.prevention}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiseaseDetection;
