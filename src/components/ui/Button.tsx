import { clsx } from "clsx";
import {
  ButtonHTMLAttributes,
  forwardRef,
  ForwardedRef,
  ReactNode,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "destructive" | "alert";
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, loading, className, variant = "primary", ...props },
    ref: ForwardedRef<HTMLButtonElement>
  ) => (
    <button
      ref={ref}
      className={clsx(
        "px-4 py-2 rounded-md font-light text-sm transition-colors",
        {
          "bg-green-700 text-white hover:bg-green-600": variant === "primary",
          "bg-white border hover:bg-gray-50": variant === "secondary",
          "bg-red-800 border hover:bg-red-700 text-white": variant === "alert",
          "opacity-50 cursor-not-allowed": props.disabled,
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
        </div>
      ) : (
        children
      )}
    </button>
  )
);

Button.displayName = "Button";

export default Button;
