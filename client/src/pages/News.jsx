import React from 'react';
import { useTranslation } from 'react-i18next';

const News = () => {
    const { t } = useTranslation();

    const newsItems = [
        {
            id: 1,
            title: "MSP for Wheat Hiked by ₹150",
            source: "Government Advisory",
            date: "12 Feb 2026",
            summary: "The central government has announced a hike in Minimum Support Price for upcoming Rabi crops.",
            tag: "Policy"
        },
        {
            id: 2,
            title: "Heavy Rainfall Alert for North India",
            source: "IMD Weather",
            date: "13 Feb 2026",
            summary: "Farmers are advised to ensure proper drainage in fields as heavy showers are expected.",
            tag: "Weather"
        }
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-primary">{t('news')}</h1>

            <div className="space-y-4">
                {newsItems.map(item => (
                    <div key={item.id} className="bg-surface p-6 rounded-lg shadow-card hover:bg-gray-50 transition border-l-4 border-accent">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-bold uppercase">{item.tag}</span>
                            <span className="text-xs text-gray-400">{item.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-700 mb-2">{item.summary}</p>
                        <p className="text-xs text-gray-500 font-bold">Source: {item.source}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
