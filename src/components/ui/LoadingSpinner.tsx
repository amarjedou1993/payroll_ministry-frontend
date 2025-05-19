import React from "react";
import clsx from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg"; // predefined sizes
  fullScreen?: boolean; // whether to show the spinner as a full-page overlay
  bgColor?: string; // background color for full-screen spinner
  className?: string; // Additional custom className for spinner
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  fullScreen = false,
  bgColor = "bg-white bg-opacity-75",
  className = "",
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        {
          "h-screen w-screen fixed inset-0 z-50": fullScreen,
          [bgColor]: fullScreen, // Custom background color for overlay
        },
        className
      )}
      role="status" // Screen reader-friendly
      aria-live="assertive" // Ensure screen reader announces loading state
      aria-label="Loading"
    >
      <svg
        className={clsx("animate-spin text-gray-600", sizes[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

export default Spinner;
