import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return {
    t,
    i18n,
    currentLanguage: i18n.language as "en" | "vi",
    changeLanguage,
  };
};
