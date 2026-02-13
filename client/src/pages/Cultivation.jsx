import React from 'react';
import { useTranslation } from 'react-i18next';

const Cultivation = () => {
    const { t } = useTranslation();

    const tips = [
        {
            title: "Seed Treatment",
            crop: "Wheat",
            desc: "Treat seeds with Trichoderma viride (4g/kg) to prevent soil-borne diseases.",
            season: "Rabi"
        },
        {
            title: "Proper Irrigation",
            crop: "Rice",
            desc: "Maintain 2-3 cm water level during vegetative stage. Drain field before harvesting.",
            season: "Kharif"
        },
        {
            title: "Weed Management",
            crop: "General",
            desc: "Remove weeds manually within 30-45 days of sowing to reduce competition for nutrients.",
            season: "All"
        }
    ];

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-primary">Cultivation Tips</h1>

            <div className="grid gap-4">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-surface p-6 rounded-lg shadow-card border-l-4 border-primary hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{tip.title}</h3>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold uppercase">{tip.crop}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{tip.desc}</p>
                        <span className="text-sm text-gray-500 font-medium">Season: {tip.season}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cultivation;
