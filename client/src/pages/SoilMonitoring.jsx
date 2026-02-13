import React from 'react';
import { useTranslation } from 'react-i18next';

const SoilIndicator = ({ label, value, unit, status, icon }) => {
    const getStatusColor = (s) => {
        switch (s) {
            case 'Good': return 'bg-green-100 text-green-800 border-green-200';
            case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Risk': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(status)} flex items-center justify-between`}>
            <div>
                <p className="text-sm font-bold uppercase opacity-70 mb-1">{label}</p>
                <p className="text-3xl font-bold">{value}<span className="text-lg font-normal ml-1">{unit}</span></p>
            </div>
            <div className="text-4xl">{icon}</div>
        </div>
    );
};

const SoilMonitoring = () => {
    const { t } = useTranslation();

    // Mock Real-time Data
    const currentData = {
        moisture: 62,
        humidity: 58,
        temperature: 28,
        nitrogen: 'Medium',
        phosphorus: 'Low',
        potassium: 'High'
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-primary">{t('soil_monitoring')}</h1>

            {/* Live Status Header */}
            <div className="flex items-center justify-between bg-surface p-4 rounded-lg shadow-card">
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-600 font-medium">Sensor Status: <span className="text-green-600">Online (ESP32)</span></span>
                </div>
                <span className="text-xs text-gray-400">Updated: Just now</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vital Indicators */}
                <SoilIndicator
                    label="Soil Moisture"
                    value={currentData.moisture}
                    unit="%"
                    status={currentData.moisture > 40 ? 'Good' : 'Warning'}
                    icon="💧"
                />
                <SoilIndicator
                    label="Humidity"
                    value={currentData.humidity}
                    unit="%"
                    status="Good"
                    icon="☁️"
                />
                <SoilIndicator
                    label="Temperature"
                    value={currentData.temperature}
                    unit="°C"
                    status={currentData.temperature > 35 ? 'Risk' : 'Good'}
                    icon="🌡️"
                />
            </div>

            {/* NPK Status (Simplified) */}
            <div className="bg-surface p-6 rounded-lg shadow-card">
                <h3 className="text-lg font-bold text-secondary mb-4">Nutrient Levels (NPK)</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-700">Nitrogen (N)</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">Medium</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-700">Phosphorus (P)</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">Low - Add DAP</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-700">Potassium (K)</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">High</span>
                    </div>
                </div>
            </div>

            {/* Action Card */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
                <h3 className="font-bold text-blue-800 mb-1">Recommendation</h3>
                <p className="text-blue-700 text-sm">
                    Soil moisture is good, but phosphorus is low. Consider applying <strong>DAP fertilizer</strong> during the next irrigation cycle.
                </p>
            </div>
        </div>
    );
};

export default SoilMonitoring;
