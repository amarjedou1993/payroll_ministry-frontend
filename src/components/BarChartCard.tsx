import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "@/components/ui/Card";
import { CustomTooltip } from "./CustomTooltip";
import { useTranslation } from "react-i18next";

interface BarChartCardProps {
  chartData: { period: string; count: number }[];
  title: string;
}

export const BarChartCard = ({ chartData, title }: BarChartCardProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  // const localeString = isRtl ? "ar-EG" : "fr-FR";

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Format period for display
  const formattedChartData = chartData.map((item) => {
    const [month, year] = item.period.split("-");
    const monthNum = parseInt(month, 10) - 1;
    const monthName = t(`monthNames.${monthNum}`).slice(0, 3);
    return {
      ...item,
      period: `${monthName} ${year}`,
    };
  });

  // Handle empty data
  if (!formattedChartData || formattedChartData.length === 0) {
    return (
      <Card className="flex flex-col shadow-md">
        <Card.Content className="p-4">
          <h2 className="text-sm font-light mb-3">{title}</h2>
          <div className="text-center text-gray-500 p-4">
            {t("noDataAvailable")}
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col shadow-md">
      <Card.Content className="p-4">
        <div className="relative z-10" style={{ overflowAnchor: "none" }}>
          <h2
            className={`text-sm font-light mb-3 ${
              isRtl ? "font-arabic" : "Inter"
            }`}
          >
            {title}
          </h2>
          <ResponsiveContainer
            width="100%"
            height={260}
            aria-label={t("payrollOverview")}
          >
            <BarChart
              data={formattedChartData}
              barCategoryGap={10}
              barGap={1}
              layout="horizontal"
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              onMouseMove={(state) =>
                setActiveIndex(state.activeTooltipIndex ?? null)
              }
              onMouseLeave={() => setActiveIndex(null)}
            >
              <XAxis
                type="category"
                dataKey="period"
                className="text-sm font-light text-gray-500"
                tick={{ textAnchor: isRtl ? "end" : "middle" }}
                reversed={isRtl}
              />
              <YAxis
                type="number"
                dataKey="count"
                className="text-sm font-light text-gray-500"
                tick={{ textAnchor: isRtl ? "start" : "end" }}
                domain={[0, "dataMax"]}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
                wrapperStyle={{ pointerEvents: "none" }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={60}>
                {formattedChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === activeIndex ? "#dbeafe" : "#6366F1"}
                    // fill={index === activeIndex ? "#006838" : "#00a651"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Content>
    </Card>
  );
};
