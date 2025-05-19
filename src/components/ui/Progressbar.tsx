// import React, { useState, useEffect } from "react";
// import { CheckCircle, Pause, Play, XCircleIcon } from "lucide-react";
// import Button from "./Button";

// interface ProgressBarProps {
//   progress: number;
//   color?: string;
//   onCancel?: () => void;
//   onPause?: () => void;
//   onResume?: () => void;
//   isUploading?: boolean;
//   className?: string;
//   onClose?: () => void; // New prop to handle closing
// }

// const ProgressBar: React.FC<ProgressBarProps> = ({
//   progress,
//   color = "bg-gradient-to-r from-blue-400 to-indigo-500",
//   onCancel,
//   onPause,
//   onResume,
//   isUploading = true,
//   className = "",
//   // onClose,
// }) => {
//   const [paused, setPaused] = useState(false);
//   // const [showCloseButton, setShowCloseButton] = useState(false);

//   const isComplete = progress === 100;

//   useEffect(() => {
//     if (isComplete) {
//       setPaused(false);
//       // setShowCloseButton(true); // Show close button when upload completes
//     }
//   }, [isComplete]);

//   const handleAction = (action?: () => void) => {
//     action?.();
//     // Add subtle animation feedback
//     document.documentElement.style.setProperty("--scale-effect", "scale(0.95)");
//     setTimeout(() => {
//       document.documentElement.style.setProperty("--scale-effect", "scale(1)");
//     }, 100);
//   };

//   return (
//     <div
//       className={`group relative border rounded-md shadow-sm p-6 w-full space-y-3 ${className}`}
//     >
//       {/* {showCloseButton && (
//         <Button
//           variant="secondary"
//           onClick={onClose}
//           className="absolute -top-2 -right-2 text-gray-800 border-none pt-0.5 pb-0.5 pr-0.5 pl-0.5 rounded-full hover:bg-gray-100"
//         >
//           <XCircleIcon className="w-5 h-5 hover:text-gray-600 transition-colors" />
//         </Button>
//       )} */}

//       {/* Progress Header */}
//       <div className="flex items-center justify-between mb-1">
//         <div className="flex items-center space-x-2">
//           <span className="text-sm font-medium text-gray-600">
//             {isComplete ? "Terminer" : `Uploading...`}
//           </span>
//           {!isComplete && (
//             <span className="text-xs text-gray-400">{progress}%</span>
//           )}
//         </div>

//         {isComplete ? (
//           <CheckCircle className="text-emerald-500 w-5 h-5" />
//         ) : (
//           <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//             <Button
//               onClick={() =>
//                 paused ? handleAction(onResume) : handleAction(onPause)
//               }
//               className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//             >
//               {paused ? (
//                 <Play className="w-4 h-4" />
//               ) : (
//                 <Pause className="w-4 h-4" />
//               )}
//             </Button>
//             <Button
//               onClick={() => handleAction(onCancel)}
//               className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//             >
//               <XCircleIcon className="w-4 h-4" />
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Progress Track */}
//       <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
//         {/* Animated Background */}
//         <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-blue-100 to-indigo-100" />

//         {/* Progress Fill */}
//         <div
//           className={`absolute inset-y-0 left-0 ${color} rounded-full transition-all duration-500 ease-out`}
//           style={{
//             width: `${progress}%`,
//             minWidth: "0.25rem",
//           }}
//         >
//           {/* Subtle shimmer effect */}
//           {!isComplete && isUploading && !paused && (
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-shimmer" />
//           )}
//         </div>

//         {/* Completion Glow */}
//         {isComplete && (
//           <div className="absolute inset-0 animate-glow opacity-0 bg-gradient-to-r from-emerald-200/50 to-transparent" />
//         )}
//       </div>

//       {/* Status Indicator */}
//       {!isComplete && isUploading && (
//         <div className="text-right">
//           <span className="text-xs text-gray-400">
//             {paused ? "Paused" : "Active"}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// // Add these global animations
// const styles = `
//   @keyframes shimmer {
//     0% { transform: translateX(-100%); }
//     100% { transform: translateX(200%); }
//   }

//   @keyframes glow {
//     0% { opacity: 0; }
//     50% { opacity: 0.4; }
//     100% { opacity: 0; }
//   }

//   .animate-shimmer {
//     animation: shimmer 2s infinite linear;
//   }

//   .animate-glow {
//     animation: glow 1.5s ease-out;
//   }

//   :root {
//     --scale-effect: scale(1);
//   }
// `;

// // Inject styles
// document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

// export default ProgressBar;

// import React, { useEffect } from "react";
// import { CheckCircle, Pause, Play, XCircleIcon } from "lucide-react";
// import Button from "./Button";

// interface FileProgress {
//   id: string;
//   file: File;
//   progress: number;
//   error?: string;
//   paused?: boolean;
// }

// interface ProgressBarProps {
//   progress: number;
//   files: FileProgress[]; // Added to handle multiple files
//   color?: string;
//   onCancel?: (fileId: string) => void;
//   onPause?: (fileId: string) => void;
//   onResume?: (fileId: string) => void;
//   className?: string;
//   onClose?: () => void;
// }

// const ProgressBar: React.FC<ProgressBarProps> = ({
//   progress,
//   files,
//   color = "bg-gradient-to-r from-blue-400 to-indigo-500",
//   onCancel,
//   onPause,
//   onResume,
//   className = "",
//   onClose,
// }) => {
//   const isComplete = files.every((file) => file.progress === 100);

//   useEffect(() => {
//     if (isComplete) {
//       // Optionally handle completion logic here if needed
//     }
//   }, [isComplete]);

//   const handleAction = (action?: () => void) => {
//     action?.();
//     document.documentElement.style.setProperty("--scale-effect", "scale(0.95)");
//     setTimeout(() => {
//       document.documentElement.style.setProperty("--scale-effect", "scale(1)");
//     }, 100);
//   };

//   return (
//     <div
//       className={`group relative border rounded-md shadow-sm p-6 w-full space-y-3 ${className}`}
//     >
//       {/* Progress Header */}
//       <div className="flex items-center justify-between mb-1">
//         <div className="flex items-center space-x-2">
//           <span className="text-sm font-medium text-gray-600">
//             {isComplete ? "Terminé" : "Uploading..."}
//           </span>
//           {!isComplete && (
//             <span className="text-xs text-gray-400">{progress}%</span>
//           )}
//         </div>
//         {isComplete && <CheckCircle className="text-emerald-500 w-5 h-5" />}
//       </div>

//       {/* Progress Track for Global Progress */}
//       <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
//         <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-blue-100 to-indigo-100" />
//         <div
//           className={`absolute inset-y-0 left-0 ${color} rounded-full transition-all duration-500 ease-out`}
//           style={{ width: `${progress}%`, minWidth: "0.25rem" }}
//         >
//           {!isComplete && (
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-shimmer" />
//           )}
//         </div>
//         {isComplete && (
//           <div className="absolute inset-0 animate-glow opacity-0 bg-gradient-to-r from-emerald-200/50 to-transparent" />
//         )}
//       </div>

//       {/* Individual File Progress */}
//       <div className="space-y-2">
//         {files.map((file) => (
//           <div key={file.id} className="flex items-center justify-between">
//             <div className="flex items-center space-x-2 w-2/3">
//               <span className="text-sm text-gray-600 truncate">
//                 {file.file.name}
//               </span>
//               <span className="text-xs text-gray-400">({file.progress}%)</span>
//             </div>
//             <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//               {file.progress < 100 && !file.error && (
//                 <>
//                   <Button
//                     onClick={() =>
//                       file.paused
//                         ? handleAction(() => onResume?.(file.id))
//                         : handleAction(() => onPause?.(file.id))
//                     }
//                     className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//                   >
//                     {file.paused ? (
//                       <Play className="w-4 h-4" />
//                     ) : (
//                       <Pause className="w-4 h-4" />
//                     )}
//                   </Button>
//                   <Button
//                     onClick={() => handleAction(() => onCancel?.(file.id))}
//                     className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//                   >
//                     <XCircleIcon className="w-4 h-4" />
//                   </Button>
//                 </>
//               )}
//               {file.error && (
//                 <span className="text-xs text-red-500">{file.error}</span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Close Button (optional, uncomment if needed) */}
//       {/* {isComplete && (
//         <Button
//           variant="secondary"
//           onClick={onClose}
//           className="absolute -top-2 -right-2 text-gray-800 border-none pt-0.5 pb-0.5 pr-0.5 pl-0.5 rounded-full hover:bg-gray-100"
//         >
//           <XCircleIcon className="w-5 h-5 hover:text-gray-600 transition-colors" />
//         </Button>
//       )} */}
//     </div>
//   );
// };

// // Inject styles (unchanged)
// const styles = `
//   @keyframes shimmer {
//     0% { transform: translateX(-100%); }
//     100% { transform: translateX(200%); }
//   }
//   @keyframes glow {
//     0% { opacity: 0; }
//     50% { opacity: 0.4; }
//     100% { opacity: 0; }
//   }
//   .animate-shimmer {
//     animation: shimmer 2s infinite linear;
//   }
//   .animate-glow {
//     animation: glow 1.5s ease-out;
//   }
//   :root {
//     --scale-effect: scale(1);
//   }
// `;
// document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

// export default ProgressBar;

// import React, { useEffect } from "react";
// import { CheckCircle, Pause, Play, XCircleIcon } from "lucide-react";
// import Button from "./Button";

// interface ProgressBarProps {
//   progress: number;
//   hasPausedFiles: boolean; // Indicates if any files are paused
//   fileCount: number; // Total number of files being uploaded
//   color?: string;
//   onPause?: () => void;
//   onResume?: () => void;
//   onCancel?: () => void;
//   className?: string;
//   onClose?: () => void;
// }

// const ProgressBar: React.FC<ProgressBarProps> = ({
//   progress,
//   hasPausedFiles,
//   fileCount,
//   color = "bg-gradient-to-r from-blue-400 to-indigo-500",
//   onPause,
//   onResume,
//   onCancel,
//   className = "",
//   onClose,
// }) => {
//   const isComplete = progress === 100;

//   useEffect(() => {
//     if (isComplete) {
//       // No additional state management needed here
//     }
//   }, [isComplete]);

//   const handleAction = (action?: () => void) => {
//     action?.();
//     document.documentElement.style.setProperty("--scale-effect", "scale(0.95)");
//     setTimeout(() => {
//       document.documentElement.style.setProperty("--scale-effect", "scale(1)");
//     }, 100);
//   };

//   return (
//     <div
//       className={`group relative border rounded-md shadow-sm p-6 w-full space-y-3 ${className}`}
//     >
//       {/* Progress Header */}
//       <div className="flex items-center justify-between mb-1">
//         <div className="flex items-center space-x-2">
//           <span className="text-sm font-medium text-gray-600">
//             {isComplete
//               ? "Terminé"
//               : `Uploading ${fileCount} file${fileCount !== 1 ? "s" : ""}...`}
//           </span>
//           {!isComplete && (
//             <span className="text-xs text-gray-400">{progress}%</span>
//           )}
//         </div>
//         {isComplete ? (
//           <CheckCircle className="text-emerald-500 w-5 h-5" />
//         ) : (
//           <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//             <Button
//               onClick={() => handleAction(hasPausedFiles ? onResume : onPause)}
//               className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//             >
//               {hasPausedFiles ? (
//                 <Play className="w-4 h-4" />
//               ) : (
//                 <Pause className="w-4 h-4" />
//               )}
//             </Button>
//             <Button
//               onClick={() => handleAction(onCancel)}
//               className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//             >
//               <XCircleIcon className="w-4 h-4" />
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Progress Track */}
//       <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
//         <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-blue-100 to-indigo-100" />
//         <div
//           className={`absolute inset-y-0 left-0 ${color} rounded-full transition-all duration-500 ease-out`}
//           style={{ width: `${progress}%`, minWidth: "0.25rem" }}
//         >
//           {!isComplete && (
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-shimmer" />
//           )}
//         </div>
//         {isComplete && (
//           <div className="absolute inset-0 animate-glow opacity-0 bg-gradient-to-r from-emerald-200/50 to-transparent" />
//         )}
//       </div>
//     </div>
//   );
// };

// // Inject styles
// const styles = `
//   @keyframes shimmer {
//     0% { transform: translateX(-100%); }
//     100% { transform: translateX(200%); }
//   }
//   @keyframes glow {
//     0% { opacity: 0; }
//     50% { opacity: 0.4; }
//     100% { opacity: 0; }
//   }
//   .animate-shimmer {
//     animation: shimmer 2s infinite linear;
//   }
//   .animate-glow {
//     animation: glow 1.5s ease-out;
//   }
//   :root {
//     --scale-effect: scale(1);
//   }
// `;
// document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

// export default ProgressBar;

// import React, { useEffect } from "react";
// import { CheckCircle, Pause, Play, XCircleIcon } from "lucide-react";
// import Button from "./Button";

// interface ProgressBarProps {
//   progress: number;
//   hasPausedFiles: boolean;
//   fileCount: number;
//   color?: string;
//   onPause?: () => void;
//   onResume?: () => void;
//   onCancel?: () => void;
//   className?: string;
//   onClose?: () => void;
// }

// const ProgressBar: React.FC<ProgressBarProps> = ({
//   progress,
//   hasPausedFiles,
//   fileCount,
//   color = "bg-gradient-to-r from-blue-400 to-indigo-500",
//   onPause,
//   onResume,
//   onCancel,
//   className = "",
//   onClose,
// }) => {
//   const isComplete = progress === 100;

//   useEffect(() => {
//     if (isComplete) {
//       // No additional state management needed here
//     }
//   }, [isComplete]);

//   const handleAction = (action?: () => void) => {
//     action?.();
//     document.documentElement.style.setProperty("--scale-effect", "scale(0.95)");
//     setTimeout(() => {
//       document.documentElement.style.setProperty("--scale-effect", "scale(1)");
//     }, 100);
//   };

//   return (
//     <div
//       className={`group relative border rounded-md shadow-sm p-6 w-full space-y-3 ${className}`}
//     >
//       <div className="flex items-center justify-between mb-1">
//         <div className="flex items-center space-x-2">
//           <span className="text-sm font-medium text-gray-600">
//             {isComplete
//               ? "Terminé"
//               : `Uploading ${fileCount} file${fileCount !== 1 ? "s" : ""}...`}
//           </span>
//           {!isComplete && (
//             <span className="text-xs text-gray-400">{progress}%</span>
//           )}
//         </div>
//         {isComplete ? (
//           <CheckCircle className="text-emerald-500 w-5 h-5" />
//         ) : (
//           <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//             <Button
//               onClick={() => handleAction(hasPausedFiles ? onResume : onPause)}
//               className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//             >
//               {hasPausedFiles ? (
//                 <Play className="w-4 h-4" />
//               ) : (
//                 <Pause className="w-4 h-4" />
//               )}
//             </Button>
//             <Button
//               onClick={() => handleAction(onCancel)}
//               className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//             >
//               <XCircleIcon className="w-4 h-4" />
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
//         <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-blue-100 to-indigo-100" />
//         <div
//           className={`absolute inset-y-0 left-0 ${color} rounded-full transition-all duration-500 ease-out`}
//           style={{ width: `${progress}%`, minWidth: "0.25rem" }}
//         >
//           {!isComplete && (
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-shimmer" />
//           )}
//         </div>
//         {isComplete && (
//           <div className="absolute inset-0 animate-glow opacity-0 bg-gradient-to-r from-emerald-200/50 to-transparent" />
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = `
//   @keyframes shimmer {
//     0% { transform: translateX(-100%); }
//     100% { transform: translateX(200%); }
//   }
//   @keyframes glow {
//     0% { opacity: 0; }
//     50% { opacity: 0.4; }
//     100% { opacity: 0; }
//   }
//   .animate-shimmer {
//     animation: shimmer 2s infinite linear;
//   }
//   .animate-glow {
//     animation: glow 1.5s ease-out;
//   }
//   :root {
//     --scale-effect: scale(1);
//   }
// `;
// document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

// export default ProgressBar;

import React, { useEffect } from "react";
import { CheckCircle, Pause, Play, XCircleIcon } from "lucide-react";
import Button from "./Button";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

interface ProgressBarProps {
  progress: number;
  hasPausedFiles: boolean;
  fileCount: number;
  color?: string;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  className?: string;
  onClose?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  hasPausedFiles,
  fileCount,
  color = "bg-gradient-to-r from-blue-400 to-indigo-500",
  onPause,
  onResume,
  onCancel,
  className = "",
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const isComplete = progress === 100;

  if (process.env.NODE_ENV === "development") {
    console.log(
      "ProgressBar: Current language:",
      i18n.language,
      "Direction:",
      isRtl ? "rtl" : "ltr"
    );
  }

  useEffect(() => {
    if (isComplete) {
      // No additional state management needed here
    }
  }, [isComplete]);

  const handleAction = (action?: () => void) => {
    action?.();
    document.documentElement.style.setProperty("--scale-effect", "scale(0.95)");
    setTimeout(() => {
      document.documentElement.style.setProperty("--scale-effect", "scale(1)");
    }, 100);
  };

  return (
    <div
      className={clsx(
        "group relative border rounded-md shadow-sm p-6 w-full space-y-3",
        isRtl ? "font-arabic" : "Inter",
        className
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        className={clsx(
          "flex items-center justify-between mb-1"
          // isRtl ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={clsx(
            "flex items-center gap-2"
            // isRtl ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-sm font-medium text-gray-600">
            {isComplete
              ? t("progressBar.complete")
              : t("progressBar.uploading", {
                  count: fileCount,
                  plural: fileCount !== 1 ? "s" : "",
                })}
          </span>
          {!isComplete && (
            <span className="text-xs text-gray-400">{progress}%</span>
          )}
        </div>
        {isComplete ? (
          <CheckCircle className="text-emerald-500 w-5 h-5" />
        ) : (
          <div
            className={clsx(
              "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              // isRtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Button
              onClick={() => handleAction(hasPausedFiles ? onResume : onPause)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label={
                hasPausedFiles
                  ? t("progressBar.resume")
                  : t("progressBar.pause")
              }
            >
              {hasPausedFiles ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={() => handleAction(onCancel)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label={t("progressBar.cancel")}
            >
              <XCircleIcon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-blue-100 to-indigo-100" />
        <div
          className={clsx(
            "absolute inset-y-0",
            isRtl ? "right-0" : "left-0",
            color,
            "rounded-full transition-all duration-500 ease-out"
          )}
          style={{ width: `${progress}%`, minWidth: "0.25rem" }}
        >
          {!isComplete && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-shimmer" />
          )}
        </div>
        {isComplete && (
          <div className="absolute inset-0 animate-glow opacity-0 bg-gradient-to-r from-emerald-200/50 to-transparent" />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
