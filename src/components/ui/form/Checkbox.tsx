import clsx from "clsx";
import React, { forwardRef } from "react";
import { tv } from "tailwind-variants";

const checkbox = tv({
  base: "h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
  variants: {
    error: {
      true: "border-red-500 text-red-600 focus:ring-red-500",
    },
  },
});

type CheckboxProps = {
  label?: string;
  error?: boolean;
  containerClass?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, error = false, containerClass, ...props }, ref) => {
    // Generate unique id if not provided
    const uniqueId =
      id || `checkbox-${Math.random().toString(36).substring(2.9)}`;

    return (
      <div className={clsx("flex items-center gap-2", containerClass)}>
        <input
          ref={ref}
          type="checkbox"
          id={uniqueId}
          className={checkbox({ error, className })}
          {...props}
        />
        {label && (
          <label
            htmlFor={uniqueId}
            className={clsx(
              `block text-sm font-light text-gray-600 ${className}`
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
