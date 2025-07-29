// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Define your translations here
const resources = {
  en: {
    translation: {
      welcome: "Welcome to Bol Saathi",
      login: "Login",
      signup: "Sign Up",
      schemes: "Schemes",
      faq: "FAQ",
      ai_greet: "Hello! I’m your assistant.",
    },
  },
  hi: {
    translation: {
      welcome: "बोल साथी में आपका स्वागत है",
      login: "लॉगिन",
      signup: "साइन अप",
      schemes: "योजनाएँ",
      faq: "सामान्य प्रश्न",
      ai_greet: "नमस्ते! मैं आपकी सहायक हूँ।",
    },
  },
  mr: {
    translation: {
      welcome: "बोल साथीमध्ये आपले स्वागत आहे",
      login: "लॉगिन",
      signup: "साइन अप",
      schemes: "योजना",
      faq: "नेहमी विचारले जाणारे प्रश्न",
      ai_greet: "नमस्कार! मी तुमची सहाय्यक आहे.",
    },
  },
  gu: {
    translation: {
      welcome: "બોલ સાથીમાં આપનું સ્વાગત છે",
      login: "લોગિન",
      signup: "સાઇન અપ",
      schemes: "યોજનાઓ",
      faq: "વારંવાર પૂછાતા પ્રશ્નો",
      ai_greet: "નમસ્તે! હું તમારી સહાયક છું.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
