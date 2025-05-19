import clsx from "clsx";
import { ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

export const FormField = ({
  label,
  htmlFor,
  error,
  children,
  className,
}: FormFieldProps) => (
  <div className={clsx("w-full", className)}>
    <label
      htmlFor={htmlFor}
      className="block text-sm font-light  text-gray-600 mb-1"
    >
      {label}
    </label>
    {children}
    {error && (
      <div className="flex items-center text-red-600 text-sm mt-1">
        <FiAlertCircle className="mr-1" />
        <span>{error}</span>
      </div>
    )}
  </div>
);
