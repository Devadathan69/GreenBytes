import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCrop } from '../context/CropContext';
import { useTranslation } from 'react-i18next';

const Layout = () => {
    const location = useLocation();
    const { selectedCrop } = useCrop();
    const { t } = useTranslation();

    const navItems = [
        { path: '/dashboard', label: t('dashboard'), icon: '🏠' },
        { path: '/community', label: t('community'), icon: '👥' },
        { path: '/crop-doctor', label: t('crop_doctor'), icon: '🩺', isFab: true },
        { path: '/market', label: t('market'), icon: '🛒' },
        { path: '/profile', label: t('profile'), icon: '👤' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-text">

            {/* Top Bar */}
            <header className="bg-white text-gray-800 px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">🌱</span>
                    </div>
                    <h1 className="text-lg font-bold text-primary tracking-tight">{t('app_name')}</h1>
                </div>
                {selectedCrop && (
                    <div className="flex items-center bg-primary-light px-3 py-1.5 rounded-full">
                        <span className="text-sm mr-1">{selectedCrop.icon}</span>
                        <span className="text-xs font-bold text-primary">{selectedCrop.name}</span>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 pb-24 overflow-y-auto">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] z-50 flex justify-around items-end h-16 border-t border-gray-100 pb-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    if (item.isFab) {
                        return (
                            <div key={item.path} className="relative -top-5">
                                <Link
                                    to={item.path}
                                    className={`w-[60px] h-[60px] rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white transition-all active:scale-95 ${isActive
                                        ? 'bg-primary-dark scale-105'
                                        : 'bg-primary hover:opacity-90'
                                        }`}
                                >
                                    <span className="text-xl mb-0.5">{item.icon}</span>
                                    <span className="text-[8px] font-bold text-white leading-none">
                                        {item.label.split(' ')[0]}
                                    </span>
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-14 space-y-0.5 pt-2 ${isActive ? 'text-primary' : 'text-gray-400'
                                }`}
                        >
                            <span className={`text-xl transition ${isActive ? '-translate-y-0.5' : ''}`}>{item.icon}</span>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Layout;
