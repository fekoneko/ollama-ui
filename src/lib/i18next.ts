import { EN_TRANSLATION, JA_TRANSLATION, RU_TRANSLATION } from "@/lib/translation";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export const i18n = i18next.createInstance();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: EN_TRANSLATION },
    ru: { translation: RU_TRANSLATION },
    ja: { translation: JA_TRANSLATION },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});
