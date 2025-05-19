// import { FC, ReactNode } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { CircleXIcon } from "lucide-react";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   children: ReactNode;
// }

// const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose} // Close when clicking outside
//         >
//           <motion.div
//             className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative"
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             transition={{ duration: 0.2, ease: "easeInOut" }}
//             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
//           >
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">
//                 {title || "Modal Title"}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 transition hover:text-gray-900 "
//               >
//                 <CircleXIcon strokeWidth={1.2} />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div>{children}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Modal;

// import { FC, ReactNode } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { CircleXIcon } from "lucide-react";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   children: ReactNode;
//   className?: string; // Add className prop
// }

// const Modal: FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   className,
// }) => {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//         >
//           <motion.div
//             className={`bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative ${
//               className || ""
//             }`}
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             transition={{ duration: 0.2, ease: "easeInOut" }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">
//                 {title || "Modal Title"}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-500 transition hover:text-gray-900"
//               >
//                 <CircleXIcon strokeWidth={1.2} />
//               </button>
//             </div>
//             <div>{children}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Modal;

import { FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleXIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative ${
              isRtl ? "font-arabic" : "Inter"
            } ${className || ""}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {title || t("modal.title")}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 transition hover:text-gray-900"
                aria-label={t("modal.close")}
              >
                <CircleXIcon strokeWidth={1.2} />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
