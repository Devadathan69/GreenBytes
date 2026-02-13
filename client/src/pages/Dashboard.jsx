import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { t } = useTranslation();

    // Mock Data
    const weather = { temp: 28, condition: 'Sunny', humidity: 62 };
    const soilMoisture = 60; // Percentage

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header with Greeting */}
            <h1 className="text-2xl font-bold text-primary">{t('dashboard')}</h1>

            {/* 1. Daily Smart Recommendation (Hero Card) */}
            <div className="bg-white p-6 rounded-lg shadow-card border-l-4 border-accent">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <span className="text-2xl mr-2">💡</span> {t('daily_advice')}
                </h2>
                <p className="text-gray-700 text-lg">
                    Soil moisture is optimal today. No irrigation needed.
                    <br />
                    <strong>Plan:</strong> Inspect wheat crop for rust signs tomorrow.
                </p>
            </div>

            {/* 2. Weather & Vital Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary text-white p-4 rounded-lg shadow-card">
                    <p className="text-sm opacity-90">{t('weather')}</p>
                    <div className="flex items-center mt-2">
                        <span className="text-3xl mr-2">☀️</span>
                        <div>
                            <p className="text-2xl font-bold">{weather.temp}°C</p>
                            <p className="text-xs">{weather.condition}</p>
                        </div>
                    </div>
                </div>

                <Link to="/soil-monitoring" className="bg-white p-4 rounded-lg shadow-card border border-gray-100 flex flex-col justify-between hover:bg-gray-50">
                    <p className="text-sm text-gray-500 font-bold uppercase">{t('soil_monitoring')}</p>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-secondary">{soilMoisture}%</span>
                        <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded">Good</span>
                    </div>
                </Link>
            </div>

            {/* 3. Quick Actions Grid */}
            <h3 className="text-lg font-bold text-text mt-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <Link to="/disease-detection" className="bg-white p-4 rounded-lg shadow-card flex flex-col items-center justify-center text-center space-y-2 hover:bg-green-50 transition border border-transparent hover:border-primary">
                    <span className="text-4xl">📸</span>
                    <span className="font-bold text-primary">{t('disease_detection')}</span>
                </Link>

                <Link to="/calculators" className="bg-white p-4 rounded-lg shadow-card flex flex-col items-center justify-center text-center space-y-2 hover:bg-green-50 transition border border-transparent hover:border-primary">
                    <span className="text-4xl">🧮</span>
                    <span className="font-bold text-primary">{t('calculators')}</span>
                </Link>

                <Link to="/community" className="bg-white p-4 rounded-lg shadow-card flex flex-col items-center justify-center text-center space-y-2 hover:bg-green-50 transition border border-transparent hover:border-primary">
                    <span className="text-4xl">👥</span>
                    <span className="font-bold text-primary">{t('community')}</span>
                </Link>

                <Link to="/market" className="bg-white p-4 rounded-lg shadow-card flex flex-col items-center justify-center text-center space-y-2 hover:bg-green-50 transition border border-transparent hover:border-primary">
                    <span className="text-4xl">🛒</span>
                    <span className="font-bold text-primary">{t('market')}</span>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
