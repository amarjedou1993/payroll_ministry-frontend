import { FC, ReactNode, useState } from "react";
import clsx from "clsx";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 300,
}) => {
  const [visible, setVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => setVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div
          className={clsx(
            "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md shadow-md whitespace-nowrap",
            {
              "top-[-110%] left-1/2 -translate-x-1/2": position === "top",
              "bottom-[-110%] left-1/2 -translate-x-1/2": position === "bottom",
              "left-[-110%] top-1/2 -translate-y-1/2": position === "left",
              "right-[-110%] top-1/2 -translate-y-1/2": position === "right",
            }
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
