import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const App = () => {
  const { i18n } = useTranslation();
  const [currentRouter, setCurrentRouter] = useState(router(i18n.language));

  useEffect(() => {
    const updateRouter = (lng: string) => {
      setCurrentRouter(router(lng));
    };
    i18n.on("languageChanged", updateRouter);
    return () => i18n.off("languageChanged", updateRouter);
  }, [i18n]);

  return <RouterProvider router={currentRouter} />;
};

export default App;
