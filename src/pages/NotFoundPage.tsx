import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();

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
        {/* Not Found Icon */}
        <div className="mb-6 flex justify-center">
          <AlertCircleIcon
            size={48}
            className="text-gray-500"
            aria-hidden="true"
          />
        </div>

        {/* 404 Status */}
        <h1
          className={`text-5xl font-bold text-gray-700 mb-4 ${
            isRtl ? "font-arabic" : "Inter"
          }`}
        >
          404
        </h1>

        {/* Message */}
        <h2
          className={`text-2xl font-semibold text-gray-800 mb-4 ${
            isRtl ? "font-arabic" : "Inter"
          }`}
        >
          {t("notFound.title")}
        </h2>
        <p
          className={`text-sm text-gray-600 mb-6 ${
            isRtl ? "font-arabic" : "Inter"
          }`}
        >
          {t("notFound.message")}
        </p>

        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-gray-700 text-white hover:bg-gray-800 transition-colors ${
            isRtl ? "font-arabic" : "Inter"
          }`}
          aria-label={t("notFound.back")}
        >
          <ArrowLeftIcon size={16} />
          {t("notFound.back")}
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
