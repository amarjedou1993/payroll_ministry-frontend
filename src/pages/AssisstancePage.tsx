import { useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "@/components/ui/Card";
import { MailIcon, PhoneIcon } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const AssistancePage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (mock API call)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setFormStatus("error");
    }
  };

  return (
    <div
      className="mt-3 p-4 max-w-2xl mx-auto"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
      aria-label={t("sidebar.support")}
    >
      <h1
        className={`text-2xl font-semibold text-gray-800 mb-6 ${
          isRtl ? "font-arabic" : "font-inter"
        }`}
      >
        {t("contactUs.title")}
      </h1>

      <Card className="shadow-md">
        <Card.Content className="p-6">
          {/* Contact Form */}
          <h2
            className={`text-lg font-semibold text-gray-700 mb-4 ${
              isRtl ? "font-arabic" : "font-inter"
            }`}
          >
            {t("contactUs.sendMessage")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label={t("contactUs.name")}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  sm:text-sm"
                placeholder={t("contactUs.namePlaceholder")}
              />
            </div>
            <div>
              <Input
                type="email"
                id="email"
                name="email"
                label={t("contactUs.email")}
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm  sm:text-sm"
                placeholder={t("contactUs.emailPlaceholder")}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className={`block text-sm font-medium text-gray-700 ${
                  isRtl ? "font-arabic" : "font-inter"
                }`}
              >
                {t("contactUs.message")}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 sm:text-sm"
                placeholder={t("contactUs.messagePlaceholder")}
              />
            </div>
            <Button
              type="submit"
              disabled={formStatus === "submitting"}
              className={`w-full px-4 py-3  text-white rounded-md shadow-sm  ${
                formStatus === "submitting"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {formStatus === "submitting"
                ? t("contactUs.submitting")
                : t("contactUs.submit")}
            </Button>
            {formStatus === "success" && (
              <p className="text-green-600 text-sm">
                {t("contactUs.successMessage")}
              </p>
            )}
            {formStatus === "error" && (
              <p className="text-red-600 text-sm">
                {t("contactUs.errorMessage")}
              </p>
            )}
          </form>

          {/* Contact Details */}
          <div className="mt-6">
            <h2
              className={`text-lg font-semibold text-gray-700 mb-4 ${
                isRtl ? "font-arabic" : "font-inter"
              }`}
            >
              {t("contactUs.contactDetails")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <MailIcon className="w-5 h-5 text-gray-500 mr-2" />
                <p
                  className={`text-sm text-gray-600 ${
                    isRtl ? "font-arabic" : "font-inter"
                  }`}
                >
                  {t("contactUs.email")}:{" "}
                  <a href="mailto:support@culture.gov">bjb@support.tech</a>
                </p>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-5 h-5 text-gray-500 mr-2" />
                <p
                  className={`text-sm text-gray-600 ${
                    isRtl ? "font-arabic" : "font-inter"
                  }`}
                >
                  {t("contactUs.phone")}:{" "}
                  <a href="tel:+22220969596">+222-20969596</a>
                </p>
              </div>
              {/* <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-gray-500 mr-2" />
                <p
                  className={`text-sm text-gray-600 ${
                    isRtl ? "font-arabic" : "font-inter"
                  }`}
                >
                  {t("contactUs.address")}: {t("contactUs.addressValue")}
                </p>
              </div> */}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AssistancePage;
