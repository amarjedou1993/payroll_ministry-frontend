// import { cn } from "@/utils";
// import { useState, ReactNode, useRef, useEffect } from "react";

// interface DropdownProps {
//   trigger: ReactNode;
//   children: ReactNode;
//   className?: string;
//   position?: string;
// }

// export function Dropdown({ trigger, children, className }: DropdownProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
//         {trigger}
//       </div>
//       {isOpen && (
//         <div
//           className={cn(
//             "absolute left-[15rem] bottom-0 mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-lg p-2",
//             className
//           )}
//         >
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

import { cn } from "@/utils";
import { useState, ReactNode, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function Dropdown({
  trigger,
  children,
  className,
  position = "bottom-left",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Positioning logic
  const positionClasses = {
    "top-left": "bottom-full left-0 mb-2",
    "top-right": "bottom-full right-0 mb-2",
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2",
  };

  return (
    <div className="relative" ref={dropdownRef} tabIndex={-1}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute z-50 w-56 bg-white border border-gray-200 shadow-md rounded-lg p-2",
              positionClasses[position],
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
