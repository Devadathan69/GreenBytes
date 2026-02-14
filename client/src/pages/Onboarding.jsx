import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCrop } from '../context/CropContext';
import { analyzeSoilReport } from '../services/geminiService';
import { db } from '../firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const CROPS_LIST = [
    { id: 'cardamom', name: 'Cardamom', icon: '🌿' },
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'chilli', name: 'Chilli', icon: '🌶️' },
];

const TOTAL_STEPS = 4;

const Onboarding = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addNewCrop, refreshAllData, applyTheme } = useCrop();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [analyzingFile, setAnalyzingFile] = useState(false);
    const [soilAnalysis, setSoilAnalysis] = useState(null);
    const [analysisError, setAnalysisError] = useState('');

    const [formData, setFormData] = useState({
        selectedCrops: [],
        zonesConfig: {},
        hasSoilData: null,
        soilFile: null,
    });

    const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    // Generate module options
    const getModuleOptions = () => {
        let totalZones = 0;
        formData.selectedCrops.forEach(cropId => {
            const zones = formData.zonesConfig[cropId] || [{ name: 'Zone 1', moduleId: '' }];
            totalZones += zones.length;
        });
        const count = Math.max(totalZones + 2, 5);
        return Array.from({ length: count }, (_, i) => `Module ${i + 1}`);
    };

    const getAssignedModules = (excludeCropId, excludeZoneIdx) => {
        const assigned = new Set();
        formData.selectedCrops.forEach(cropId => {
            const zones = formData.zonesConfig[cropId] || [];
            zones.forEach((z, idx) => {
                if (cropId === excludeCropId && idx === excludeZoneIdx) return;
                if (z.moduleId) assigned.add(z.moduleId);
            });
        });
        return assigned;
    };

    // === STEP 1: Crop Selection ===
    const renderStep1 = () => (
        <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">🌾</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{t('select_crops')}</h2>
                <p className="text-gray-500 text-sm">{t('select_crops_desc') || 'Select all crops you grow'}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
                {CROPS_LIST.map(crop => {
                    const isSelected = formData.selectedCrops.includes(crop.id);
                    return (
                        <button
                            key={crop.id}
                            onClick={() => {
                                const newSelection = isSelected
                                    ? formData.selectedCrops.filter(id => id !== crop.id)
                                    : [...formData.selectedCrops, crop.id];
                                updateForm('selectedCrops', newSelection);
                            }}
                            className={`p-5 rounded-xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${isSelected
                                ? 'border-primary bg-primary-light shadow-sm'
                                : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                        >
                            <span className="text-4xl mb-2">{crop.icon}</span>
                            <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-gray-600'}`}>{crop.name}</span>
                            {isSelected && <span className="mt-1 text-primary text-xs">✓ {t('selected') || 'Selected'}</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    // === STEP 2: Zone + Module Configuration ===
    const renderStep2 = () => {
        const moduleOptions = getModuleOptions();

        return (
            <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{t('configure_zones')}</h2>
                    <p className="text-gray-500 text-sm">{t('configure_zones_desc') || 'Name your zones and assign IoT modules'}</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-700">
                        <span className="font-bold">📡 {t('about_modules') || 'About Modules'}:</span> {t('module_info') || 'Each zone is linked to one IoT module (ESP32 + soil sensor). Assign the module installed in that field area.'}
                    </p>
                </div>

                {formData.selectedCrops.map(cropId => {
                    const crop = CROPS_LIST.find(c => c.id === cropId);
                    const zones = formData.zonesConfig[cropId] || [{ name: 'Zone 1', moduleId: '' }];

                    return (
                        <div key={cropId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                                <h3 className="font-bold text-base flex items-center text-gray-800">
                                    <span className="mr-2 text-xl">{crop.icon}</span> {crop.name}
                                </h3>
                                <button
                                    onClick={() => {
                                        const newZones = [...zones, { name: `Zone ${zones.length + 1}`, moduleId: '' }];
                                        updateForm('zonesConfig', { ...formData.zonesConfig, [cropId]: newZones });
                                    }}
                                    className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full active:scale-95"
                                >
                                    + {t('zone') || 'Zone'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                {zones.map((zone, index) => {
                                    const assignedModules = getAssignedModules(cropId, index);
                                    return (
                                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={zone.name}
                                                    onChange={(e) => {
                                                        const newZones = [...zones];
                                                        newZones[index] = { ...newZones[index], name: e.target.value };
                                                        updateForm('zonesConfig', { ...formData.zonesConfig, [cropId]: newZones });
                                                    }}
                                                    className="flex-1 p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                                                    placeholder={`Zone ${index + 1}`}
                                                />
                                                {zones.length > 1 && (
                                                    <button
                                                        onClick={() => {
                                                            const newZones = zones.filter((_, i) => i !== index);
                                                            updateForm('zonesConfig', { ...formData.zonesConfig, [cropId]: newZones });
                                                        }}
                                                        className="text-gray-300 hover:text-red-500 p-1 text-sm"
                                                    >✕</button>
                                                )}
                                            </div>
                                            <div className="ml-8">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{t('assigned_module') || 'Assigned Module'}</label>
                                                <select
                                                    value={zone.moduleId || ''}
                                                    onChange={(e) => {
                                                        const newZones = [...zones];
                                                        newZones[index] = { ...newZones[index], moduleId: e.target.value };
                                                        updateForm('zonesConfig', { ...formData.zonesConfig, [cropId]: newZones });
                                                    }}
                                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-1 focus:ring-primary focus:border-primary"
                                                >
                                                    <option value="">— {t('select_module') || 'Select module'} —</option>
                                                    {moduleOptions.map(mod => (
                                                        <option key={mod} value={mod} disabled={assignedModules.has(mod)}>
                                                            {mod} {assignedModules.has(mod) ? `(${t('assigned') || 'assigned'})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // === STEP 3: Soil Data Upload + Gemini Analysis ===
    const handleFileUpload = async (file) => {
        updateForm('soilFile', file);
        setAnalyzingFile(true);
        setAnalysisError('');
        setSoilAnalysis(null);

        try {
            const result = await analyzeSoilReport(file);
            if (result.error) {
                setAnalysisError(result.error);
            } else {
                setSoilAnalysis(result);
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setAnalysisError(err.message || 'Failed to analyze the report');
        } finally {
            setAnalyzingFile(false);
        }
    };

    const renderStep3 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-gray-800">{t('upload_soil_data')}</h2>
                <p className="text-gray-500 text-sm">{t('soil_data_desc') || 'Help us understand your soil better'}</p>
            </div>

            {formData.hasSoilData === null && (
                <div className="space-y-3">
                    <p className="font-medium text-gray-700 text-center">{t('have_soil_report') || 'Do you have a soil test report?'}</p>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => updateForm('hasSoilData', true)}
                            className="flex-1 bg-white border-2 border-primary text-primary font-bold py-4 rounded-xl active:scale-95 transition"
                        >
                            ✅ {t('yes_have') || 'Yes, I have'}
                        </button>
                        <button
                            onClick={() => updateForm('hasSoilData', false)}
                            className="flex-1 bg-white border-2 border-gray-200 text-gray-500 font-bold py-4 rounded-xl active:scale-95 transition"
                        >
                            {t('not_yet') || 'Not yet'}
                        </button>
                    </div>
                </div>
            )}

            {formData.hasSoilData === true && !soilAnalysis && (
                <div>
                    <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-primary-light hover:border-primary/30 transition cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={analyzingFile}
                        />
                        {analyzingFile ? (
                            <>
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
                                <p className="font-bold text-primary">{t('analyzing') || 'Analyzing...'}</p>
                                <p className="text-xs text-gray-400 mt-1">{t('ai_processing') || 'AI is processing your soil report'}</p>
                            </>
                        ) : formData.soilFile && !analysisError ? (
                            <>
                                <span className="text-4xl mb-3 text-primary">📄</span>
                                <p className="font-bold text-gray-800">{formData.soilFile.name}</p>
                                <p className="text-xs text-primary mt-1">{t('tap_to_change') || 'Tap to change file'}</p>
                            </>
                        ) : (
                            <>
                                <span className="text-4xl mb-3 text-gray-400">📄</span>
                                <p className="font-bold text-gray-600">{t('upload_report') || 'Upload Soil Test Report'}</p>
                                <p className="text-xs text-gray-400 mt-1">{t('pdf_or_image') || 'PDF or Image'}</p>
                            </>
                        )}
                    </label>

                    {analysisError && (
                        <div className="bg-red-50 p-3 rounded-lg mt-3 border border-red-100">
                            <p className="text-xs text-red-600 font-medium">❌ {analysisError}</p>
                            <button
                                onClick={() => { setAnalysisError(''); updateForm('soilFile', null); }}
                                className="text-xs text-red-500 mt-2 underline"
                            >{t('try_again') || 'Try again'}</button>
                        </div>
                    )}

                    <button onClick={() => updateForm('hasSoilData', null)} className="text-sm text-gray-400 mt-3 hover:underline">
                        ← {t('go_back') || 'Go back'}
                    </button>
                </div>
            )}

            {/* Analysis Results */}
            {soilAnalysis && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-primary-light p-4 rounded-xl border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-primary text-sm">✅ {t('analysis_complete') || 'Analysis Complete'}</h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${soilAnalysis.overallStatus === 'Good' ? 'bg-green-100 text-green-700' :
                                soilAnalysis.overallStatus === 'Poor' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>{soilAnalysis.overallStatus}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{soilAnalysis.summary}</p>
                    </div>

                    {/* Nutrient Values */}
                    {soilAnalysis.values && Object.keys(soilAnalysis.values).length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">{t('nutrient_values') || 'Nutrient Values'}</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(soilAnalysis.values).map(([key, val]) => (
                                    val && val !== 'Not found' && (
                                        <div key={key} className="bg-gray-50 p-2 rounded-lg">
                                            <p className="text-[10px] text-gray-400 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            <p className="text-sm font-bold text-gray-700">{val}</p>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Deficiencies */}
                    {soilAnalysis.deficiencies?.length > 0 && (
                        <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                            <h4 className="text-xs font-bold text-red-600 mb-1">⚠️ {t('deficiencies') || 'Deficiencies Found'}</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {soilAnalysis.deficiencies.map((d, i) => (
                                    <span key={i} className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{d}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Suggestions */}
                    {soilAnalysis.suggestions?.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">💡 {t('suggestions') || 'Suggestions'}</h4>
                            <ul className="space-y-1.5">
                                {soilAnalysis.suggestions.map((s, i) => (
                                    <li key={i} className="text-xs text-gray-600 flex items-start">
                                        <span className="text-primary mr-2 mt-0.5">•</span>{s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={() => { setSoilAnalysis(null); updateForm('soilFile', null); updateForm('hasSoilData', null); }}
                        className="text-sm text-gray-400 hover:underline"
                    >← {t('redo_analysis') || 'Redo analysis'}</button>
                </div>
            )}

            {formData.hasSoilData === false && (
                <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <span className="text-4xl block mb-3">📋</span>
                    <p className="text-gray-600 font-medium">{t('no_worries') || 'No worries!'}</p>
                    <p className="text-gray-400 text-sm mt-1">{t('upload_later') || 'You can upload soil data later from the Dashboard.'}</p>
                    <button onClick={() => updateForm('hasSoilData', null)} className="text-sm text-primary font-bold mt-3 hover:underline">
                        ← {t('go_back') || 'Go back'}
                    </button>
                </div>
            )}
        </div>
    );

    // === STEP 4: Summary / Confirm ===
    const renderStep4 = () => (
        <div className="space-y-5 animate-fade-in">
            <div className="text-center mb-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">🎉</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{t('all_set') || "You're All Set!"}</h2>
                <p className="text-gray-500 text-sm">{t('review_setup') || 'Review your farm setup'}</p>
            </div>

            {formData.selectedCrops.map(cropId => {
                const crop = CROPS_LIST.find(c => c.id === cropId);
                const zones = formData.zonesConfig[cropId] || [{ name: 'Zone 1', moduleId: '' }];
                return (
                    <div key={cropId} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-base flex items-center mb-2">
                            <span className="mr-2">{crop.icon}</span> {crop.name}
                        </h3>
                        <div className="space-y-1">
                            {zones.map((z, i) => (
                                <div key={i} className="flex justify-between items-center text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <span className="text-gray-700">{z.name}</span>
                                    {z.moduleId && <span className="text-xs text-primary font-bold">📡 {z.moduleId}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {soilAnalysis && (
                <div className="bg-primary-light p-3 rounded-xl border border-primary/20">
                    <p className="text-xs text-primary font-bold">✅ {t('soil_analysis_attached') || 'Soil analysis attached'}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{soilAnalysis.summary?.substring(0, 80)}...</p>
                </div>
            )}
        </div>
    );

    const handleNext = async () => {
        if (step < TOTAL_STEPS) {
            setStep(step + 1);
        } else {
            setLoading(true);
            console.log('[Onboarding] Starting finish...');

            const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!storedUser || !storedUser.uid) {
                alert('Session expired. Please log in again.');
                navigate('/login');
                return;
            }

            const uid = storedUser.uid;

            // Mark onboarding complete in localStorage FIRST (so we never get stuck)
            localStorage.setItem(`onboarding_${uid}`, 'true');
            console.log('[Onboarding] localStorage set, uid:', uid);

            // Apply theme immediately
            if (formData.selectedCrops.length > 0) {
                const firstCrop = CROPS_LIST.find(c => c.id === formData.selectedCrops[0]);
                if (firstCrop) applyTheme(firstCrop.name);
            }

            // Try to save to Firestore with a timeout so we don't hang forever
            const firestoreWork = async () => {
                for (const cropId of formData.selectedCrops) {
                    const cropDef = CROPS_LIST.find(c => c.id === cropId);
                    if (!cropDef) continue;

                    const zones = formData.zonesConfig[cropId] || [{ name: 'Zone 1', moduleId: '' }];
                    console.log('[Onboarding] Adding crop:', cropDef.name);

                    const newCropId = await addNewCrop({
                        name: cropDef.name,
                        icon: cropDef.icon,
                        variety: 'Standard',
                        zones: zones.map(z => ({
                            name: z.name,
                            moduleId: z.moduleId || ''
                        }))
                    });
                    console.log('[Onboarding] addNewCrop returned:', newCropId);

                    // Store soil analysis for first crop if available
                    if (soilAnalysis && newCropId) {
                        try {
                            await addDoc(collection(db, `users/${uid}/crops/${newCropId}/soilReports`), {
                                fileName: formData.soilFile?.name || 'soil_report',
                                uploadedAt: serverTimestamp(),
                                analysis: soilAnalysis
                            });
                        } catch (e) {
                            console.error('Failed to save soil report:', e);
                        }
                    }
                }

                try {
                    await setDoc(doc(db, 'users', uid), { onboardingCompleted: true }, { merge: true });
                    console.log('[Onboarding] Firestore onboarding flag set');
                } catch (e) {
                    console.error('Failed to mark onboarding in Firestore:', e);
                }
            };

            // Race: Firestore work vs 10s timeout
            try {
                await Promise.race([
                    firestoreWork(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 10000))
                ]);
                console.log('[Onboarding] Firestore work completed');
            } catch (error) {
                console.warn('[Onboarding] Firestore timed out or failed (non-fatal):', error.message);
            }

            // ALWAYS navigate to dashboard
            console.log('[Onboarding] Navigating to /dashboard...');
            setLoading(false);
            refreshAllData();
            navigate('/dashboard');
            console.log('[Onboarding] navigate() called');
        }
    };

    const canProceed = () => {
        if (step === 1) return formData.selectedCrops.length > 0;
        if (step === 3 && formData.hasSoilData === null) return false;
        if (step === 3 && formData.hasSoilData === true && !soilAnalysis && !formData.soilFile) return false;
        if (step === 3 && analyzingFile) return false;
        return true;
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Progress Bar */}
            <div className="bg-white p-4 shadow-sm">
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                    />
                </div>
                <p className="text-right text-xs text-gray-400 mt-1.5">{t('step')} {step} / {TOTAL_STEPS}</p>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 pb-28 overflow-y-auto">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-between items-center shadow-lg">
                <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1 || loading}
                    className={`text-gray-500 font-bold px-4 py-2 rounded-lg ${step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-100 active:scale-95'}`}
                >
                    {t('previous')}
                </button>
                <button
                    onClick={handleNext}
                    disabled={loading || !canProceed()}
                    className={`bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-md transition flex items-center active:scale-95 ${(loading || !canProceed()) ? 'opacity-50' : 'hover:opacity-90'}`}
                >
                    {loading ? (t('setting_up') || 'Setting up...') : (step === TOTAL_STEPS ? t('finish') : t('next'))}
                    {!loading && step < TOTAL_STEPS && <span className="ml-2">→</span>}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
