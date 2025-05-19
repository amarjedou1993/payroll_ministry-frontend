// import clsx from "clsx";
// import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
// import { FiAlertCircle } from "react-icons/fi";

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
//   icon?: ReactNode;
//   iconPosition?: "left" | "right";
//   className?: string;
// }

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ label, error, icon, iconPosition = "left", className, ...props }, ref) => {
//     return (
//       <div className="w-full">
//         {/* Label */}
//         {label && (
//           <label className="block text-sm font-light text-gray-700 mb-1">
//             {label}
//           </label>
//         )}

//         {/* Input Wrapper */}
//         <div className="relative">
//           {/* Icon */}
//           {icon && (
//             <span
//               className={clsx(
//                 "absolute top-1/2 -translate-y-1/2 text-gray-400",
//                 {
//                   "left-3": iconPosition === "left",
//                   "right-3": iconPosition === "right",
//                 }
//               )}
//             >
//               {icon}
//             </span>
//           )}

//           {/* Input field */}
//           <input
//             ref={ref}
//             className={clsx(
//               "w-full pl-4 border border-gray-100 font-light rounded-md py-3 text-sm focus:outline-none focus:ring-1 transition",
//               {
//                 "pl-10 pr-4": icon && iconPosition === "left", // Padding for left icon
//                 "pl-4 pr-10": icon && iconPosition === "right", // Padding for right icon
//                 "border-gray-300 focus:ring-green-600 focus:border-green-700":
//                   !error,
//                 "border-red-500 focus:ring-red-500": error,
//               },
//               className
//             )}
//             {...props}
//           />
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="flex items-center text-red-600 text-sm mt-1">
//             <FiAlertCircle className="mr-1" />
//             <span>{error}</span>
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = "Input";

// export default Input;

// // ChatGPT

import clsx from "clsx";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = "left", className, ...props }, ref) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "ar";

    // Translate label and error if they are translation keys
    const translatedLabel = label ? t(label) : undefined;
    const translatedError = error ? t(error) : undefined;

    // Adjust icon position for RTL: swap left/right
    const effectiveIconPosition = isRtl
      ? iconPosition === "left"
        ? "right"
        : "left"
      : iconPosition;

    return (
      <div
        className={clsx("w-full", isRtl ? "font-arabic text-right" : "Inter")}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Label */}
        {translatedLabel && (
          <label className="block text-sm font-light text-gray-700 mb-1">
            {translatedLabel}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <span
              className={clsx(
                "absolute top-1/2 -translate-y-1/2 text-gray-400",
                {
                  "left-3": effectiveIconPosition === "left",
                  "right-3": effectiveIconPosition === "right",
                }
              )}
            >
              {icon}
            </span>
          )}

          {/* Input field */}
          <input
            ref={ref}
            className={clsx(
              `w-full border ${
                isRtl ? "pr-3" : "pl-3"
              } border-gray-100 font-light rounded-md py-3 text-sm focus:outline-none focus:ring-1 transition`,

              {
                "pl-10 pr-4": icon && effectiveIconPosition === "left", // Padding for left icon
                "pr-10 pl-4": icon && effectiveIconPosition === "right", // Padding for right icon
                "border-gray-300 focus:ring-green-600 focus:border-green-700":
                  !translatedError,
                "border-red-500 focus:ring-red-500": translatedError,
              },
              className
            )}
            {...props}
          />
        </div>

        {/* Error Message */}
        {translatedError && (
          <div
            className={clsx(
              "flex items-center text-red-600 text-sm mt-1",
              isRtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            <FiAlertCircle className={isRtl ? "ml-1" : "mr-1"} />
            <span>{translatedError}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
