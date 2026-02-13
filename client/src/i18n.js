import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Interactive translation resources
const resources = {
    en: {
        translation: {
            "welcome": "Welcome to CoFarm",
            "login": "Login",
            "register": "Register",
            "dashboard": "Dashboard",
            // Add more as needed
        }
    },
    hi: {
        translation: {
            "welcome": "CoFarm में आपका स्वागत है",
            "login": "लॉग इन करें",
            "register": "पंजीकरण करें",
            "dashboard": "डैशबोर्ड",
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
