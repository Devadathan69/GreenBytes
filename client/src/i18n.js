import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Interactive translation resources
const resources = {
    en: {
        translation: {
            "app_name": "CoFarm",
            "welcome": "Welcome to CoFarm",
            "login": "Login",
            "register": "Register",
            "dashboard": "Home",
            "disease_detection": "Crop Doctor",
            "soil_monitoring": "Soil Health",
            "profile": "My Farm",
            "community": "Community",
            "market": "Mandi (Market)",
            "news": "Agri News",
            "calculators": "Calculators",
            "select_language": "Select Language",
            "daily_advice": "Today's Advice",
            "weather": "Weather",
            "upload_image": "Upload Photo",
            "analyze": "Check Disease",
            "submit": "Submit",
            "cancel": "Cancel",
            "ask_question": "Ask Question",
            "contact_seller": "Contact Seller",
            "read_more": "Read More",
            "fertilizer": "Fertilizer",
            "pesticide": "Pesticide",
            "seeds": "Seeds",
            "tools": "Tools",
            "cultivation_tips": "Cultivation Tips"
        }
    },
    hi: { // Hindi
        translation: {
            "app_name": "को-फार्म",
            "welcome": "को-फार्म में आपका स्वागत है",
            "login": "लॉग इन करें",
            "register": "रजिस्टर करें",
            "dashboard": "होम",
            "disease_detection": "फसल डॉक्टर",
            "soil_monitoring": "मिट्टी की जांच",
            "profile": "मेरा खेत",
            "community": "समुदाय",
            "market": "मंडी",
            "news": "कृषि समाचार",
            "calculators": "कैलकुलेटर",
            "select_language": "भाषा चुनें",
            "daily_advice": "आज की सलाह",
            "weather": "मौसम",
            "upload_image": "फोटो अपलोड करें",
            "analyze": "जांच करें",
            "submit": "जमा करें",
            "cancel": "रद्द करें",
            "ask_question": "प्रश्न पूछें",
            "contact_seller": "विक्रेता से संपर्क करें",
            "read_more": "और पढ़ें",
            "fertilizer": "खाद (Fertilizer)",
            "pesticide": "कीटनाशक (Pesticide)",
            "seeds": "बीज",
            "tools": "औजार",
            "cultivation_tips": "खेती के सुझाव"
        }
    },
    ml: { // Malayalam
        translation: {
            "app_name": "CoFarm",
            "welcome": "CoFarm-ലേക്ക് സ്വാഗതം",
            "login": "ലോഗിൻ",
            "register": "രജിസ്റ്റർ",
            "dashboard": "ഹോം",
            "disease_detection": "വിള ഡോക്ടർ",
            "soil_monitoring": "മണ്ണ് പരിശോധന",
            "profile": "എന്റെ കൃഷിയിടം",
            "community": "കൂട്ടായ്മ",
            "market": "വിപണി",
            "news": "കർഷക വാർത്തകൾ",
            "calculators": "കണക്കുകൂട്ടലുകൾ",
            "select_language": "ഭാഷ തിരഞ്ഞെടുക്കുക",
            "daily_advice": "ഇന്നത്തെ നിർദ്ദേശം",
            "weather": "കാലാവസ്ഥ",
            "upload_image": "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
            "analyze": "പരിശോധിക്കുക",
            "submit": "സമർപ്പിക്കുക",
            "cancel": "റദ്ദാക്കുക",
            "ask_question": "ചോദ്യം ചോദിക്കുക",
            "contact_seller": "വിൽപ്പനക്കാരനെ ബന്ധപ്പെടുക",
            "read_more": "കൂടുതൽ വായിക്കുക",
            "fertilizer": "വളം",
            "pesticide": "കീടനാശിനി",
            "seeds": "വിത്തുകൾ",
            "tools": "ഉപകരണങ്ങൾ",
            "cultivation_tips": "കൃഷി അറിവുകൾ"
        }
    },
    ta: { // Tamil
        translation: {
            "app_name": "CoFarm",
            "welcome": "CoFarm-க்கு வரவேற்கிறோம்",
            "login": "உள்நுழைய",
            "register": "பதிவு செய்ய",
            "dashboard": "முகப்பு",
            "disease_detection": "பயிர் மருத்துவர்",
            "soil_monitoring": "மண் வளம்",
            "profile": "என் பண்ணை",
            "community": "சமூகம்",
            "market": "சந்தை",
            "news": "வேளாண் செய்திகள்",
            "calculators": "கணக்கீடுகள்",
            "select_language": "மொழியைத் தேர்ந்தெடுக்கவும்",
            "daily_advice": "இன்றைய ஆலோசனை",
            "weather": "வானிலை",
            "upload_image": "புகைப்படத்தை பதிவேற்றவும்",
            "analyze": "ஆாயவும்",
            "submit": "சமர்ப்பிக்க",
            "cancel": "ரத்துசெய்",
            "ask_question": "கேள்வி கேளுங்கள்",
            "contact_seller": "விற்பனையாளரைத் தொடர்பு கொள்ளுங்கள்",
            "read_more": "மேலும் படிக்க",
            "fertilizer": "உரம்",
            "pesticide": "பூச்சிக்கொல்லி",
            "seeds": "விதைகள்",
            "tools": "கருவிகள்",
            "cultivation_tips": "சாகுபடி குறிப்புகள்"
        }
    },
    te: { // Telugu
        translation: {
            "app_name": "CoFarm",
            "welcome": "CoFarm కు స్వాగతం",
            "login": "లాగిన్",
            "register": "రిజిస్టర్",
            "dashboard": "హోమ్",
            "disease_detection": "పంట డాక్టర్",
            "soil_monitoring": "మట్టి ఆరోగ్యం",
            "profile": "నా పొలం",
            "community": "సంఘం",
            "market": "మార్కెట్",
            "news": "వ్యవసాయ వార్తలు",
            "calculators": "కాలిక్యులేటర్లు",
            "select_language": "భాషను ఎంచుకోండి",
            "daily_advice": "నేటి సలహా",
            "weather": "వాతావరణం",
            "upload_image": "ఫోటో అప్‌లోడ్ చేయండి",
            "analyze": "పరీక్షించండి",
            "submit": "సమర్పించండి",
            "cancel": "రద్దు చేయండి",
            "ask_question": "ప్రశ్న అడగండి",
            "contact_seller": "విక్రేతను సంప్రదించండి",
            "read_more": "మరింత చదవండి",
            "fertilizer": "ఎరువులు",
            "pesticide": "పురుగుమందులు",
            "seeds": "విత్తనాలు",
            "tools": "సాధనాలు",
            "cultivation_tips": "సాగు చిట్కాలు"
        }
    },
    kn: { // Kannada
        translation: {
            "app_name": "CoFarm",
            "welcome": "CoFarm ಗೆ ಸ್ವಾಗತ",
            "login": "ಲಾಗಿನ್",
            "register": "ನೋಂದಣಿ",
            "dashboard": "ಮುಖಪುಟ",
            "disease_detection": "ಬೆಳೆ ವೈದ್ಯ",
            "soil_monitoring": "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
            "profile": "ನನ್ನ ತೋಟ",
            "community": "ಸಮುದಾಯ",
            "market": "ಮಾರುಕಟ್ಟೆ",
            "news": "ಕೃಷಿ ಸುದ್ದಿ",
            "calculators": "ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು",
            "select_language": "ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
            "daily_advice": "ಇಂದಿನ ಸಲಹೆ",
            "weather": "ಹವಾಮಾನ",
            "upload_image": "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
            "analyze": "ಪರಿಶೀಲಿಸಿ",
            "submit": "ಸಲ್ಲಿಸಿ",
            "cancel": "ರದ್ದುಮಾಡಿ",
            "ask_question": "ಪ್ರಶ್ನೆ ಕೇಳಿ",
            "contact_seller": "ವ್ಯಾಪಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ",
            "read_more": "ಮತ್ತಷ್ಟು ಓದಿ",
            "fertilizer": "ಗೊಬ್ಬರ",
            "pesticide": "ಕೀಟನಾಶಕ",
            "seeds": "ಬೀಜಗಳು",
            "tools": "ಉಪಕರಣಗಳು",
            "cultivation_tips": "ಕೃಷಿ ಸಲಹೆಗಳು"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
