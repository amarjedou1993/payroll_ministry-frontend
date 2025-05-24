import { XCircleIcon } from "lucide-react";
import { useState, useRef } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { printPlugin, PrintPlugin } from "@react-pdf-viewer/print";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";
import Button from "./ui/Button";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.js";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

interface PdfViewerProps {
  file: string;
  onClose: () => void;
  title?: string; // Added title prop
}

const PdfViewer = ({ file, onClose, title }: PdfViewerProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [pageNumber, setPageNumber] = useState(1);
  const printPluginInstance = printPlugin();
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => defaultTabs,
  });
  const printPluginRef = useRef<PrintPlugin>(printPluginInstance);

  const handleDownload = async () => {
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(t("pdfViewer.downloadError"));
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const filename = file.split("/").pop() || "document.pdf";
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handlePrint = () => {
    try {
      if (printPluginRef.current) {
        printPluginRef.current.print();
      } else {
        console.error("Print plugin not initialized");
      }
    } catch (error) {
      console.error("Print error:", error);
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm p-4 sm:p-6",
        isRtl ? "font-arabic" : "Inter"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-white px-6 py-6 sm:p-8 md:p-12 rounded-md w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl h-[90vh] sm:h-[85vh] max-h-[90vh] overflow-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={clsx(
            "absolute top-1.5 text-gray-600 hover:text-gray-800 text-xl sm:text-2xl",
            isRtl ? "left-1.5" : "right-1.5"
          )}
          aria-label={t("pdfViewer.closeModal")}
        >
          <XCircleIcon size={20} />
        </button>

        {/* Title */}
        {title && (
          <h2
            className={clsx(
              "text-lg sm:text-xl font-medium mb-4",
              isRtl ? "text-right" : "text-left"
            )}
          >
            {title}
          </h2>
        )}

        {/* Action Buttons */}
        <div
          className={clsx(
            "mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start"
            // isRtl ? "justify-start" : "justify-end"
          )}
        >
          <Button
            variant="secondary"
            onClick={handleDownload}
            className="px-4 py-2 font-light w-full sm:w-auto"
            aria-label={t("pdfViewer.downloadButton")}
          >
            {t("pdfViewer.download")}
          </Button>
          <Button
            onClick={handlePrint}
            className="px-4 py-2 w-full sm:w-auto"
            aria-label={t("pdfViewer.printButton")}
          >
            {t("pdfViewer.print")}
          </Button>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 w-full h-full overflow-hidden">
          <Worker workerUrl={workerUrl}>
            <Viewer
              fileUrl={file}
              plugins={[defaultLayoutPluginInstance, printPluginInstance]}
              defaultScale={0.9}
              onPageChange={(e) => setPageNumber(e.currentPage + 1)}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
