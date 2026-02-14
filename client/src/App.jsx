import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CropProvider } from './context/CropContext';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CropDoctor from './pages/CropDoctor';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Community from './pages/Community';
import LanguageSelection from './pages/LanguageSelection';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';

// Smart redirect based on auth state
const AuthRedirect = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        return <Navigate to="/language" replace />;
    }
    try {
        const user = JSON.parse(storedUser);
        const isOnboarded = localStorage.getItem(`onboarding_${user.uid}`);
        if (isOnboarded) {
            return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to="/onboarding" replace />;
    } catch {
        return <Navigate to="/language" replace />;
    }
};

function App() {
    return (
        <CropProvider>
            <Router>
                <Routes>
                    {/* Entry Flow */}
                    <Route path="/language" element={<LanguageSelection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/onboarding" element={<Onboarding />} />

                    {/* Main App (with Layout) */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="crop-doctor" element={<CropDoctor />} />
                        <Route path="community" element={<Community />} />
                        <Route path="market" element={<Marketplace />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>

                    {/* Catch-all: smart redirect based on auth state */}
                    <Route path="*" element={<AuthRedirect />} />
                </Routes>
            </Router>
        </CropProvider>
    );
}

export default App;

