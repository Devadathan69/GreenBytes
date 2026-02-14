import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCrop } from '../context/CropContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { crops, zones, currentUser, selectedCrop } = useCrop();
    const [showLanguage, setShowLanguage] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/language');
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        setShowLanguage(false);
    };

    const getCurrentLanguageName = () => {
        const langs = { en: 'English', hi: 'हिन्दी', ml: 'മലയാളം', ta: 'தமிழ்', te: 'తెలుగు', kn: 'ಕನ್ನಡ' };
        return langs[i18n.language] || 'English';
    };

    return (
        <div className="max-w-xl mx-auto space-y-5 pb-20">

            {/* User Card */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                            👤
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{currentUser?.displayName || 'Farmer'}</h2>
                            <p className="text-white/70 text-sm">{currentUser?.phoneNumber || ''}</p>
                            {currentUser?.email && <p className="text-white/70 text-xs">{currentUser.email}</p>}
                        </div>
                    </div>
                    <div className="flex items-center mt-3 space-x-4 text-xs text-white/60">
                        <span>🌾 {crops.length} {t('zones')}</span>
                        <span>📡 {zones.length} {t('module')}</span>
                    </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* My Crops */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">{t('my_crops')}</h3>
                {crops.length > 0 ? (
                    <div className="space-y-2">
                        {crops.map(crop => (
                            <div key={crop.id} className={`bg-white p-3.5 rounded-xl shadow-sm border flex items-center space-x-3 ${selectedCrop?.id === crop.id ? 'border-primary' : 'border-gray-100'}`}>
                                <span className="text-2xl">{crop.icon}</span>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{crop.name}</p>
                                    <p className="text-xs text-gray-400">{crop.variety || 'Standard'}</p>
                                </div>
                                {selectedCrop?.id === crop.id && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Active</span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm text-center py-4">{t('no_crops')}</p>
                )}
            </div>

            {/* Settings */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">{t('app_settings')}</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                    {/* Language */}
                    <button
                        onClick={() => setShowLanguage(!showLanguage)}
                        className="w-full flex justify-between items-center p-4"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">🌐</span>
                            <span className="text-sm font-medium text-gray-700">{t('language')}</span>
                        </div>
                        <span className="text-sm text-gray-400">{getCurrentLanguageName()} ▸</span>
                    </button>

                    {showLanguage && (
                        <div className="p-3 grid grid-cols-3 gap-2 bg-gray-50">
                            {[
                                { code: 'en', label: 'English' },
                                { code: 'hi', label: 'हिन्दी' },
                                { code: 'ml', label: 'മലയാളം' },
                                { code: 'ta', label: 'தமிழ்' },
                                { code: 'te', label: 'తెలుగు' },
                                { code: 'kn', label: 'ಕನ್ನಡ' },
                            ].map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`text-xs font-bold py-2 rounded-lg transition active:scale-95 ${i18n.language === lang.code
                                        ? 'bg-primary text-white'
                                        : 'bg-white border border-gray-200 text-gray-600'
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Export/Reset */}
                    <button className="w-full flex justify-between items-center p-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">📤</span>
                            <span className="text-sm font-medium text-gray-700">{t('export_data')}</span>
                        </div>
                        <span className="text-gray-300">▸</span>
                    </button>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-red-100 active:scale-[0.98] transition"
            >
                {t('logout')}
            </button>
        </div>
    );
};

export default Profile;
