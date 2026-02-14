import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const languages = [
    { code: 'en', label: 'English', native: 'English', icon: '🇬🇧' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', icon: '🇮🇳' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം', icon: '🌴' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்', icon: '🏛️' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', icon: '🌾' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', icon: '🏔️' },
];

const LanguageSelection = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const selectLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-background flex flex-col items-center justify-center p-6">
            {/* Branding */}
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl">🌱</span>
                </div>
                <h1 className="text-3xl font-bold text-primary tracking-tight">{t('app_name')}</h1>
                <p className="text-gray-500 text-sm mt-1">{t('tagline')}</p>
            </div>

            {/* Language Grid */}
            <div className="w-full max-w-sm">
                <p className="text-center text-gray-600 font-medium mb-4 text-sm">{t('choose_language')} / भाषा चुनें</p>
                <div className="grid grid-cols-2 gap-3">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => selectLanguage(lang.code)}
                            className="bg-white p-4 rounded-xl shadow-sm border-2 border-gray-100 hover:border-primary hover:shadow-md transition-all flex flex-col items-center space-y-1 active:scale-95"
                        >
                            <span className="text-2xl">{lang.icon}</span>
                            <span className="font-bold text-gray-800">{lang.native}</span>
                            <span className="text-xs text-gray-400">{lang.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-8">{t('change_later')}</p>
        </div>
    );
};

export default LanguageSelection;
