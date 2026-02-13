import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        state: 'Punjab',
        district: '',
        village: '',
        mainCrop: 'Wheat',
        cropVariety: '',
        sowingDate: '',
        growthStage: 'Vegetative', // Sowing, Vegetative, Flowering, Harvesting
        landArea: '',
    });

    // Load user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData({ ...formData, ...docSnap.data() });
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const docRef = doc(db, "users", currentUser.uid);
            await updateDoc(docRef, formData);
            setSuccess('Profile Updated Successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-primary">{t('profile')}</h1>

            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{success}</div>}

            <div className="bg-surface p-6 rounded-lg shadow-card">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Personal Info */}
                    <div>
                        <h3 className="text-lg font-bold text-secondary mb-4 border-b pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-text font-medium mb-1">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-text font-medium mb-1">Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Location */}
                    <div>
                        <h3 className="text-lg font-bold text-secondary mb-4 border-b pb-2">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-text font-medium mb-1">State</label>
                                <select name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary">
                                    <option value="Punjab">Punjab</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-text font-medium mb-1">District</label>
                                <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-text font-medium mb-1">Village</label>
                                <input type="text" name="village" value={formData.village} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Farm Details */}
                    <div>
                        <h3 className="text-lg font-bold text-secondary mb-4 border-b pb-2">Crop Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-text font-medium mb-1">Main Crop</label>
                                <select name="mainCrop" value={formData.mainCrop} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary">
                                    <option value="Wheat">Wheat (Gehu)</option>
                                    <option value="Rice">Rice (Dhan)</option>
                                    <option value="Cotton">Cotton (Kapas)</option>
                                    <option value="Sugarcane">Sugarcane (Ganna)</option>
                                    <option value="Maize">Maize (Makka)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-text font-medium mb-1">Growth Stage</label>
                                <select name="growthStage" value={formData.growthStage} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary">
                                    <option value="Sowing">Sowing (Beejan)</option>
                                    <option value="Vegetative">Vegetative (Badhwar)</option>
                                    <option value="Flowering">Flowering (Phool aana)</option>
                                    <option value="Harvesting">Harvesting (Katayi)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-text font-medium mb-1">Sowing Date</label>
                                <input type="date" name="sowingDate" value={formData.sowingDate} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-text font-medium mb-1">Land Area (Acres)</label>
                                <input type="number" name="landArea" value={formData.landArea} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-700 transition duration-300 shadow-md"
                    >
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
