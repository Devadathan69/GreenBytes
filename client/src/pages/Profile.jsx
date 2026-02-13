import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        state: 'Punjab',
        district: '',
        village: '',
        mainCrop: 'Wheat',
        cropVariety: '',
        landArea: '',
        growthStage: 'Vegetative',
    });

    useEffect(() => {
        // Load from LocalStorage
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            setFormData(JSON.parse(savedProfile));
        }
        setLoading(false);
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Mock Save
            localStorage.setItem('userProfile', JSON.stringify(formData));
            setMessage("Profile Updated (Locally) ✅");
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile ❌");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    if (loading) return <div className="p-8 text-center">Loading Profile...</div>;

    return (
        <div className="max-w-xl mx-auto space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-primary">{t('profile')}</h1>

            {/* Phone Number Display */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center justify-between">
                <div>
                    <p className="text-xs text-green-800 font-bold uppercase">Registered Mobile</p>
                    <p className="text-xl font-bold text-green-900">{formData.phone || '+911234567890'}</p>
                </div>
                <span className="text-2xl">📱</span>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-card space-y-4">
                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Farmer Details</h2>

                {/* Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/50"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Location Group */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded">
                            <option>Punjab</option>
                            <option>Haryana</option>
                            <option>Uttar Pradesh</option>
                            <option>Madhya Pradesh</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">District</label>
                        <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ludhiana" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Village</label>
                    <input type="text" name="village" value={formData.village} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Village Name" />
                </div>

                <h2 className="text-lg font-bold text-gray-800 border-b pb-2 pt-4">Farm Details</h2>

                {/* Crop Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Main Crop</label>
                        <select name="mainCrop" value={formData.mainCrop} onChange={handleChange} className="w-full p-2 border rounded">
                            <option>Wheat</option>
                            <option>Rice</option>
                            <option>Cotton</option>
                            <option>Sugarcane</option>
                            <option>Maize</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Land Area (Acres)</label>
                        <input type="number" name="landArea" value={formData.landArea} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. 5" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Current Stage</label>
                    <div className="flex space-x-2">
                        {['Sowing', 'Vegetative', 'Flowering', 'Harvesting'].map(stage => (
                            <button
                                key={stage}
                                type="button"
                                onClick={() => setFormData({ ...formData, growthStage: stage })}
                                className={`px-3 py-1 rounded-full text-xs font-bold border transition ${formData.growthStage === stage ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-gray-200 text-gray-500'}`}
                            >
                                {stage}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-800 transition shadow-md"
                    >
                        {loading ? "Saving..." : "Save Profile (Local)"}
                    </button>
                    {message && <p className="text-center mt-2 font-bold text-green-600">{message}</p>}
                </div>
            </form>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full text-red-500 font-bold py-2 hover:bg-red-50 rounded"
            >
                Log Out (Mock)
            </button>
        </div>
    );
};

export default Profile;
