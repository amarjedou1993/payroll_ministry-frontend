import { StrictMode } from "react";
import { createRoot, Root as ReactRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import { RouterProvider } from "react-router-dom";
import clsx from "clsx";
import { router } from "./routes/router";

// React Query setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// App wrapper
export const Root = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={clsx("min-h-screen", isRtl ? "font-arabic" : "Inter")}
    >
      <RouterProvider router={router(i18n.language)} />
      <ToastContainer
        position={isRtl ? "bottom-left" : "bottom-right"}
        toastClassName="toast"
        progressClassName="toast-progress"
        autoClose={4000}
        draggable
        aria-label={isRtl ? "الإشعارات" : "Notifications"}
      />
    </div>
  );
};

// Setup root only once
const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");

let root: ReactRoot;

if (!("_reactRoot" in container)) {
  root = createRoot(container);
  // @ts-expect-error — this is safe internal assignment
  container._reactRoot = root;
} else {
  // @ts-expect-error — we saved it earlier
  root = container._reactRoot;
}

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Root />
        </I18nextProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
