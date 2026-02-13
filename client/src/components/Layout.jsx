import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Layout = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();

    const toggleLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const navItems = [
        { path: '/dashboard', label: t('dashboard'), icon: '🏠' },
        { path: '/disease-detection', label: t('disease_detection'), icon: '🌿' },
        { path: '/soil-monitoring', label: t('soil_monitoring'), icon: '💧' },
        { path: '/calculators', label: t('calculators'), icon: '🧮' },
        { path: '/community', label: t('community'), icon: '👥' },
        { path: '/market', label: t('market'), icon: '🛒' },
        { path: '/news', label: t('news'), icon: '📰' },
        { path: '/profile', label: t('profile'), icon: '👤' },
    ];

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans text-text">

            {/* Top Bar (Mobile & Desktop) */}
            <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">🚜</span>
                    <h1 className="text-xl font-bold tracking-wide">{t('app_name')}</h1>
                </div>
                <select
                    onChange={toggleLanguage}
                    value={i18n.language}
                    className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 text-sm focus:outline-none focus:bg-primary"
                >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="ml">മലയാളം</option>
                    <option value="ta">தமிழ்</option>
                    <option value="te">తెలుగు</option>
                    <option value="kn">ಕನ್ನಡ</option>
                </select>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (Desktop Only) */}
                <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg z-40 overflow-y-auto">
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${location.pathname === item.path
                                        ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-24 md:pb-6 bg-background">
                    <Outlet />
                </main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 flex justify-around items-center h-16 border-t border-gray-200 overflow-x-auto">
                {navItems.slice(0, 5).map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === item.path
                                ? 'text-primary'
                                : 'text-gray-500'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-[10px] font-medium truncate w-16 text-center">{item.label}</span>
                    </Link>
                ))}
                <Link to="/more" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500">
                    <span className="text-xl">☰</span>
                    <span className="text-[10px] font-medium">More</span>
                </Link>
            </nav>
            {/* Note: "More" menu would handle the items that don't fit, but for now 5 items is okay. 
          Actually, let's just show top 5 important ones and maybe Profile at the end. 
          The user wanted simple, so maybe 4-5 items is max. 
          Let's prioritize: Dashboard, Disease, Soil, Profile. 
          The list above has 8 items. I will slice it in the code above or implement a 'More' menu later if needed.
          For now, I'll display the first 4 and Profile.
      */}
        </div>
    );
};

export default Layout;
