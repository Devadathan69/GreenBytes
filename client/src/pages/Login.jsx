import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('INPUT_PHONE'); // INPUT_PHONE, INPUT_OTP
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (phoneNumber !== '1234567890') {
            setError("For demo, use Test Number: 1234567890");
            return;
        }
        setStep('INPUT_OTP');
        setError('');
        alert("Mock OTP sent: 123456");
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp !== '123456') {
            setError("Invalid OTP. Use 123456");
            return;
        }

        setLoading(true);

        // Simulate Login Delay
        setTimeout(() => {
            // Create Mock User
            const mockUser = {
                uid: "mock-user-123",
                phoneNumber: "+911234567890",
                displayName: "Demo Farmer",
                isMock: true
            };

            // Save to LocalStorage
            localStorage.setItem('currentUser', JSON.stringify(mockUser));

            // Initialize Profile if empty
            if (!localStorage.getItem('userProfile')) {
                localStorage.setItem('userProfile', JSON.stringify({
                    name: "Demo Farmer",
                    phone: "+911234567890",
                    state: "Punjab",
                    district: "Ludhiana",
                    village: "Sample Village",
                    mainCrop: "Wheat",
                    landArea: "5",
                    growthStage: "Vegetative"
                }));
                navigate('/profile');
            } else {
                navigate('/dashboard');
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-secondary/20">
                <h2 className="text-3xl font-bold text-primary mb-2 text-center">{t('app_name')}</h2>
                <p className="text-center text-gray-500 mb-6 font-medium">Mock Login</p>

                {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-100 text-sm">{error}</p>}

                {step === 'INPUT_PHONE' && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number / मोबाइल नंबर</label>
                            <div className="flex">
                                <span className="p-3 bg-gray-100 border border-r-0 border-secondary/30 rounded-l text-gray-500 font-bold">+91</span>
                                <input
                                    type="tel"
                                    className="w-full p-3 border border-secondary/30 rounded-r focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="1234567890"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Try: 1234567890</p>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-800 transition duration-300"
                        >
                            Send Mock OTP
                        </button>
                    </form>
                )}

                {step === 'INPUT_OTP' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP</label>
                            <input
                                type="number"
                                className="w-full p-3 border border-secondary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 tracking-widest text-center text-2xl"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">Try: 123456</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-800 transition duration-300"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('INPUT_PHONE')}
                            className="w-full text-gray-500 text-sm hover:underline"
                        >
                            Change Phone Number
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
