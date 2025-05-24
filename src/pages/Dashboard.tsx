import {
  AlertTriangleIcon,
  ArrowRight,
  Calendar1Icon,
  ChevronUpCircleIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import {
  getAllPayrolls,
  getLastFivePayrolls,
  getPayrolls,
  getUsers,
} from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import {
  IPayrollReponse,
  IUserResponse,
  LastFivePayrollsResponse,
  PaginatedPayrollsResponse,
} from "@/types/types";
import DataTable, { ColumnDef } from "@/components/ui/datatable/DataTable2";
import { useMemo, useState } from "react";
import { Button } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";
import { fr, ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import PdfViewer from "@/components/PdfViewer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { BarChartCard } from "@/components/BarChartCard";
// import { DonutChartCard } from "@/components/DonutChartCard";
import DocumentGrid from "@/components/DocumentGrid";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const dateFnsLocale = isRtl ? ar : fr;
  const localeString = isRtl ? "ar-EG" : "fr-FR";

  // const data = [
  //   { name: t("bonuses"), value: 5100, color: "#26A7DF" },
  //   { name: t("incentives"), value: 5400, color: "#2CB57A" },
  // ];

  const [pdfToView, setPdfToView] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 8 });
  const [selectedPeriod, setSelectedPeriod] = useState<Date | null>(null);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const userRoles = user?.roles?.map((role) => role.name) || [];
  const userId = user?.id;
  const isEmployee = userRoles.includes("Employee");

  const {
    data: paginatedPayrolls,
    isError,
    isLoading,
    isFetching,
  } = useQuery<PaginatedPayrollsResponse, Error>({
    queryKey: [
      "payrolls",
      userId,
      pagination.page,
      pagination.limit,
      ...userRoles,
      selectedPeriod?.getMonth(),
      selectedPeriod?.getFullYear(),
    ],
    queryFn: () => {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        userId: isEmployee ? userId : undefined,
        month: selectedPeriod?.getMonth(),
        year: selectedPeriod?.getFullYear(),
      };

      return getAllPayrolls(
        params.page,
        params.limit,
        params.userId,
        params.month,
        params.year
      );
    },
    enabled: !!isAuthenticated,
  }) as {
    data: PaginatedPayrollsResponse | undefined;
    isError: boolean;
    isLoading: boolean;
    isFetching: boolean;
  };

  const handlePageChange = (newPage: number) => {
    const totalPages = paginatedPayrolls?.meta.totalPages || 1;
    const boundedPage = Math.max(1, Math.min(newPage, totalPages));
    setPagination((prev) => ({ ...prev, page: boundedPage }));
  };

  const handleDateFilterChange = (newDate: Date | null) => {
    setSelectedPeriod(newDate);
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const navigate = useNavigate();

  const { data: users } = useQuery<IUserResponse[]>({
    queryKey: ["users"],
    queryFn: getUsers,
    enabled: !isEmployee && !!isAuthenticated,
  });

  const latestCreatedAtUser = users?.length
    ? users.reduce((latest, user) =>
        new Date(user.createdAt) > new Date(latest.createdAt) ? user : latest
      ).createdAt
    : null;

  const { data: payrolls } = useQuery({
    queryKey: ["payrolls", userId, ...userRoles],
    queryFn: getPayrolls,
    enabled: !!isAuthenticated,
    select: (data: IPayrollReponse[]) =>
      userRoles.includes("Employee") &&
      !userRoles.includes("Admin") &&
      !userRoles.includes("Manager")
        ? data.filter((p) => p.user.id === userId)
        : data,
  });

  const { data: lastFivePayrolls, isLoading: lastFiveLoading } = useQuery<
    LastFivePayrollsResponse,
    Error
  >({
    queryKey: ["lastFivePayrolls"],
    queryFn: getLastFivePayrolls,
    enabled: !!isAuthenticated && !isEmployee,
    retry: false,
  });

  const lastestUploadedPayroll = payrolls?.length
    ? payrolls.reduce((latest, payroll) =>
        new Date(payroll.createdAt) > new Date(latest.createdAt)
          ? payroll
          : latest
      ).createdAt
    : null;

  const thisYearPayrolls =
    payrolls?.filter((payroll) =>
      payroll.period.includes(`${new Date().getFullYear()}`)
    ).length ?? 1;

  const payrollsLength = payrolls?.length ?? 1;

  const thisYearPercentage = (thisYearPayrolls * 100) / payrollsLength;

  const totalExceptLastYears =
    payrolls?.filter(
      (payroll) => !payroll.period.includes(`${new Date().getFullYear()}`)
    ).length ?? 1;

  const payrollsData = {
    percentage: 100,
    increase: 20,
    breakdown: [
      {
        label: `${new Date().getFullYear()}`,
        value: thisYearPayrolls,
        color: "rgb(22 101 52)",
      },
      {
        label: t("beforeYear", { year: new Date().getFullYear() }),
        value: totalExceptLastYears,
        color: "#FACC15",
      },
    ],
  };

  const payrollColumns: ColumnDef<IPayrollReponse>[] = [
    {
      key: "filename",
      header: t("filename"),
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
      header: t("period"),
      accessor: "period",
      sortable: true,
    },
    {
      key: "createdAt",
      header: t("uploadedAt"),
      render: (data) =>
        new Date(data.createdAt).toLocaleDateString(localeString, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
  ];

  const payrollCounts = useMemo(() => {
    if (!payrolls) return {};

    return payrolls.reduce((acc, payroll) => {
      const period = payroll.period;
      acc[period] = (acc[period] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [payrolls]);

  const chartData = Object.entries(payrollCounts).map(([period, count]) => ({
    period,
    count,
  }));

  const handleViewPdf = (payroll: IPayrollReponse) => {
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const pdfUrl = `${backendBaseUrl}/${payroll.path}`;
    setPdfToView(pdfUrl);
  };

  return (
    <div className="mt-3">
      {!isEmployee && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 gap-4">
          <Card>
            <Card.Header className="text-gray-500 font-light text-sm">
              <Card.Title className="text-black">
                {t("totalEmployees")}
              </Card.Title>
            </Card.Header>
            <Card.Content className="flex flex-col justify-center overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center rounded-md gap-1">
                  <span className="flex items-center gap-2">
                    <span className="text-xl xs:text-3xl font-semibold">
                      {users?.length}
                    </span>
                    <span className="font-light text-xs py-1 px-2 rounded-md flex items-center gap-1 text-green-700 bg-green-100">
                      <ChevronUpCircleIcon size={14} />
                      100%
                    </span>
                  </span>
                </div>
                <div className="flex items-center font-light shadow-sm text-sm justify-between py-2 px-4 badge bg-gray-100 text-gray-700 rounded-md border">
                  <span className="flex items-center gap-1">
                    <Calendar1Icon size={16} />
                    {latestCreatedAtUser
                      ? formatDistanceToNow(new Date(latestCreatedAtUser), {
                          addSuffix: true,
                          locale: dateFnsLocale,
                        })
                      : new Date().getDay()}
                  </span>
                  {userRoles.includes("Admin") && (
                    <Button
                      className="flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        document.body.style.overflow = "hidden";
                        navigate("/dashboard/users");
                        requestAnimationFrame(() => {
                          document.body.style.overflow = "";
                        });
                      }}
                    >
                      {t("viewDetails")}
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </Button>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title className="font-light">
                {t("totalPayrolls")}
              </Card.Title>
            </Card.Header>
            <Card.Content className="flex flex-col justify-center overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center rounded-md gap-1">
                  <span className="flex items-center gap-2">
                    <span className="text-3xl font-semibold">
                      {payrolls?.length}
                    </span>
                    <span className="font-light text-xs py-1 px-2 rounded-md flex items-center gap-1 bg-blue-100 text-blue-700">
                      <ChevronUpCircleIcon size={14} />
                      100%
                    </span>
                  </span>
                </div>
                <div className="flex items-center font-light shadow-sm text-sm justify-between py-2 px-4 badge bg-gray-100 text-gray-700 rounded-md border">
                  <span className="flex items-center gap-1">
                    <Calendar1Icon size={16} />
                    {lastestUploadedPayroll
                      ? formatDistanceToNow(new Date(lastestUploadedPayroll), {
                          addSuffix: true,
                          locale: dateFnsLocale,
                        })
                      : new Date().getDay()}
                  </span>
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => navigate("/dashboard/documents")}
                  >
                    {t("viewDetails")}
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title className="font-light">
                {t("payrollsThisYear", { year: new Date().getFullYear() })}
              </Card.Title>
            </Card.Header>
            <Card.Content className="flex flex-col justify-center">
              <div className="space-y-2">
                <div className="flex items-center rounded-md gap-1">
                  <span className="flex items-center gap-2">
                    <span className="text-3xl font-semibold">
                      {thisYearPayrolls}
                    </span>
                    <span className="font-light text-xs py-1 px-2 rounded-md flex items-center gap-1 bg-green-100 text-green-700">
                      <ChevronUpCircleIcon size={14} />
                      {Math.floor(+thisYearPercentage.toFixed(1))}%
                    </span>
                  </span>
                </div>
                <div className="mt-6 w-full h-2 rounded-full flex overflow-hidden">
                  {payrollsData.breakdown.map((item, index) => (
                    <div
                      key={index}
                      className="h-full rounded-full"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                        marginInlineEnd:
                          index !== payrollsData.breakdown.length - 1
                            ? "2px"
                            : "0",
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between font-light mt-2 text-xs text-gray-500">
                  {payrollsData.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {!isEmployee && (
        // <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] w-full gap-4">
        //   <BarChartCard chartData={chartData} title={t("payrollOverview")} />
        //   <DonutChartCard data={data} title={t("bonusesAndIncentives")} />
        // </div>
        <div>
          <BarChartCard chartData={chartData} title={t("payrollOverview")} />
          {/* <DonutChartCard data={data} title={t("bonusesAndIncentives")} /> */}
        </div>
      )}

      {!isEmployee && (
        <div>
          <DataTable<IPayrollReponse>
            data={lastFivePayrolls?.data ?? []}
            columns={payrollColumns}
            getId={(payroll) => payroll.id}
            itemsPerPageOptions={[5]}
            loading={lastFiveLoading}
            enableSearch={false}
            onView={handleViewPdf}
            emptyState={
              <div className="p-5 flex items-center justify-center text-gray-500">
                <AlertTriangleIcon size={18} className="inline-block me-2" />
                {t("noDocuments")}
              </div>
            }
          />
        </div>
      )}

      {isEmployee && (
        <DocumentGrid<IPayrollReponse>
          categories={[
            {
              name: t("myPayrolls"),
              count: paginatedPayrolls?.meta.totalItems || 0,
              items: paginatedPayrolls?.data || [],
            },
          ]}
          getTitle={(item) => {
            const filename = item.filename || "";
            const match = filename.match(/(\d{2})-(\d{4})\.pdf$/);
            if (match) {
              const monthNum = parseInt(match[1], 10);
              const monthName = t(`monthNames.${monthNum - 1}`).slice(0, 3);
              const year = match[2];
              return `${t("payroll")} ${monthName} ${year}`;
            }
            return filename;
          }}
          getLastUpdated={(item) =>
            t("dateUpload", {
              date: formatDistanceToNow(new Date(item.createdAt), {
                locale: dateFnsLocale,
              }),
            })
          }
          getPeriod={(item) => item.period}
          onItemClick={(item) => {
            setPdfToView(`http://185.98.137.109:3000/${item.path}`);
          }}
          isLoading={isLoading || isFetching}
          isError={isError}
          pagination={{
            currentPage: pagination?.page,
            totalPages: paginatedPayrolls?.meta.totalPages || 1,
            onPageChange: handlePageChange,
          }}
          selectedDate={selectedPeriod}
          onDateFilterChange={handleDateFilterChange}
        />
      )}

      {pdfToView && (
        <PdfViewer file={pdfToView} onClose={() => setPdfToView(null)} />
      )}
    </div>
  );
};

export default Dashboard;
