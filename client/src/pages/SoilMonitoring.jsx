import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SoilMonitoring = () => {
    // Mock Data
    const weeklyData = [
        { day: 'Mon', moisture: 65, humidity: 70 },
        { day: 'Tue', moisture: 62, humidity: 68 },
        { day: 'Wed', moisture: 58, humidity: 65 },
        { day: 'Thu', moisture: 55, humidity: 60 },
        { day: 'Fri', moisture: 60, humidity: 62 },
        { day: 'Sat', moisture: 68, humidity: 75 },
        { day: 'Sun', moisture: 72, humidity: 78 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">Soil & Environment Monitor</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Soil Moisture Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Soil Moisture Trends</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData}>
                                <defs>
                                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="moisture" stroke="#2E7D32" fillOpacity={1} fill="url(#colorMoisture)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        Average Moisture: <span className="font-bold text-primary">62%</span> (Optimal)
                    </p>
                </div>

                {/* Humidity Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Ambient Humidity</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="humidity" stroke="#3B82F6" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        Average Humidity: <span className="font-bold text-blue-600">68%</span> (Moderate)
                    </p>
                </div>
            </div>

            {/* Recommendations based on data */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Smart Analysis</h2>
                <p className="text-gray-700">
                    Soil moisture is currently stable. Based on the forecast, you may need to irrigate lightly on <span className="font-bold">Thursday</span>.
                </p>
            </div>
        </div>
    );
};

export default SoilMonitoring;
