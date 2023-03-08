import axios from "axios";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const translations = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          main: {
            language: "Language",
          },
          search: {
            title: "Lounasehdotus",
            description: "Enter city and search restaurants",
            placeholder: "City",
          },
          lunchList: {
            return: "City selection",
            location: "Show location",
          },
        },
      },
      fi: {
        translation: {
          main: {
            language: "Kieli",
          },
          search: {
            title: "Lounasehdotus",
            description: "Syötä kaupunki ja hae ravintolat",
            placeholder: "Kaupunki",
          },
          lunchList: {
            return: "Kaupungin valinta",
            location: "Näytä sijainti",
          },
        },
      },
    },
  });

export const changeLanguage = () => {
  i18n.changeLanguage(i18n.resolvedLanguage === "en" ? "fi" : "en");
};
