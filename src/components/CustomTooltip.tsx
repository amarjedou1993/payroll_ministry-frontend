// import { TooltipProps } from "recharts";

// export const CustomTooltip = ({
//   active,
//   payload,
//   label,
// }: TooltipProps<number, string>) => {
//   if (active && payload?.length) {
//     return (
//       <div className="bg-white p-2 shadow-md rounded-md">
//         <p className="text-gray-600 font-medium text-sm">Period: {label}</p>
//         <p className="text-indigo-600 font-semibold text-sm">
//           Total Bulletins: {payload[0]?.value ?? "N/A"}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

import { TooltipProps } from "recharts";
import { useTranslation } from "react-i18next";

export const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  if (active && payload?.length) {
    return (
      <div
        className="bg-white p-2 shadow-md rounded-md"
        style={{
          fontFamily: isRtl ? "Cairo" : "Inter",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        <p className="text-gray-600 font-medium text-sm">
          {t("period")}: {label}
        </p>
        <p className="text-indigo-600 font-semibold text-sm">
          {t("totalBulletins")}: {payload[0]?.value ?? t("notAvailable")}
        </p>
      </div>
    );
  }
  return null;
};
