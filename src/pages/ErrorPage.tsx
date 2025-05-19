import { useNavigate, useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion"; // For subtle animations

function ErrorPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();
  const error = useRouteError();

  // Default values
  let status = (error as any)?.status || 500;
  let message = t("error.default");
  let details = null;

  // Handle Axios-specific errors
  if ((error as any)?.name === "AxiosError") {
    status = (error as any).response?.status || (error as any).status || 500;
    message =
      (error as any).response?.data?.message ||
      (error as any).message ||
      t("error.requestFailed");
    details = (error as any).response?.data?.details || null;
  } else {
    // Handle generic route errors
    switch (status) {
      case 400:
        message = t("error.badRequest");
        break;
      case 401:
        message = t("error.unauthorized");
        break;
      case 403:
        message = t("error.forbidden");
        break;
      case 404:
        message = t("error.notFound");
        break;
      case 500:
        message = t("error.serverError");
        break;
      default:
        message = t("error.unexpected");
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <motion.div
        className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="alert"
        aria-live="assertive"
      >
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <AlertCircleIcon
            size={48}
            className="text-red-500"
            aria-hidden="true"
          />
        </div>

        {/* Status Code */}
        <h1
          className={`text-5xl font-bold text-red-600 mb-4 ${
            isRtl ? "font-['YourArabicFont']" : "font-inter"
          }`}
        >
          {status}
        </h1>

        {/* Error Message */}
        <h2
          className={`text-2xl font-semibold text-gray-800 mb-4 ${
            isRtl ? "font-['YourArabicFont']" : "font-inter"
          }`}
        >
          {message}
        </h2>

        {/* Error Details (if available) */}
        {details && (
          <p
            className={`text-sm text-gray-600 mb-6 flex items-center justify-center gap-2 ${
              isRtl ? "font-['YourArabicFont']" : "font-inter"
            }`}
          >
            <AlertCircleIcon size={16} className="text-red-500" />
            <span>{details}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row justify-center gap-4 ${
            isRtl ? "sm:flex-row-reverse" : ""
          }`}
        >
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-gray-700 text-white hover:bg-gray-800 transition-colors"
            aria-label={t("error.back")}
          >
            <ArrowLeftIcon size={16} />
            {t("error.back")}
          </Button>
          {status === 401 && (
            <Button
              onClick={() => navigate("/auth")}
              className="flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-green-700 text-white hover:bg-green-800 transition-colors"
              aria-label={t("error.login")}
            >
              {t("error.login")}
            </Button>
          )}
          {status === 403 && (
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              aria-label={t("error.dashboard")}
            >
              {t("error.dashboard")}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ErrorPage;
