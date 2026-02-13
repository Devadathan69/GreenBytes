import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-secondary/20">
                <h2 className="text-3xl font-bold text-primary mb-6 text-center">{t('login')} to CoFarm</h2>
                {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-100">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-secondary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="farmer@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-secondary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-800 transition duration-300"
                    >
                        {t('login')}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Don't have an account? <Link to="/register" className="text-accent font-bold hover:underline">{t('register')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
