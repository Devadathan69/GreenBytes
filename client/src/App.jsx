import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import SoilMonitoring from './pages/SoilMonitoring';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Calculators from './pages/Calculators';
import Cultivation from './pages/Cultivation';
import Community from './pages/Community';
import Marketplace from './pages/Marketplace';
import News from './pages/News';
import './i18n';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="disease-detection" element={<DiseaseDetection />} />
                        <Route path="soil-monitoring" element={<SoilMonitoring />} />
                        <Route path="calculators" element={<Calculators />} />
                        <Route path="cultivation" element={<Cultivation />} />
                        <Route path="community" element={<Community />} />
                        <Route path="market" element={<Marketplace />} />
                        <Route path="news" element={<News />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
