import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCrop } from '../context/CropContext';
import { analyzeCropDisease, askCropDoctorQuestion } from '../services/geminiService';

const CropDoctor = () => {
    const { t } = useTranslation();
    const { selectedCrop, zones } = useCrop();

    const [selectedZone, setSelectedZone] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Assistant Q&A state
    const [qaList, setQaList] = useState([]);
    const [input, setInput] = useState("");
    const [askingAI, setAskingAI] = useState(false);

    // === STEP 1: Zone Selection ===
    if (!selectedZone) {
        return (
            <div className="max-w-xl mx-auto space-y-5">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{t('crop_doctor')}</h1>
                    <p className="text-gray-400 text-sm mt-0.5">{t('scan_instruction')} • {selectedCrop?.name}</p>
                </div>

                {(!zones || zones.length === 0) ? (
                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <span className="text-3xl block mb-2">🌾</span>
                        <p className="text-gray-400 text-sm">{t('no_zones')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {zones.map(zone => (
                            <button
                                key={zone.id}
                                onClick={() => setSelectedZone(zone)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition text-left active:scale-[0.97] relative"
                            >
                                <div className={`absolute top-0 right-0 px-2 py-1 rounded-bl-xl text-[10px] font-bold ${zone.healthStatus === 'Good' ? 'bg-green-50 text-green-600' :
                                    zone.healthStatus === 'Warning' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {zone.healthStatus || 'Good'}
                                </div>
                                <span className="text-3xl block mb-2">🌾</span>
                                <h3 className="font-bold text-gray-800 text-sm">{zone.name}</h3>
                                <p className="text-[10px] text-gray-400 mt-0.5">{t('scan_now')}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Handle Image Upload
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setError(null);
            analyzeImage(file);
        }
    };

    // Real Disease Analysis via OpenRouter
    const analyzeImage = async (file) => {
        setAnalyzing(true);
        setError(null);
        try {
            const diagnosis = await analyzeCropDisease(file, selectedCrop?.name || '');
            setResult(diagnosis);

            // Initial assistant message
            if (diagnosis.diseaseName && diagnosis.diseaseName !== 'Healthy' && diagnosis.diseaseName !== 'Not a plant image') {
                setQaList([{
                    id: 1,
                    type: 'answer',
                    text: `🔬 Disease detected in ${selectedZone.name}: **${diagnosis.diseaseName}** (${diagnosis.severity} severity, ${diagnosis.confidence}% confidence). I can help you understand this disease and guide treatment. Ask me anything!`
                }]);
            } else if (diagnosis.diseaseName === 'Healthy') {
                setQaList([{
                    id: 1,
                    type: 'answer',
                    text: `✅ Great news! Your ${selectedCrop?.name || 'crop'} in ${selectedZone.name} appears healthy. No disease detected. Keep up the good farming practices!`
                }]);
            }
        } catch (err) {
            console.error('[CropDoctor] Analysis failed:', err);
            setError(err.message || 'Analysis failed. Please try again.');
        }
        setAnalyzing(false);
    };

    // Real AI Q&A via OpenRouter
    const handleAsk = async () => {
        if (!input.trim() || askingAI) return;
        const q = input.trim();
        setInput("");
        setAskingAI(true);

        setQaList(prev => [...prev, { id: Date.now(), type: 'question', text: q }]);

        try {
            const answer = await askCropDoctorQuestion(
                q,
                result,
                selectedCrop?.name || '',
                selectedZone.name
            );
            setQaList(prev => [...prev, { id: Date.now() + 1, type: 'answer', text: answer }]);
        } catch (err) {
            setQaList(prev => [...prev, {
                id: Date.now() + 1,
                type: 'answer',
                text: '⚠️ Sorry, I could not process your question right now. Please try again.'
            }]);
        }
        setAskingAI(false);
    };

    const resetFlow = () => {
        setSelectedZone(null);
        setResult(null);
        setPreview(null);
        setImage(null);
        setQaList([]);
        setError(null);
    };

    return (
        <div className="max-w-xl mx-auto pb-20 space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <button onClick={resetFlow} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 transition text-sm">
                    ←
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-800">{selectedZone.name}</h1>
                    <p className="text-[11px] text-gray-400">{selectedCrop?.name} • {t('crop_doctor')}</p>
                </div>
            </div>

            {/* === Upload Area === */}
            {!result && (
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                    {preview ? (
                        <div className="relative">
                            <img src={preview} alt="Preview" className="w-full rounded-xl mb-3 max-h-72 object-cover" />
                            {analyzing && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-xl">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-2"></div>
                                    <p className="text-white font-bold text-sm">{t('analyzing')}</p>
                                    <p className="text-white/70 text-xs mt-1">AI is analyzing your crop...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-8">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                📸
                            </div>
                            <label className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer hover:bg-green-800 transition active:scale-95 inline-block">
                                {t('take_photo')}
                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                            </label>
                            <p className="text-xs text-gray-400 mt-3">{t('scan_instruction')}</p>
                        </div>
                    )}

                    {/* Error display */}
                    {error && (
                        <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-xl text-center">
                            <p className="text-sm text-red-600 font-bold">⚠️ {error}</p>
                            <button
                                onClick={() => image && analyzeImage(image)}
                                className="mt-2 text-xs bg-red-100 text-red-700 px-4 py-1.5 rounded-full font-bold active:scale-95"
                            >
                                {t('try_again')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* === Disease Result === */}
            {result && (
                <div className="space-y-4 animate-fade-in">
                    {/* Preview thumbnail */}
                    {preview && (
                        <div className="relative">
                            <img src={preview} alt="Analyzed" className="w-full rounded-xl max-h-48 object-cover" />
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                                {result.confidence}% {t('confidence')}
                            </div>
                        </div>
                    )}

                    {/* Disease Card */}
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">{t('disease')}</p>
                                <h2 className="text-xl font-bold text-gray-800">{result.diseaseName}</h2>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${result.severity === 'High' || result.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                result.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {result.severity}
                            </span>
                        </div>

                        {/* Symptoms */}
                        <p className="text-sm text-gray-500 mb-3">{result.symptoms}</p>

                        {/* Treatment */}
                        {result.treatment && (
                            <div className="bg-green-50 p-3 rounded-xl border border-green-100 mb-2">
                                <h3 className="font-bold text-green-800 text-xs mb-1">💊 {t('recommended_action') || 'Treatment'}</h3>
                                <p className="text-sm text-green-700">{result.treatment}</p>
                            </div>
                        )}

                        {/* Organic Treatment */}
                        {result.organic && (
                            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 mb-2">
                                <h3 className="font-bold text-emerald-800 text-xs mb-1">🌿 {t('organic_treatment') || 'Organic Treatment'}</h3>
                                <p className="text-sm text-emerald-700">{result.organic}</p>
                            </div>
                        )}

                        {/* Prevention */}
                        {result.prevention && (
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-blue-800 text-xs mb-1">🛡️ {t('prevention') || 'Prevention'}</h3>
                                <p className="text-sm text-blue-700">{result.prevention}</p>
                            </div>
                        )}
                    </div>

                    {/* === Context-Aware AI Assistant === */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b border-gray-100">
                            <div className="flex items-center">
                                <span className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center mr-2 text-sm">🩺</span>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">{t('assistant') || 'AI Assistant'}</h3>
                                    <p className="text-[10px] text-gray-400">Context: {selectedCrop?.name} • {selectedZone.name} • {result.diseaseName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Q&A List */}
                        <div className="p-3 space-y-3 max-h-80 overflow-y-auto bg-gray-50/50">
                            {qaList.map(item => (
                                <div key={item.id}>
                                    {item.type === 'question' ? (
                                        <div className="flex justify-end">
                                            <div className="bg-primary text-white p-3 rounded-xl rounded-br-sm text-sm max-w-[85%]">
                                                {item.text}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex">
                                            <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-bl-sm text-sm text-gray-700 max-w-[85%] shadow-sm">
                                                {item.text}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {askingAI && (
                                <div className="flex">
                                    <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-bl-sm text-sm text-gray-400 shadow-sm flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-2.5 border-t border-gray-100 bg-white flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                                placeholder={t('ask_placeholder') || 'Ask about this disease...'}
                                className="flex-1 bg-gray-50 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:bg-white"
                                disabled={askingAI}
                            />
                            <button
                                onClick={handleAsk}
                                disabled={!input.trim() || askingAI}
                                className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-sm disabled:opacity-40 active:scale-95 transition text-sm"
                            >
                                ➤
                            </button>
                        </div>
                    </div>

                    {/* New Check Button */}
                    <button
                        onClick={resetFlow}
                        className="w-full bg-gray-50 text-gray-600 font-bold py-3 rounded-xl border border-gray-200 hover:bg-gray-100 text-sm active:scale-[0.98] transition"
                    >
                        ← {t('scan_another') || 'Scan Another'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CropDoctor;
