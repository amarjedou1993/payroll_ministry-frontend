// import { router } from "@/routes/router";
// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// export const useRouter = (): Router => {
//   const { i18n } = useTranslation();
//   const [currentRouter, setCurrentRouter] = useState(() =>
//     router(i18n.language)
//   );
//   const [isI18nReady, setIsI18nReady] = useState(i18n.isInitialized);

//   useEffect(() => {
//     if (!i18n.isInitialized) {
//       i18n.on("initialized", () => {
//         setIsI18nReady(true);
//         setCurrentRouter(router(i18n.language));
//       });
//     }

//     const updateRouter = (lng: string) => {
//       setCurrentRouter(router(lng));
//       localStorage.setItem("i18nextLng", lng);
//     };
//     i18n.on("languageChanged", updateRouter);
//     return () => i18n.off("languageChanged", updateRouter);
//   }, [i18n]);

//   return isI18nReady ? currentRouter : router("fr");
// };
