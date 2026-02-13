import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { t } = useTranslation();
    const [location, setLocation] = useState("Detecting...");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fallback Mock Data
    const soilMoisture = 60;

    useEffect(() => {
        // 1. Get User Coordinates
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(latitude, longitude);
                    fetchLocationName(latitude, longitude);
                },
                (err) => {
                    console.error("Location Error:", err);
                    setLocation("Location Denied");
                    // Fallback to default location (e.g., Delhi)
                    fetchWeatherData(28.7041, 77.1025);
                }
            );
        } else {
            setLocation("Not Supported");
            setLoading(false);
        }
    }, []);

    const fetchWeatherData = async (lat, lon) => {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            if (!response.ok) throw new Error('Weather Fetch Failed');
            const data = await response.json();

            setWeather({
                temp: Math.round(data.main.temp),
                condition: data.weather[0].main,
                humidity: data.main.humidity,
                wind: `${Math.round(data.wind.speed * 3.6)} km/h`, // Convert m/s to km/h
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            });
        } catch (err) {
            console.error(err);
            setError("Weather Unavailable");
        } finally {
            setLoading(false);
        }
    };

    const fetchLocationName = async (lat, lon) => {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        // Using OpenWeatherMap Reverse Geocoding (Check availability in free tier, usually limited but works)
        try {
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
            if (!response.ok) throw new Error('Geo Fetch Failed');
            const data = await response.json();
            if (data && data.length > 0) {
                setLocation(`${data[0].name}, ${data[0].state || ''}`);
            } else {
                setLocation("Unknown Location");
            }
        } catch (err) {
            console.error(err);
            // Fallback: If OpenWeather Geo fails (limit reached), keep generic
            setLocation(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
        }
    };

    // Helper for AI Advice based on simple rules (Mock AI)
    const getAdvice = (w) => {
        if (!w) return { title: "Loading Advice...", desc: "Analyzing weather patterns...", action: "Wait" };

        if (w.condition.toLowerCase().includes('rain') || w.condition.toLowerCase().includes('drizzle')) {
            return {
                title: "Rain Expected / Raining",
                desc: "Do not irrigate today. Ensure field drainage is clear to prevent water logging.",
                action: "Stop Irrigation"
            };
        } else if (w.temp > 35) {
            return {
                title: "Heat Wave Alert",
                desc: "High temperatures detected. Apply light irrigation in the evening to reduce heat stress.",
                action: "Irrigate Evening"
            };
        } else {
            return {
                title: "Optimal Conditions",
                desc: "Weather is favorable. Routine inspection recommended for pests.",
                action: "Inspect Crop"
            };
        }
    };

    const advice = getAdvice(weather);

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-24">
            {/* Header: Location & Date */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-primary">{t('dashboard')}</h1>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-1">📍</span>
                        <span className="font-medium text-gray-700">{location}</span>
                    </div>
                </div>
                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">
                    {new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
            </div>

            {/* loading state */}
            {loading && <div className="text-center py-10 bg-white rounded-xl shadow-sm">Loading Weather Data...</div>}

            {/* 1. HERO: AI Recommendation (Weather Based) */}
            {!loading && weather && (
                <div className={`text-white p-5 rounded-2xl shadow-lg relative overflow-hidden ${advice.title.includes('Rain') ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-yellow-500 to-orange-600'}`}>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                🤖 AI Insight
                            </span>
                            <img src={weather.icon} alt={weather.condition} className="w-12 h-12 -mt-2 bg-white/10 rounded-full" />
                        </div>
                        <h2 className="text-xl font-bold mb-1">{advice.title}</h2>
                        <p className="opacity-95 text-sm leading-relaxed mb-3">
                            {advice.desc}
                        </p>
                        <div className="flex space-x-2">
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">⚡ {advice.action}</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">🌡️ {weather.temp}°C</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Vital Stats Grid (Weather & Soil) */}
            {!loading && weather && (
                <div className="grid grid-cols-2 gap-4">
                    {/* Detailed Weather Card */}
                    <div className="bg-white p-4 rounded-xl shadow-card border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-gray-400 uppercase">{t('weather')}</span>
                        </div>
                        <div className="mt-2">
                            <p className="text-3xl font-bold text-gray-800">{weather.temp}°C</p>
                            <p className="text-sm text-gray-500 font-medium">{weather.condition}</p>
                        </div>
                        <div className="mt-2 text-xs text-gray-400 flex justify-between border-t pt-2">
                            <span>💨 {weather.wind}</span>
                            <span>💧 {weather.humidity}%</span>
                        </div>
                    </div>

                    {/* Soil Health Card */}
                    <Link to="/soil-monitoring" className="bg-white p-4 rounded-xl shadow-card border border-gray-100 flex flex-col justify-between hover:border-primary transition group">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-gray-400 uppercase">{t('soil_monitoring')}</span>
                            <span className="p-1 bg-green-50 rounded text-green-600 group-hover:bg-green-100 transition">↗️</span>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-secondary">{soilMoisture}%</span>
                                <span className="text-xs text-gray-400 ml-1">Moisture</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold w-full block text-center">
                                Optimal Level
                            </span>
                        </div>
                    </Link>
                </div>
            )}

            {/* 3. PRIMARY FEATURE: Crop Doctor (Moved Down) */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
                <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-green-800 flex items-center">
                            <span className="mr-2">🌿</span> {t('disease_detection')}
                        </h2>
                        <p className="text-xs text-green-600">detect crop diseases early</p>
                    </div>
                    <Link to="/disease-detection" className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-green-700 transition shadow-sm">
                        Start Check 📸
                    </Link>
                </div>
                <div className="p-4 flex space-x-4 overflow-x-auto">
                    {/* Horizontal Scrollable History / Examples (Mock) */}
                    <Link to="/disease-detection" className="flex-shrink-0 w-24 text-center cursor-pointer">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg mb-1 flex items-center justify-center border-2 border-dashed border-green-300 hover:bg-green-50 transition">
                            <span className="text-2xl text-green-500">➕</span>
                        </div>
                        <span className="text-xs text-gray-600 font-bold">New Scan</span>
                    </Link>
                </div>
            </div>

            {/* 4. Tools Grid */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 ml-1">Farming Tools</h3>
                <div className="grid grid-cols-3 gap-3">
                    <Link to="/calculators" className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-1 hover:border-primary transition py-4">
                        <span className="text-2xl">🧮</span>
                        <span className="text-xs font-bold text-gray-700">{t('calculators')}</span>
                    </Link>

                    <Link to="/community" className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-1 hover:border-primary transition py-4">
                        <span className="text-2xl">👥</span>
                        <span className="text-xs font-bold text-gray-700">{t('community')}</span>
                    </Link>

                    <Link to="/news" className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-1 hover:border-primary transition py-4">
                        <span className="text-2xl">📰</span>
                        <span className="text-xs font-bold text-gray-700">{t('news')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
