import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./locales/en/english.json";
import zh from "./locales/zh/chinese.json";

i18n.use(initReactI18next).init({
  resources: {
    en:{translation : english},
    zh: { translation: zh },
  },
  lng: localStorage.getItem("language") || "en", // get language from localStorage or default to en
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already escapes
  },
});

// Function to change language
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem("language", lng);
};

export default i18n;
