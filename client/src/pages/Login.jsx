import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrop } from '../context/CropContext';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('INPUT_DETAILS');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { refreshAllData } = useCrop();

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!name.trim()) { setError(t('enter_name_error') || 'Please enter your name'); return; }
        if (!phoneNumber.trim()) { setError(t('enter_phone_error') || 'Please enter phone number'); return; }
        setStep('INPUT_OTP');
        setError('');
        alert("Mock OTP sent: 123456");
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp !== '123456') {
            setError(t('invalid_otp') || "Invalid OTP. Use 123456");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create a deterministic UID from phone number (mock auth)
            const uid = `user-${phoneNumber.replace(/\D/g, '')}`;

            const userData = {
                uid,
                displayName: name.trim(),
                phoneNumber: `+91${phoneNumber}`,
                email: email.trim() || '',
                isMock: true
            };

            // Store user profile in Firestore
            await setDoc(doc(db, 'users', uid), {
                displayName: name.trim(),
                phoneNumber: `+91${phoneNumber}`,
                email: email.trim() || '',
                language: localStorage.getItem('language') || 'en',
                updatedAt: serverTimestamp()
            }, { merge: true });

            // Store in localStorage for session management
            localStorage.setItem('currentUser', JSON.stringify(userData));
            refreshAllData();

            // Check if onboarding is completed
            const isOnboarded = localStorage.getItem(`onboarding_${uid}`);
            if (isOnboarded) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-light to-background p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
                {/* Branding */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                        <span className="text-3xl">🌱</span>
                    </div>
                    <h2 className="text-2xl font-bold text-primary">{t('app_name')}</h2>
                    <p className="text-gray-400 text-sm mt-1">{t('login')}</p>
                </div>

                {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">{error}</p>}

                {step === 'INPUT_DETAILS' && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1.5">{t('your_name') || 'Your Name'}</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('name_placeholder') || 'Enter your full name'}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1.5">{t('email_label') || 'Email (optional)'}</label>
                            <input
                                type="email"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="farmer@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1.5">{t('phone_label') || 'Phone Number'}</label>
                            <div className="flex">
                                <span className="p-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 font-bold text-sm">+91</span>
                                <input
                                    type="tel"
                                    className="w-full p-3 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="9876543210"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md">
                            {t('send_otp') || 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 'INPUT_OTP' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">{t('enter_otp') || 'Enter OTP'}</label>
                            <input
                                type="number"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 tracking-widest text-center text-2xl"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1.5">Demo OTP: 123456</p>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md disabled:opacity-60">
                            {loading ? (t('verifying') || 'Verifying...') : (t('verify_login') || 'Verify & Login')}
                        </button>
                        <button type="button" onClick={() => setStep('INPUT_DETAILS')} className="w-full text-gray-500 text-sm hover:underline">
                            {t('change_phone') || 'Change Details'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
