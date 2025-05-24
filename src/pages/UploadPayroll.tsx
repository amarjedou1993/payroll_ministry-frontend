import DataTable, { ColumnDef } from "@/components/ui/datatable/DataTable2";
import FileUploader from "@/components/ui/FileUploader";
import { getAllPayrolls } from "@/services/auth.service";
import { IPayrollReponse, PaginatedPayrollsResponse } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import PdfViewer from "@/components/PdfViewer";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { FocusTrap } from "@headlessui/react";

const apiUrl =
  import.meta.env.VITE_BASE_URL || "http://localhost:_admin_port_/api";

const UploadPayroll = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [isUploading, setIsUploading] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [pdfToView, setPdfToView] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [searchTerm, setSearchTerm] = useState<string | undefined>("");
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<{
    month?: number;
    year?: number;
    userId?: string;
  }>({});
  const [uploadSuccessCount, setUploadSuccessCount] = useState(0);

  const payrollColumns: ColumnDef<IPayrollReponse>[] = [
    {
      key: "filename",
      header: (t) => t("userDetails.filename"),
      accessor: "filename",
      icon: (
        <div className="p-1 border rounded-md">
          <svg
            width={16}
            height={16}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 58.5"
          >
            <path
              d="M10.6 0h38.8C55.2 0 60 4.8 60 10.6v37.2c0 5.9-4.8 10.6-10.6 10.6H10.6C4.8 58.5 0 53.7 0 47.9V10.6C0 4.8 4.8 0 10.6 0z"
              fill="#b30b00"
            />
            <path
              d="M48.2 33.9C47 32.6 44.7 32 41.4 32c-1.8 0-3.7.2-5.5.5-1.2-1.1-2.2-2.4-3.2-3.7-.7-1-1.4-2-2-3.1 1-2.8 1.6-5.8 1.8-8.8 0-2.7-1.1-5.6-4.1-5.6-1 0-2 .6-2.5 1.5-1.3 2.2-.8 6.7 1.3 11.4-.7 2.1-1.5 4.2-2.4 6.5-.8 2-1.7 3.9-2.8 5.7-3.1 1.2-9.6 4.2-10.2 7.5-.2 1 .1 2 .9 2.6.7.6 1.7 1 2.7.9 3.9 0 7.8-5.4 10.5-10.1 1.5-.5 3-1 4.6-1.4 1.7-.4 3.3-.8 4.8-1.1 4.2 3.6 7.9 4.2 9.7 4.2 2.5 0 3.5-1.1 3.8-2 .4-1.1.2-2.3-.6-3.1zm-2.7 1.9c-.1.7-.9 1.2-1.9 1.2-.3 0-.6 0-.9-.1-2-.5-3.9-1.5-5.5-2.8 1.3-.2 2.7-.3 4-.3.9 0 1.8.1 2.7.2.9.2 1.9.6 1.6 1.8zM27.6 13.7c.2-.3.5-.5.9-.6 1 0 1.2 1.1 1.2 2.1-.1 2.3-.5 4.5-1.2 6.7-1.7-4.3-1.5-7.2-.9-8.2zm5.6 19.2c-1.1.2-2.2.5-3.3.8-.8.2-1.6.5-2.5.7.4-.9.8-1.8 1.2-2.6.5-1.1.9-2.2 1.3-3.3.4.6.7 1.1 1.1 1.6.7 1 1.5 1.9 2.2 2.8zm-12.1 5.8c-2.5 4-5 6.6-6.4 6.6-.2 0-.5-.1-.6-.2-.3-.2-.4-.6-.3-.9.2-1.5 3.1-3.6 7.3-5.5z"
              fill="#fff"
            />
          </svg>
        </div>
      ),
    },
    {
      key: "period",
      header: (t) => t("userDetails.period"),
      accessor: "period",
      sortable: true,
    },
    {
      key: "createdAt",
      header: (t) => t("userDetails.uploadedAt"),
      render: (data) =>
        new Date(data.createdAt).toLocaleDateString(i18n.language, {
          dateStyle: "medium",
        }),
    },
    {
      key: "user",
      header: (t) => t("userDetails.employee"),
      render: (payroll: IPayrollReponse) => (
        <div
          className={clsx(
            "font-medium"
            // i18n.language === "ar" ? "text-start" : "text-start"
          )}
          aria-label={`${t("userDetails.employee")}: ${
            payroll.user?.name || t("userDetails.noData")
          }`}
        >
          <p className="mt-0.5">
            {payroll.user?.name || t("userDetails.noData")}
          </p>
          <span className="font-light text-xs text-gray-500">
            {payroll.user?.employeeId || t("userDetails.noData")}
          </span>
        </div>
      ),
    },
  ];

  const {
    data: payrollsResponse,
    isLoading,
    error,
  } = useQuery<PaginatedPayrollsResponse>({
    queryKey: [
      "payrolls",
      page,
      limit,
      filters,
      searchTerm,
      uploadSuccessCount,
    ],
    queryFn: () =>
      getAllPayrolls(
        page,
        limit,
        filters.userId,
        filters.month,
        filters.year,
        searchTerm
      ),
    retry: false,
  });

  const payrolls = payrollsResponse?.data || [];
  const totalItems = payrollsResponse?.meta.totalItems || 0;
  const totalPages = payrollsResponse?.meta.totalPages || 0;

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleDateFilterChange = (date: Date | null) => {
    setDateFilter(date);
    setPage(1);
    if (date) {
      setFilters({ month: date.getMonth(), year: date.getFullYear() });
    } else {
      setFilters({});
    }
  };

  const handleUploadStart = () => setIsUploading(true);

  const handleUploadSuccess = (response: {
    success: boolean;
    processed: number;
    results: any[];
    errors: any[];
  }) => {
    setIsUploading(false);
    if (response.success && response.processed > 0) {
      toast.success(t("fileUploader.successMessage"));
      setUploadSuccessCount((prev) => prev + 1);
    } else if (response.errors.length > 0) {
      toast.error(t("fileUploader.errorMessage"));
    }
  };

  const handleSearchChange = (value: string | undefined) => {
    const normalizedValue = value ?? "";
    setSearchValue(normalizedValue);
    setSearchTerm(normalizedValue || undefined);
    setPage(1);
  };

  const handleViewPdf = (payroll: IPayrollReponse) => {
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const pdfUrl = `${backendBaseUrl}/${payroll.path}`;
    setPdfToView(pdfUrl);
  };

  if (error) {
    return (
      <div
        className={clsx(
          "w-full p-4 text-center text-red-600",
          isRtl ? "font-arabic" : "Inter"
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {t("userDetails.error")}
      </div>
    );
  }

  return (
    <div
      className={clsx(isRtl ? "font-arabic" : "Inter")}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <FileUploader
        url={`${apiUrl}/payroll/upload`}
        allowedTypes={["application/pdf"]}
        onUploadStart={handleUploadStart}
        onSuccess={handleUploadSuccess}
      />

      <DataTable<IPayrollReponse>
        data={payrolls}
        columns={payrollColumns}
        getId={(payroll) => payroll.id}
        searchPlaceholder={t("uploadPayroll.searchPlaceholder")}
        itemsPerPageOptions={[4, 6]}
        pagination={{
          currentPage: page,
          itemsPerPage: limit,
          totalPages,
          totalItems,
          onPageChange: handlePageChange,
          onItemsPerPageChange: handleLimitChange,
        }}
        availableFilters={["date"]}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateFilterChange}
        enableSearch={true}
        onSearch={handleSearchChange}
        searchValue={searchValue}
        onView={handleViewPdf}
        loading={isLoading || isUploading}
        emptyState={
          !isLoading && (
            <div
              className={clsx(
                "p-5 flex items-center justify-center text-gray-500"
                // isRtl ? "flex-row-reverse" : "flex-row"
              )}
            >
              <AlertTriangleIcon
                size={18}
                className={clsx(isRtl ? "me-2" : "ms-2")}
              />
              {t("userDetails.noDocuments")}
            </div>
          )
        }
      />
      {pdfToView && (
        <FocusTrap>
          <PdfViewer
            file={pdfToView}
            onClose={() => setPdfToView(null)}
            title={t("userDetails.pdfViewerTitle")}
          />
        </FocusTrap>
      )}
    </div>
  );
};

export default UploadPayroll;
