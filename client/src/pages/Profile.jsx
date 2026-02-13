import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { currentUser } = useAuth();
    const { t, i18n } = useTranslation();
    const [farmName, setFarmName] = useState('Green Valley Farm');
    const [location, setLocation] = useState('Punjab, India');
    const [crops, setCrops] = useState(['Wheat', 'Rice']);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-primary">Farmer Profile</h1>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {currentUser?.email?.charAt(0).toUpperCase() || 'F'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{currentUser?.email || 'Farmer'}</h2>
                        <p className="text-gray-500">Member since 2024</p>
                    </div>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Farm Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Primary Crops</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={crops.join(', ')}
                            onChange={(e) => setCrops(e.target.value.split(', '))}
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <label className="block text-gray-700 text-sm font-bold mb-2">App Language</label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className={`px-4 py-2 rounded ${i18n.language === 'en' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => changeLanguage('en')}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 rounded ${i18n.language === 'hi' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => changeLanguage('hi')}
                            >
                                Hindi
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
