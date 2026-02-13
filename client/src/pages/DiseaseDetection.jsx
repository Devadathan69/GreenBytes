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
            // Mock Result
            setResult({
                diseaseName: "Early Blight (Sample)",
                confidence: 88.5,
                severity: "Moderate",
                solution: "Apply copper-based fungicides. Improve air circulation."
            });
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-primary">Crop Disease Detection</h1>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col items-center justify-center space-y-4">

                    {/* Image Preview / Upload Area */}
                    <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative overflow-hidden">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <span className="text-4xl block mb-2">📷</span>
                                <p>Upload a photo of the affected crop</p>
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
                        className={`px-8 py-3 rounded-full font-bold text-white transition-all ${!selectedImage || analyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-700 shadow-lg'
                            }`}
                    >
                        {analyzing ? 'Analyzing...' : 'Analyze Crop'}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {result && (
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Diagnosis Result</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold">Detected Disease</p>
                            <p className="text-2xl text-red-600 font-bold">{result.diseaseName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold">Confidence</p>
                            <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                                </div>
                                <span className="text-sm font-bold text-gray-700">{result.confidence}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-bold">Severity</p>
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                                {result.severity}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-bold text-primary mb-2">Recommended Action</h3>
                        <p className="bg-green-50 p-4 rounded text-gray-700 border border-green-100">
                            {result.solution}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiseaseDetection;
