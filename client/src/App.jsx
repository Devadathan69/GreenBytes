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
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
