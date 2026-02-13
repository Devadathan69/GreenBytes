import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Layout = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
    };

    const navItems = [
        { path: '/dashboard', label: t('dashboard'), icon: '📊' },
        { path: '/disease-detection', label: 'Disease Detection', icon: '🍃' }, // TODO: Add translation keys
        { path: '/soil-monitoring', label: 'Soil Monitoring', icon: '💧' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans text-text">
            {/* Mobile Header */}
            <header className="md:hidden bg-primary text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-xl font-bold">CoFarm</h1>
                <button onClick={toggleLanguage} className="bg-white text-primary px-3 py-1 rounded-full text-sm font-bold">
                    {i18n.language.toUpperCase()}
                </button>
            </header>

            {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
            <nav className="bg-white shadow-lg md:w-64 md:flex-shrink-0 md:h-screen sticky top-0 z-50 flex flex-row md:flex-col justify-around md:justify-start items-center md:items-stretch p-2 md:p-4 fixed bottom-0 w-full md:relative">
                <div className="hidden md:flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-primary">CoFarm</h1>
                    <button onClick={toggleLanguage} className="bg-primary text-white px-2 py-1 rounded text-xs">
                        {i18n.language.toUpperCase()}
                    </button>
                </div>

                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col md:flex-row items-center md:space-x-4 p-2 md:p-3 rounded-lg transition-colors duration-200 ${location.pathname === item.path
                                ? 'bg-secondary/20 text-primary font-semibold'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <span className="text-2xl md:text-xl">{item.icon}</span>
                        <span className="text-xs md:text-base">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
