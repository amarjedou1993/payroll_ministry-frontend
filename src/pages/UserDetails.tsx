import { useLoaderData, useParams } from "react-router-dom";
import {
  AlertTriangleIcon,
  ArrowUpRight,
  BookKeyIcon,
  IdCardIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { getAllPayrolls, getPayrollsById } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { IPayrollReponse, PaginatedPayrollsResponse } from "@/types/types";
import DataTable, { ColumnDef } from "@/components/ui/datatable/DataTable2";
import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { fr, ar } from "date-fns/locale";
import PdfViewer from "@/components/PdfViewer";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { FocusTrap } from "@headlessui/react";

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
    render: (data) => new Date(data.createdAt).toLocaleDateString(),
  },
];

const UserDetails = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const locale = isRtl ? ar : fr; // Use Arabic or French locale for date-fns

  const { id } = useParams();
  const { userDetails } = useLoaderData();
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [pdfToView, setPdfToView] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

  const [filters, setFilters] = useState<{
    month?: number;
    year?: number;
  }>({});

  const { data: payrollsResponse, isLoading } =
    useQuery<PaginatedPayrollsResponse>({
      queryKey: ["payrolls", page, limit, filters, id],
      queryFn: () =>
        getAllPayrolls(page, limit, id, filters.month, filters.year),
      retry: false,
    });

  // Extract paginated data from response
  const payrolls = payrollsResponse?.data || [];
  const totalItems = payrollsResponse?.meta.totalItems || 0;
  const totalPages = payrollsResponse?.meta.totalPages || 0;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle items per page change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Handle date filter change
  const handleDateFilterChange = (date: Date | null) => {
    setDateFilter(date);
    setPage(1);

    if (date) {
      setFilters({
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    } else {
      setFilters({});
    }
  };

  // const handleViewPdf = (payroll: IPayrollReponse) => {
  //   // const backendBaseUrl = "http://localhost:3000";
  //   const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  //   const pdfUrl = `${backendBaseUrl}/${payroll.path}`;
  //   setPdfToView(pdfUrl);
  // };

  const handleViewPdf = (payroll: IPayrollReponse) => {
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    // Remove any existing host in payroll.path if it exists
    const cleanPath = payroll.path.replace(/^https?:\/\/[^/]+/, "");
    // const pdfUrl = `${backendBaseUrl}/${payroll.path}`;
    const pdfUrl = `${backendBaseUrl}${cleanPath}`;
    setPdfToView(pdfUrl);
  };

  const { data: userPayrolls } = useQuery({
    queryKey: ["payrolls", +id!],
    queryFn: () => getPayrollsById(+id!),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });

  const latestCreatedAtUserPayroll = userPayrolls?.length
    ? userPayrolls.reduce((latest, payroll) =>
        new Date(payroll.createdAt) > new Date(latest.createdAt)
          ? payroll
          : latest
      ).createdAt
    : null;

  const currentYear = new Date().getFullYear();
  const totalThisYear =
    userPayrolls?.filter((payroll) => payroll.period.includes(`${currentYear}`))
      .length ?? 1;
  const totalLastYear =
    userPayrolls?.filter((payroll) =>
      payroll.period.includes(`${currentYear - 1}`)
    ).length ?? 1;
  const totalExceptTwoLastYears =
    userPayrolls?.filter(
      (payroll) =>
        !payroll.period.includes(`${currentYear}`) &&
        !payroll.period.includes(`${currentYear - 1}`)
    ).length ?? 1;
  const totalExceptLastYear =
    userPayrolls?.filter(
      (payroll) => !payroll.period.includes(`${currentYear}`)
    ).length ?? 1;

  const totalPayrolls = userPayrolls?.length ?? 1;
  const thisYearPercentage = (totalThisYear * 100) / totalPayrolls;
  const lastYearPercentage = (totalLastYear * 100) / totalPayrolls;
  const exceptLastTwoYearPercentage =
    (totalExceptTwoLastYears * 100) / totalPayrolls;

  const payrollData: { name: string; value: number; color: string }[] = [
    {
      name: t("userDetails.bulletinYear", { year: currentYear }),
      value: totalThisYear,
      color: "rgb(22 101 52)",
    },
    {
      name: t("userDetails.beforeYear", { year: currentYear }),
      value: totalExceptLastYear,
      color: "#FACC15",
    },
  ];

  const payrollsData = {
    percentage: 100,
    increase: 20,
    breakdown: [
      {
        label: `${currentYear}`,
        value: thisYearPercentage,
        color: "rgb(22 101 52)",
      },
      {
        label: `${currentYear - 1}`,
        value: lastYearPercentage,
        color: "#FACC15",
      },
      {
        label: t("userDetails.others"),
        value: exceptLastTwoYearPercentage,
        color: "rgb(30 64 175)",
      },
    ],
  };

  return (
    <div
      className={clsx("w-full", isRtl ? "font-arabic" : "Inter")}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 gap-4">
        <Card className="max-w-xl">
          <Card.Header className="text-gray-500 font-light text-sm">
            <Card.Title className="text-black">
              {t("userDetails.details")}
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col justify-center overflow-hidden">
            <div className="space-y-3" dir={isRtl ? "rtl" : "ltr"}>
              <div
                className={clsx(
                  "flex items-center p-2 badge bg-green-100 text-green-800 rounded-md gap-1"
                  // isRtl ? "flex-row-reverse" : "flex-row"
                )}
              >
                <span
                  className={clsx(
                    "font-light text-sm flex items-center gap-1"
                    // isRtl ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <BookKeyIcon size={20} />
                  {t("userDetails.employeeId")}:
                </span>
                <span className="font-medium text-sm underline">
                  {userDetails?.employeeId}
                </span>
              </div>
              <div
                className={clsx(
                  "flex items-center gap-1 p-2 badge bg-blue-100 text-blue-800 rounded-md"
                  // isRtl ? "flex-row-reverse" : "flex-row"
                )}
              >
                <span
                  className={clsx(
                    "font-light text-sm flex items-center gap-1"
                    // isRtl ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <IdCardIcon size={20} />
                  {t("userDetails.fullName")}:
                </span>
                <span className="font-medium text-sm underline underline-offset-2">
                  {userDetails?.name}
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="font-light">
              {t("userDetails.totalPayrolls")}
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col justify-center overflow-hidden">
            <div
              className={clsx(
                "flex items-center justify-between relative"
                // isRtl ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className="relative">
                <PieChart width={200} height={100}>
                  <Pie
                    data={payrollData}
                    cx={isRtl ? "60%" : "40%"} // Adjust for RTL
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={50}
                    outerRadius={60}
                    cornerRadius={10}
                    dataKey="value"
                  >
                    {payrollData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div
                  className={clsx(
                    "absolute top-[3rem] transform -translate-y-1/2 text-center",
                    isRtl
                      ? "right-[96px] translate-x-[94%]"
                      : "left-[96px] -translate-x-[94%]"
                  )}
                >
                  <h2 className="text-3xl font-bold">{userPayrolls?.length}</h2>
                  <p className="text-sm font-light text-gray-500">
                    {t("userDetails.total")}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {payrollData.map((item, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "flex items-center gap-1"
                      // isRtl ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span className="font-semibold bg-green-100 w-6 h-6 flex items-center justify-center rounded-full text-green-700">
                      {item.value}
                    </span>
                    <div
                      className={clsx(
                        "flex items-center gap-2"
                        // isRtl ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="text-xs font-light text-gray-500">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="font-light">
              {t("userDetails.payrollStats")}
            </Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col justify-center">
            <div
              className={clsx(
                "flex items-center justify-between"
                // isRtl ? "flex-row-reverse" : "flex-row"
              )}
            >
              <h2 className="text-3xl font-bold">{payrollsData.percentage}%</h2>
              <div
                className={clsx(
                  "flex items-center bg-green-50 text-green-800 font-medium text-sm mt-1 py-1 px-3 rounded-md"
                  // isRtl ? "flex-row-reverse" : "flex-row"
                )}
              >
                <ArrowUpRight size={16} />
                <span>
                  {totalPayrolls}%{" "}
                  {latestCreatedAtUserPayroll
                    ? formatDistanceToNow(
                        new Date(latestCreatedAtUserPayroll),
                        { addSuffix: true, locale }
                      )
                    : new Date().getDay()}
                </span>
              </div>
            </div>
            <div className="mt-6 w-full h-2 rounded-full flex overflow-hidden">
              {payrollsData.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="h-full rounded-full"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                    marginRight: isRtl
                      ? "0"
                      : index !== payrollsData.breakdown.length - 1
                      ? "2px"
                      : "0",
                    marginLeft: isRtl
                      ? index !== payrollsData.breakdown.length - 1
                        ? "2px"
                        : "0"
                      : "0",
                  }}
                />
              ))}
            </div>
            <div
              className={clsx(
                "flex justify-between font-light mt-2 text-xs text-gray-500"
                // isRtl ? "flex-row-reverse" : "flex-row"
              )}
            >
              {payrollsData.breakdown.map((item, index) => (
                <div
                  key={index}
                  className={clsx(
                    "flex items-center gap-1"
                    // isRtl ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      <DataTable<IPayrollReponse>
        data={payrolls ?? []}
        columns={payrollColumns}
        getId={(payroll) => payroll.id}
        itemsPerPageOptions={[4, 6]}
        pagination={{
          currentPage: page,
          itemsPerPage: limit,
          totalPages,
          totalItems,
          onPageChange: handlePageChange,
          onItemsPerPageChange: handleLimitChange,
        }}
        enableSearch={false}
        availableFilters={["date"]}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateFilterChange}
        onView={handleViewPdf}
        loading={isLoading}
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
                className={isRtl ? "ml-2" : "mr-2"}
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

export default UserDetails;
