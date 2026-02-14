import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCrop } from '../context/CropContext';
import { Link, useNavigate } from 'react-router-dom';
import i18n from '../i18n';

const LANGUAGES = [
    { code: 'en', name: 'English', icon: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', icon: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', icon: '🌴' },
    { code: 'ta', name: 'தமிழ்', icon: '🏛' },
    { code: 'te', name: 'తెలుగు', icon: '🌾' },
    { code: 'kn', name: 'ಕನ್ನಡ', icon: '🏔' },
];

const Dashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { crops, selectedCrop, selectCrop, zones, soilReports, sensorData, loading, addSoilReport } = useCrop();

    const [selectedZone, setSelectedZone] = useState(null);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [location, setLocation] = useState(null);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const { latitude, longitude } = pos.coords;
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                        const data = await res.json();
                        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
                        const state = data.address?.state || '';
                        setLocation({ city, state, lat: latitude, lon: longitude });
                    } catch {
                        setLocation({ city: '', state: '', lat: pos.coords.latitude, lon: pos.coords.longitude });
                    }
                },
                () => setLocation(null)
            );
        }
    }, []);

    // Weather data (uses temperature to pass to zone cards)
    const weather = {
        temp: 28,
        condition: t('partly_cloudy') || 'Partly Cloudy',
        icon: '⛅',
        insight: t('weather_insight') || 'Humidity is rising. Watch for fungal infections on lower leaves.'
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">{t('loading_farm') || 'Loading farm data...'}</p>
            </div>
        </div>
    );

    if (crops.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">🚜</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('welcome_cofarm') || 'Welcome to CoFarm'}</h2>
                <p className="text-gray-500 text-sm mb-6">{t('setup_farm') || 'Set up your farm to get started'}</p>
                <Link to="/onboarding" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-md active:scale-95 transition">
                    {t('start_farm_setup') || 'Start Farm Setup'}
                </Link>
            </div>
        );
    }

    const latestSoilReport = soilReports?.[0];

    // Get sensor data for a zone from RTDB
    const getZoneSensor = (zone) => {
        if (!zone.moduleId) return null;
        return sensorData[zone.moduleId] || null;
    };

    const handleCropChange = (e) => {
        const val = e.target.value;
        if (val === '__ADD_NEW__') {
            navigate('/onboarding');
        } else {
            selectCrop(val);
        }
    };

    const switchLanguage = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('i18nextLng', code);
        setShowLangPicker(false);
    };

    const handleUploadSoil = (e) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            addSoilReport({
                fileName: file.name,
                status: 'Good',
                analysis: {
                    nitrogen: 'High',
                    phosphorus: 'Low',
                    potassium: 'High',
                    pH: '6.8',
                    deficiencies: ['Phosphorus', 'Zinc'],
                    summary: 'Soil is moderately fertile. Phosphorus and Zinc need improvement.',
                    suggestions: ['Apply DAP fertilizer', 'Use Zinc Sulphate spray', 'Add organic compost']
                }
            });
        }
    };

    const locationText = location?.city
        ? `${location.city}${location.state ? `, ${location.state}` : ''}`
        : null;

    return (
        <div className="space-y-5 max-w-xl mx-auto">

            {/* 1. Top Bar: Crop Selector + Language */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('current_crop') || 'Current Crop'}</p>
                    <div className="relative">
                        <select
                            value={selectedCrop?.id || ''}
                            onChange={handleCropChange}
                            className="appearance-none bg-transparent text-xl font-bold text-gray-800 pr-6 focus:outline-none cursor-pointer"
                        >
                            {crops.map(crop => (
                                <option key={crop.id} value={crop.id}>{crop.icon} {crop.name}</option>
                            ))}
                            <option value="__ADD_NEW__">➕ {t('add_new_crop') || 'Add New Crop'}</option>
                        </select>
                        <span className="absolute right-0 top-1 pointer-events-none text-gray-300 text-sm">▼</span>
                    </div>
                </div>

                {/* Language Switcher */}
                <div className="relative">
                    <button
                        onClick={() => setShowLangPicker(!showLangPicker)}
                        className="bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm text-sm font-bold active:scale-95 transition flex items-center gap-1.5"
                    >
                        🌐 <span className="text-xs text-gray-600">{i18n.language?.toUpperCase()}</span>
                    </button>
                    {showLangPicker && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowLangPicker(false)} />
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-40 overflow-hidden">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => switchLanguage(lang.code)}
                                        className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 transition ${i18n.language === lang.code ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700'}`}
                                    >
                                        <span>{lang.icon}</span>
                                        <span>{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 2. Weather & AI Insight Card — with Location */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-bold opacity-70">{t('weather')}</p>
                                {locationText && (
                                    <span className="text-[10px] bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-90">
                                        📍 {locationText}
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold">{weather.temp}°C</p>
                            <p className="text-xs opacity-80">{weather.condition}</p>
                        </div>
                        <span className="text-3xl opacity-80">{weather.icon}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-lg border border-white/10">
                        <div className="flex items-center mb-0.5">
                            <span className="text-[10px] font-bold bg-yellow-400 text-yellow-900 px-1.5 rounded mr-1.5">{t('insight') || 'INSIGHT'}</span>
                            {locationText && (
                                <span className="text-[10px] opacity-60">📍 {locationText}</span>
                            )}
                        </div>
                        <p className="text-xs leading-snug opacity-90">{weather.insight}</p>
                    </div>
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* 3. Zones Grid */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center">
                    <span>{t('field_zones') || 'Field Zones'}</span>
                    <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">{zones.length}</span>
                </h3>

                {zones.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {zones.map(zone => {
                            const sensor = getZoneSensor(zone);
                            const isWaterLogged = sensor?.waterLogging === true;
                            const isConnected = sensor?.connected === true;
                            const hasModule = !!zone.moduleId;

                            return (
                                <button
                                    key={zone.id}
                                    onClick={() => setSelectedZone(zone)}
                                    className={`p-3.5 rounded-xl shadow-sm border text-left relative active:scale-[0.97] transition-all duration-300
                                        ${isWaterLogged
                                            ? 'bg-red-50 border-red-300 ring-2 ring-red-200'
                                            : 'bg-white border-gray-100 hover:border-primary/30'
                                        }`}
                                >
                                    {/* Water Clogging Warning Badge */}
                                    {isWaterLogged && (
                                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                                            ⚠️
                                        </div>
                                    )}

                                    {/* Zone Name + Module info */}
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-sm text-gray-700">{zone.name}</span>
                                        {isWaterLogged ? (
                                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                                        ) : isConnected ? (
                                            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                        ) : (
                                            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                                        )}
                                    </div>

                                    {zone.moduleId && (
                                        <p className={`text-[10px] font-bold mb-2 ${isConnected ? 'text-blue-500' : 'text-gray-400'}`}>
                                            📡 {zone.moduleId}
                                        </p>
                                    )}

                                    {/* Connected Module 1: Show big status + sensor data */}
                                    {hasModule && isConnected ? (
                                        <div className="space-y-2">
                                            {/* Big Status Display */}
                                            {isWaterLogged ? (
                                                <div className="bg-red-100 text-red-600 rounded-lg p-2 text-center">
                                                    <p className="text-lg font-extrabold">⚠️ {t('warning') || 'Warning'}</p>
                                                    <p className="text-[10px] font-bold">{t('water_clogging_detected') || 'Water Clogging!'}</p>
                                                </div>
                                            ) : (
                                                <div className="bg-green-50 text-green-600 rounded-lg p-2 text-center">
                                                    <p className="text-lg font-extrabold">✅ {t('good') || 'Good'}</p>
                                                </div>
                                            )}

                                            {/* Sensor values row */}
                                            <div className="grid grid-cols-3 gap-1 text-center">
                                                <div className="bg-blue-50 rounded-md p-1">
                                                    <p className="text-[9px] text-blue-400 font-bold">💧</p>
                                                    <p className="text-xs font-bold text-blue-700">{sensor.moisturePercent ?? '--'}%</p>
                                                </div>
                                                <div className="bg-orange-50 rounded-md p-1">
                                                    <p className="text-[9px] text-orange-400 font-bold">📊</p>
                                                    <p className="text-xs font-bold text-orange-700">{sensor.moistureValue ?? '--'}</p>
                                                </div>
                                                <div className="bg-purple-50 rounded-md p-1">
                                                    <p className="text-[9px] text-purple-400 font-bold">🌡️</p>
                                                    <p className="text-xs font-bold text-purple-700">{weather.temp}°C</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : hasModule ? (
                                        <div className="bg-gray-50 text-gray-400 text-[10px] font-bold p-3 rounded-lg text-center">
                                            📡 {t('module_not_connected') || 'Module not connected'}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 text-gray-400 text-[10px] font-bold p-3 rounded-lg text-center">
                                            {t('no_module_assigned') || 'No module assigned'}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-sm text-gray-400 py-5">{t('no_zones')}</p>
                )}
            </div>

            {/* 4. Soil Health - Simplified: nutrients, summary, actions only */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center">
                        🧪 {t('soil_health') || 'Soil Health'}
                    </h3>
                    <label className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold cursor-pointer active:scale-95">
                        📤 {t('upload') || 'Upload'}
                        <input type="file" accept="image/*,application/pdf" onChange={handleUploadSoil} className="hidden" />
                    </label>
                </div>

                {latestSoilReport?.analysis ? (
                    <div className="space-y-3">
                        {/* Nutrient Values */}
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1.5">{t('nutrient_values') || 'Nutrient Values'}</p>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(latestSoilReport.analysis.values || latestSoilReport.analysis)
                                    .filter(([key, val]) => typeof val === 'string' && !['summary', 'overallStatus', 'rawText', 'error'].includes(key))
                                    .slice(0, 6)
                                    .map(([key, val]) => (
                                        <div key={key} className="bg-gray-50 p-2 rounded-lg text-center">
                                            <p className="text-[10px] text-gray-400 uppercase">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                                            <p className="text-sm font-bold text-gray-700">{val}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Summary */}
                        {latestSoilReport.analysis.summary && (
                            <div className="bg-blue-50 p-2.5 rounded-lg">
                                <p className="text-[10px] text-blue-500 font-bold uppercase mb-0.5">{t('summary') || 'Summary'}</p>
                                <p className="text-xs text-blue-700 leading-snug">{latestSoilReport.analysis.summary}</p>
                            </div>
                        )}

                        {/* Actions / Suggestions */}
                        {latestSoilReport.analysis.suggestions?.length > 0 && (
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1.5">{t('actions_to_perform') || 'Actions to Perform'}</p>
                                <div className="space-y-1.5">
                                    {latestSoilReport.analysis.suggestions.map((s, i) => (
                                        <div key={i} className="flex items-start gap-2 bg-green-50 p-2 rounded-lg">
                                            <span className="text-green-500 text-xs mt-0.5">✅</span>
                                            <p className="text-xs text-green-700 leading-snug">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-3">
                        <p className="text-gray-400 text-xs">{t('no_soil_data') || 'No soil data yet'}</p>
                    </div>
                )}
            </div>

            {/* Zone Detail Modal */}
            {selectedZone && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setSelectedZone(null)}>
                    <div className="bg-white w-full max-w-xl rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>

                        {(() => {
                            const sensor = getZoneSensor(selectedZone);
                            const isWaterLogged = sensor?.waterLogging === true;
                            const isConnected = sensor?.connected === true;

                            return (
                                <>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{selectedZone.name}</h3>
                                            <p className="text-xs text-gray-400">{selectedCrop?.name} • {t('zone_details') || 'Zone Details'}</p>
                                        </div>
                                        {isWaterLogged ? (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                                                ⚠️ {t('water_clogging') || 'Water Clogging!'}
                                            </span>
                                        ) : isConnected ? (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                ✅ {t('good') || 'Good'}
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                                                {t('disconnected') || 'Disconnected'}
                                            </span>
                                        )}
                                    </div>

                                    {selectedZone.moduleId && (
                                        <div className={`p-3 rounded-lg mb-4 ${isConnected ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'}`}>
                                            <p className={`text-xs font-bold ${isConnected ? 'text-blue-600' : 'text-gray-400'}`}>
                                                📡 {t('module') || 'Module'}: {selectedZone.moduleId}
                                                {!isConnected && ` — ${t('module_not_connected') || 'Not connected'}`}
                                            </p>
                                        </div>
                                    )}

                                    {isConnected ? (
                                        <>
                                            {isWaterLogged && (
                                                <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4 text-center">
                                                    <p className="text-2xl mb-1">🚨</p>
                                                    <p className="text-sm font-bold text-red-700">{t('water_clogging_detected') || 'Water Clogging Detected!'}</p>
                                                    <p className="text-xs text-red-500 mt-1">{t('water_clogging_desc') || 'Excess water detected in this zone. Drainage action needed.'}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                <div className="bg-blue-50 p-3 rounded-xl text-center">
                                                    <p className="text-[10px] text-blue-500 font-bold">💧 {t('moisture') || 'Moisture'}</p>
                                                    <p className="text-lg font-bold text-blue-700">{sensor?.moisturePercent ?? '--'}%</p>
                                                </div>
                                                <div className="bg-orange-50 p-3 rounded-xl text-center">
                                                    <p className="text-[10px] text-orange-500 font-bold">📊 {t('raw_value') || 'Raw'}</p>
                                                    <p className="text-lg font-bold text-orange-700">{sensor?.moistureValue ?? '--'}</p>
                                                </div>
                                                <div className="bg-purple-50 p-3 rounded-xl text-center">
                                                    <p className="text-[10px] text-purple-500 font-bold">🌡️ {t('temp') || 'Temp'}</p>
                                                    <p className="text-lg font-bold text-purple-700">{weather.temp}°C</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-400">
                                                {t('last_updated') || 'Last updated'}: {sensor?.lastUpdated || 'N/A'}
                                            </p>
                                        </>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-3xl mb-2">📡</p>
                                            <p className="text-sm font-bold text-gray-500">{t('module_not_connected') || 'Module not connected'}</p>
                                            <p className="text-xs text-gray-400 mt-1">{t('module_not_connected_desc') || 'Sensor module is offline or not assigned to this zone.'}</p>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
