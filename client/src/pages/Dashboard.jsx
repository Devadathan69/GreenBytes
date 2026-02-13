import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { t } = useTranslation();

    // Mock Data
    const sensorData = [
        { time: '08:00', moisture: 65, humidity: 70 },
        { time: '10:00', moisture: 62, humidity: 68 },
        { time: '12:00', moisture: 58, humidity: 65 },
        { time: '14:00', moisture: 55, humidity: 60 },
        { time: '16:00', moisture: 60, humidity: 62 },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">{t('dashboard')}</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Selected Crop</h3>
                    <p className="text-2xl font-bold text-text mt-2">Wheat (Gehu)</p>
                    <p className="text-sm text-green-600 mt-1">Health: Good</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Soil Moisture</h3>
                    <p className="text-2xl font-bold text-text mt-2">60%</p>
                    <p className="text-sm text-gray-400 mt-1">Optimal Range</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Humidity</h3>
                    <p className="text-2xl font-bold text-text mt-2">62%</p>
                    <p className="text-sm text-gray-400 mt-1">Moderate</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Sensor Trends */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-primary mb-4">Moisture Trends (Today)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sensorData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="moisture" stroke="#2E7D32" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts / Notifications */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-primary mb-4">Alerts & Recommendations</h3>
                    <ul className="space-y-3">
                        <li className="bg-yellow-50 p-3 rounded border border-yellow-100 flex items-start">
                            <span className="text-2xl mr-3">⚠️</span>
                            <div>
                                <p className="font-bold text-yellow-800">Irrigation Needed Soon</p>
                                <p className="text-sm text-yellow-700">Moisture levels are dropping. Plan to water within 24 hours.</p>
                            </div>
                        </li>
                        <li className="bg-green-50 p-3 rounded border border-green-100 flex items-start">
                            <span className="text-2xl mr-3">✅</span>
                            <div>
                                <p className="font-bold text-green-800">Crop Health Check</p>
                                <p className="text-sm text-green-700">Last inspection showed no signs of disease. Keep monitoring.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
