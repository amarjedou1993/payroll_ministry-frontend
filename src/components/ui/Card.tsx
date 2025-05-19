import { EllipsisIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ReactNode, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

// Main Card Component
const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={clsx(
        "bg-white rounded-lg shadow-md border border-gray-200",
        isRtl ? "font-arabic" : "Inter",
        className
      )}
    >
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div
      className={clsx(
        "flex items-center justify-between px-4 py-2 border-b border-gray-200",
        isRtl ? "font-arabic" : "Inter",
        className
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
};

// Card Title Component
const CardTitle = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <h3
      className={clsx(
        "text-sm text-gray-900",
        isRtl ? "font-arabic text-start" : "Inter text-start",
        className
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {children}
    </h3>
  );
};

// Card Content Component
const CardContent = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div
      className={clsx("p-4", isRtl ? "font-arabic" : "Inter", className)}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
};

// Card Footer Component
const CardFooter = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div
      className={clsx(
        "p-4 border-t border-gray-200",
        isRtl ? "font-arabic" : "Inter",
        className
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
};

// Card Menu Component
const CardMenu = ({
  items,
  align = "right",
  className = "",
}: {
  items: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    disabled?: boolean;
  }[];
  align?: "left" | "right";
  className?: string;
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Adjust menu alignment based on direction
  const menuAlign = isRtl
    ? align === "right"
      ? "left-0"
      : "right-0"
    : align === "right"
    ? "right-0"
    : "left-0";

  return (
    <div className={clsx("relative", className)} ref={menuRef}>
      <button
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={clsx(
          "p-1 hover:bg-gray-100 rounded-full",
          isRtl ? "font-arabic" : "Inter"
        )}
        aria-label={i18n.t("openMenu", { defaultValue: "Open menu" })}
      >
        <EllipsisIcon strokeWidth={1} className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <div
          className={clsx(
            "absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-10",
            menuAlign,
            isRtl ? "font-arabic" : "Inter"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                item.onClick();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={clsx(
                "w-full px-4 py-2 text-sm text-start flex items-center gap-2",
                item.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100",
                isRtl ? "font-arabic" : "Inter"
              )}
            >
              {item.icon && <span className="h-4 w-4">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Attach sub-components to main Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Menu = CardMenu;

export default Card;
