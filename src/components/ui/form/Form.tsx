import clsx from "clsx";
import { FormHTMLAttributes, forwardRef, ReactNode } from "react";

interface FormProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, onSubmit, className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        className={clsx("w-full space-y-4", className)}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = "Form";
export default Form;
