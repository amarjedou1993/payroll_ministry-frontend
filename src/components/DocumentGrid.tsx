import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar1Icon,
  Clock10Icon,
} from "lucide-react";
import MonthYearPicker from "./ui/MonthYearPicker";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export interface BaseDocumentItem {
  id: string;
  status?: string;
  path: string;
  preview?: string;
  period?: string;
  updatedAt?: string;
}

interface DocumentGridProps<T extends BaseDocumentItem> {
  categories: {
    name: string;
    count: number;
    items: T[];
  }[];
  getTitle: (item: T) => string;
  getLastUpdated: (item: T) => string;
  getPeriod?: (item: T) => string;
  onItemClick?: (item: T) => void;
  isLoading?: boolean;
  isError?: boolean;
  emptyState?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  selectedDate?: Date | null;
  onDateFilterChange?: (date: Date | null) => void;
}

const PdfIcon = () => (
  <svg
    width={110}
    height={110}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 58.5"
    className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
  >
    <path
      d="M10.6 0h38.8C55.2 0 60 4.8 60 10.6v37.2c0 5.9-4.8 10.6-10.6 10.6H10.6C4.8 58.5 0 53.7 0 47.9V10.6C0 4.8 4.8 0 10.6 0z"
      fill="#c62828"
    />
    <path
      d="M48.2 33.9C47 32.6 44.7 32 41.4 32c-1.8 0-3.7.2-5.5.5-1.2-1.1-2.2-2.4-3.2-3.7-.7-1-1.4-2-2-3.1 1-2.8 1.6-5.8 1.8-8.8 0-2.7-1.1-5.6-4.1-5.6-1 0-2 .6-2.5 1.5-1.3 2.2-.8 6.7 1.3 11.4-.7 2.1-1.5 4.2-2.4 6.5-.8 2-1.7 3.9-2.8 5.7-3.1 1.2-9.6 4.2-10.2 7.5-.2 1 .1 2 .9 2.6.7.6 1.7 1 2.7.9 3.9 0 7.8-5.4 10.5-10.1 1.5-.5 3-1 4.6-1.4 1.7-.4 3.3-.8 4.8-1.1 4.2 3.6 7.9 4.2 9.7 4.2 2.5 0 3.5-1.1 3.8-2 .4-1.1.2-2.3-.6-3.1z"
      fill="#ffffff"
    />
  </svg>
);

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const DocumentGrid = <T extends BaseDocumentItem>({
  categories,
  getTitle,
  getLastUpdated,
  getPeriod,
  onItemClick,
  isLoading = false,
  isError = false,
  emptyState,
  pagination,
  selectedDate,
  onDateFilterChange,
}: DocumentGridProps<T>) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  // if (process.env.NODE_ENV === "development") {
  //   console.log(
  //     "DocumentGrid: Current language:",
  //     i18n.language,
  //     "Direction:",
  //     isRtl ? "rtl" : "ltr"
  //   );
  //   console.log("Translation for 'payroll':", t("payroll"));
  //   console.log(
  //     "Translation for 'documentGrid.payroll':",
  //     t("documentGrid.payroll")
  //   );
  // }

  const totalItems = categories.reduce(
    (total, category) => total + category.items.length,
    0
  );

  const handleDateFilterChange =
    onDateFilterChange || ((date: Date | null) => {});

  const translateStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return t("documentGrid.status.approved");
      case "pending":
        return t("documentGrid.status.pending");
      case "rejected":
        return t("documentGrid.status.rejected");
      default:
        return status;
    }
  };

  return (
    <div
      className={clsx(
        "p-4 xs:p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200/80 space-y-6 xs:space-y-8 sm:space-y-10",
        isRtl ? "font-arabic" : "Inter"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Date Filter */}
      <div
        className={clsx(
          "flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 bg-white p-3 xs:p-4 rounded-xl shadow-sm border border-gray-200",
          isRtl ? "flex-row-reverse" : "flex-row"
        )}
      >
        <MonthYearPicker
          value={selectedDate}
          onChange={handleDateFilterChange}
          className="w-full xs:w-auto"
          yearRange={[2020, new Date().getFullYear() + 1]}
        />
        {selectedDate && (
          <button
            onClick={() => handleDateFilterChange(null)}
            className="w-full xs:w-auto px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 hover:text-green-800 transition-all duration-300"
            aria-label={t("documentGrid.clearFilter")}
          >
            {t("documentGrid.clearFilter")}
          </button>
        )}
      </div>

      {/* Content Area */}
      {isLoading && !totalItems ? (
        <div className="py-8 xs:py-10 sm:py-12 text-center">
          <Loader2 className="h-8 w-8 xs:h-10 xs:w-10 animate-spin mx-auto text-green-500" />
          <p className="mt-3 xs:mt-4 text-sm xs:text-base font-medium text-gray-700">
            {t("documentGrid.loading")}
          </p>
        </div>
      ) : isError ? (
        <div className="py-8 xs:py-10 sm:py-12 text-center">
          <AlertTriangle className="h-8 w-8 xs:h-10 xs:w-10 mx-auto text-red-500" />
          <p className="mt-3 xs:mt-4 text-sm xs:text-base font-medium text-gray-800">
            {t("documentGrid.error")}
          </p>
        </div>
      ) : !totalItems && !selectedDate ? (
        emptyState ? (
          <div className="py-8 xs:py-10">{emptyState}</div>
        ) : (
          <div className="py-8 xs:py-10 sm:py-12 text-center">
            <FileText className="h-10 w-10 xs:h-12 xs:w-12 mx-auto text-gray-400" />
            <p className="mt-3 xs:mt-4 text-lg xs:text-xl font-semibold text-gray-800">
              {t("documentGrid.noDocuments")}
            </p>
            <p className="mt-1 xs:mt-2 text-xs xs:text-sm text-gray-500">
              {t("documentGrid.noDocumentsSubtitle")}
            </p>
          </div>
        )
      ) : !totalItems && selectedDate ? (
        emptyState ? (
          <div className="py-8 xs:py-10">{emptyState}</div>
        ) : (
          <div className="py-8 xs:py-10 sm:py-12 text-center">
            <FileText className="h-10 w-10 xs:h-12 xs:w-12 mx-auto text-gray-400" />
            <p className="mt-3 xs:mt-4 text-lg xs:text-xl font-semibold text-gray-800">
              {t("documentGrid.noMatchingDocuments")}
            </p>
            <p className="mt-1 xs:mt-2 text-xs xs:text-sm text-gray-500">
              {t("documentGrid.noMatchingDocumentsSubtitle", {
                month: new Date(selectedDate).toLocaleString(i18n.language, {
                  month: "short",
                }),
                year: selectedDate.getFullYear(),
              })}
            </p>
            <button
              onClick={() => handleDateFilterChange(null)}
              className="mt-4 xs:mt-6 px-4 xs:px-5 py-2 text-xs xs:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label={t("documentGrid.clearFilter")}
            >
              {t("documentGrid.clearFilter")}
            </button>
          </div>
        )
      ) : (
        <>
          {/* Document Categories */}
          <AnimatePresence>
            {categories.map(
              (category) =>
                category.items.length > 0 && (
                  <motion.section
                    key={category.name}
                    className="space-y-4 xs:space-y-6"
                    initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 10 : -10 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div
                      className={clsx(
                        "flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2",
                        isRtl ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
                        {category.name}
                      </h3>
                      <span className="px-2 xs:px-3 py-1 text-xs xs:text-sm font-medium text-green-700 bg-green-100 rounded-full shadow-sm">
                        {category.count}{" "}
                        {t("documentGrid.bulletin", {
                          count: category.count,
                        })}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {category.items.map((item) => (
                        <motion.article
                          key={item.id}
                          layout
                          className="group relative rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 cursor-pointer"
                          onClick={() => onItemClick?.(item)}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <div className="w-full h-32 xs:h-36 sm:h-40 md:h-44 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 rounded-t-xl">
                            <PdfIcon />
                          </div>
                          <div className="p-3 xs:p-4 sm:p-5 space-y-2 xs:space-y-3">
                            <h3 className="text-sm xs:text-sm sm:text-base font-semibold text-gray-900 line-clamp-1 tracking-tight">
                              {getTitle(item)}
                            </h3>
                            {getPeriod && item.period && (
                              <p
                                className={clsx(
                                  "text-xs xs:text-sm flex items-center gap-1 text-gray-600"
                                  // isRtl ? "flex-row-reverse" : "flex-row"
                                )}
                              >
                                <Calendar1Icon
                                  size={14}
                                  className="xs:size-3 sm:size-3 md:size-5"
                                />
                                <span className="font-medium">
                                  {t("documentGrid.period")}: {getPeriod(item)}
                                </span>
                              </p>
                            )}
                            <div
                              className={clsx(
                                "flex items-center justify-between text-xs text-gray-500 font-light"
                                // isRtl ? "flex-row-reverse" : "flex-row"
                              )}
                            >
                              <span
                                className={clsx(
                                  "flex items-center gap-1"
                                  // isRtl ? "flex-row-reverse" : "flex-row"
                                )}
                              >
                                <Clock10Icon
                                  size={14}
                                  className="xs:size-3 sm:size-3 md:size-5"
                                />
                                {getLastUpdated(item)}
                              </span>
                              {item.status && (
                                <span
                                  className={clsx(
                                    "px-2 xs:px-3 py-1 rounded-full text-xs xs:text-sm font-medium border",
                                    getStatusStyle(item.status)
                                  )}
                                >
                                  {translateStatus(item.status)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemClick?.(item);
                            }}
                            className={clsx(
                              "absolute top-2 xs:top-3 sm:top-4 p-1 xs:p-1.5 sm:p-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-green-600 hover:border-green-200 shadow-sm transition-all duration-300 group-hover:shadow-md",
                              isRtl
                                ? "left-2 xs:left-3 sm:left-4"
                                : "right-2 xs:right-3 sm:right-4"
                            )}
                            aria-label={t("documentGrid.previewDocument")}
                          >
                            <Eye className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </motion.article>
                      ))}
                    </div>
                  </motion.section>
                )
            )}
          </AnimatePresence>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              className={clsx(
                "mt-6 xs:mt-8 flex items-center justify-center gap-3 xs:gap-4"
                // isRtl ? "flex-row-reverse" : "flex-row"
              )}
            >
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                disabled={pagination.currentPage <= 1 || isLoading}
                className=" xs:p-1.5 sm:p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50 transition-all duration-300"
                aria-label={t("documentGrid.previousPage")}
              >
                <ChevronLeft
                  className={clsx(
                    "h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6",
                    isRtl ? "rotate-180" : ""
                  )}
                />
              </button>
              <div
                className={clsx(
                  "flex gap-1 xs:gap-2"
                  // isRtl ? "flex-row-reverse" : "flex-row"
                )}
              >
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => pagination.onPageChange(page)}
                    disabled={isLoading}
                    className={clsx(
                      "px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 text-xs xs:text-sm font-medium rounded-full transition-all duration-300",
                      page === pagination.currentPage
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-green-100 hover:text-green-700"
                    )}
                    aria-current={
                      page === pagination.currentPage ? "page" : undefined
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
                disabled={
                  pagination.currentPage >= pagination.totalPages || isLoading
                }
                className="p-1 xs:p-1.5 sm:p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50 transition-all duration-300"
                aria-label={t("documentGrid.nextPage")}
              >
                <ChevronRight
                  className={clsx(
                    "h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6",
                    isRtl ? "rotate-180" : ""
                  )}
                />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentGrid;
