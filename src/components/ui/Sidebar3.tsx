import { FC, ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronDown } from "lucide-react";
// import Tooltip from "./Tooltip3";
import Logo from "./Logo";
import logoImg from "../../assets/k2-02.svg";
import logoImgAr from "../../assets/k1-01.svg";
import { useTranslation } from "react-i18next";

interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

interface SidebarItem {
  name: string;
  path: string;
  icon: ReactNode;
  roles?: string[];
  children?: { name: string; path: string }[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  groups?: SidebarGroup[];
  isLoading?: boolean;
  footer?: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({
  isOpen,
  onToggle,
  groups = [],
  isLoading,
  footer,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    window.ResizeObserver = ResizeObserver;
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={clsx(
        "min-h-screen inset-y-0 left-0 z-30 bg-background bg-gray-50 shadow-[2px_0_3px_-1px_rgba(0,0,0,0.1)]",
        "flex flex-col transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header */}
      <div className="relative">
        {isOpen ? (
          <div className="">
            <Logo>
              <img
                src={isRtl ? logoImgAr : logoImg}
                className="h-24"
                alt="logo"
              />
            </Logo>
          </div>
        ) : (
          <button
            onClick={() => onToggle(true)}
            className="mx-auto rounded p-1 shrink-0"
          >
            <Logo>
              <img
                src={isRtl ? logoImgAr : logoImg}
                className="h-16"
                alt="logo"
              />
            </Logo>
          </button>
        )}
        {/* <button
          onClick={() => onToggle(!isOpen)}
          className=" rounded p-1.5 absolute top-50 -right-6"
        >
          {isOpen ? (
            <ArrowLeftFromLine className="h-4 w-4" />
          ) : (
            <ArrowRightFromLine className="h-4 w-4" />
          )}
        </button> */}
      </div>

      {/* Navigation Groups */}
      <nav
        className="flex-1 overflow-y-auto p-2"
        style={{ overflowAnchor: "none" }}
      >
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          groups.map((group, index) => (
            <div key={index} className="mb-4">
              {group.title && isOpen && (
                <h3 className="px-3 text-[11px] text-gray-500 font-light uppercase text-muted-foreground mb-2">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <div>
                        <button
                          className={clsx(
                            "flex items-center w-full px-3 py-2 rounded-md transition-colors",
                            "hover:bg-accent text-sm text-gray-800",
                            isActive(item.path) && "bg-primary/10 text-primary"
                          )}
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === item.name ? null : item.name
                            )
                          }
                        >
                          <span className="flex items-center justify-center w-6">
                            {item.icon}
                          </span>
                          {isOpen && (
                            <>
                              <span className="ml-2 truncate">{item.name}</span>
                              <ChevronDown
                                className={clsx(
                                  "ml-auto h-4 w-4 transition-transform",
                                  openDropdown === item.name && "rotate-180"
                                )}
                              />
                            </>
                          )}
                        </button>
                        {openDropdown === item.name && isOpen && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.children.map((child) => (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                end
                                className={({ isActive }) =>
                                  clsx(
                                    "flex items-center text-gray-800  px-3 py-1.5 rounded-md text-sm ",
                                    "transition-colors  hover:bg-accent",
                                    isActive
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  )
                                }
                              >
                                <span className="truncate">{child.name}</span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/dashboard"}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center px-3 py-2 rounded-md  text-sm text-gray-800 ",
                            "transition-colors hover:bg-accent",
                            isActive
                              ? "bg-primary/10 text-primary shadow-md"
                              : "text-muted-foreground"
                          )
                        }
                      >
                        <span className="flex items-center justify-center w-6">
                          {item.icon}
                        </span>
                        {isOpen && (
                          <span className="ml-2 truncate">{item.name}</span>
                        )}
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </nav>

      {/* Customizable Footer */}
      {footer && <div className="p-2">{footer}</div>}
    </aside>
  );
};

export default Sidebar;
