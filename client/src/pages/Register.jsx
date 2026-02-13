import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Create user document in Firestore/users
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email,
                createdAt: new Date(),
                role: 'farmer'
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-secondary/20">
                <h2 className="text-3xl font-bold text-primary mb-6 text-center">{t('register')} for CoFarm</h2>
                {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded border border-red-100">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-secondary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                        />
                    </div>
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
                        {t('register')}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Already have an account? <Link to="/login" className="text-accent font-bold hover:underline">{t('login')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
