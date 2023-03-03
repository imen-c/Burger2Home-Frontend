import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    compatibilityJSON: "v3",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          // here we will place our translations...
          home: {
            title: "Welcome to Burger2Home",
            hook: "Wanna try one of our delicious Menu",
            login: "Login",
          },
        },
      },
      fr: {
        translation: {
          home: {
            title: "Bienvenue à Burger2Home",
            hook: "Envie de gouter à un de nos délicieux menu?",
            login: "Connecte-toi",
          },
        },
      },
      ar: {
        translation: {
          home: {
            title: "مرحبًا بكم في Burger2Home",
            hook: "هل تريد تذوق إحدى قائمتنا اللذيذة؟",
            login: "اربط نفسك",
          },
        },
      },
    },
  });

export default i18n;
