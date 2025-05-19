import { forwardRef } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import clsx from "clsx";

interface LinkProps extends RouterLinkProps {
  external?: boolean;
  className?: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, external, className, children, ...props }, ref) => {
    const baseClass =
      "text-blue-600 hover:underline transition-colors duration-200";

    if (external) {
      return (
        <a
          ref={ref}
          href={to as string}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(baseClass, className)}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <RouterLink
        ref={ref}
        to={to}
        className={clsx(baseClass, className)}
        {...props}
      >
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = "Link";
export default Link;
