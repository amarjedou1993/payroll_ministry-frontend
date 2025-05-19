import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  ChevronLeftCircleIcon,
  ChevronRightCircleIcon,
  Edit,
  Eye,
  FileUpIcon,
  FileDownIcon,
  PlusCircleIcon,
  SearchIcon,
  Square,
  Trash2,
  Loader2,
  FilterIcon,
  ChevronsUpDownIcon,
} from "lucide-react";
import Input from "../Input";
import Button from "../Button";
import Select from "../Select";
import MonthYearPicker from "../MonthYearPicker";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export interface ColumnDef<T> {
  key: string;
  header: string | ((t: (key: string) => string) => string);
  render?: (data: T) => React.ReactNode;
  accessor?: keyof T;
  sortable?: boolean;
  icon?: React.ReactNode;
  filterable?: boolean;
}

interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onAdd?: () => void;
  onView?: (item: T) => void;
  onDelete?: (item: T) => void;
  onEdit?: (item: T) => void;
  onExport?: () => void;
  onImport?: () => void;
  searchPlaceholder?: string;
  itemsPerPageOptions?: number[];
  getId: (item: T) => string;
  rowClassName?: (item: T) => string;
  bulkActions?: Array<{
    label: string;
    action: (selectedIds: string[]) => void;
    variant?: "primary" | "secondary" | "destructive" | "alert";
  }>;
  sortable?: boolean;
  onSortChange?: (sortBy: string, sortDirection: "asc" | "desc") => void;
  columnFilters?: Record<string, string>;
  onColumnFilterChange?: (columnKey: string, value: string) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (item: T) => void;
  expandableRows?: (item: T) => React.ReactNode;
  enableSearch?: boolean;
  availableFilters?: ("date" | "role")[];
  dateFilter?: Date | null;
  onDateFilterChange?: (date: Date | null) => void;
  roleFilter?: string;
  onRoleFilterChange?: (role: string | undefined) => void;
  pagination?: Pagination;
  onSearch?: (value: string | undefined) => void;
  searchValue?: string;
}

const DataTable = <T,>({
  data,
  columns,
  onAdd,
  onDelete,
  onEdit,
  onView,
  onExport,
  onImport,
  searchPlaceholder,
  itemsPerPageOptions = [5, 10, 20],
  getId,
  rowClassName,
  bulkActions = [],
  sortable = false,
  onSortChange,
  columnFilters = {},
  onColumnFilterChange,
  loading = false,
  emptyState,
  onRowClick,
  expandableRows,
  enableSearch = true,
  availableFilters = [],
  dateFilter: propDateFilter,
  onDateFilterChange,
  roleFilter: propRoleFilter,
  onRoleFilterChange,
  pagination,
  onSearch,
  searchValue = "",
}: DataTableProps<T>) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    pagination?.itemsPerPage || itemsPerPageOptions[0]
  );
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const dateFilter = propDateFilter;
  const roleFilter = propRoleFilter;

  useEffect(() => {
    setSearchQuery(searchValue);
  }, [searchValue]);

  const totalPages =
    pagination?.totalPages || Math.ceil(data.length / itemsPerPage);
  const totalItems = pagination?.totalItems || data.length;
  const effectiveCurrentPage = pagination?.currentPage || currentPage;
  const effectiveItemsPerPage = pagination?.itemsPerPage || itemsPerPage;

  const currentItems = pagination
    ? data
    : data.slice(
        (effectiveCurrentPage - 1) * effectiveItemsPerPage,
        effectiveCurrentPage * effectiveItemsPerPage
      );

  useEffect(() => {
    if (!pagination) setCurrentPage(1);
  }, [itemsPerPage, pagination]);

  useEffect(() => {
    if (!pagination) {
      const newTotalPages = Math.ceil(data.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages >= 1) {
        setCurrentPage(newTotalPages);
      }
    }
  }, [data.length, itemsPerPage, currentPage, pagination]);

  const handleDateChange = (date: Date | null) => {
    onDateFilterChange?.(date);
  };

  const handleRoleChange = (value: string | undefined) => {
    onRoleFilterChange?.(value);
  };

  const debouncedSearch = debounce((value: string) => {
    if (onSearch) onSearch(value || undefined);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showFilters &&
        filterDropdownRef.current &&
        filterButtonRef.current &&
        !filterDropdownRef.current.contains(event.target as Node) &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  const toggleAllRows = () => {
    setSelectedRows((prev) => {
      const allIds = data.map((item) => getId(item));
      return prev.length === allIds.length ? [] : allIds;
    });
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSort = (key: string) => {
    if (!sortable) return;
    const newDirection =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    if (onSortChange) onSortChange(key, newDirection);
    else setSortConfig({ key, direction: newDirection });
  };

  const handlePrevious = () => {
    if (pagination) pagination.onPageChange(effectiveCurrentPage - 1);
    else setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (pagination) pagination.onPageChange(effectiveCurrentPage + 1);
    else setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = Number(value);
    if (pagination) pagination.onItemsPerPageChange(newLimit);
    else {
      setItemsPerPage(newLimit);
      setCurrentPage(1);
    }
  };

  return (
    <div
      className={clsx(
        "bg-white shadow-xs relative",
        isRtl ? "font-arabic" : "Inter"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="py-3">
        <div
          className={clsx(
            "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2"
            // isRtl ? "flex-row-reverse" : "flex-row"
          )}
        >
          <div
            className={clsx(
              "flex items-center gap-2"
              // isRtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            {onAdd && (
              <Button
                className="text-sm flex items-center gap-1"
                onClick={onAdd}
              >
                <PlusCircleIcon size={16} /> {t("dataTable.add")}
              </Button>
            )}
            {onImport && (
              <Button
                variant="secondary"
                className="text-sm flex items-center gap-1"
                onClick={onImport}
              >
                <FileDownIcon size={16} /> {t("dataTable.import")}
              </Button>
            )}
            {onExport && (
              <Button
                variant="secondary"
                className="text-sm flex items-center gap-1"
                onClick={onExport}
              >
                <FileUpIcon size={16} /> {t("dataTable.export")}
              </Button>
            )}
            {bulkActions.length > 0 && selectedRows.length > 0 && (
              <div className={clsx("flex gap-2", isRtl ? "me-2" : "ms-2")}>
                {bulkActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "alert"}
                    className="flex items-center gap-1 border-none"
                    onClick={() => action.action(selectedRows)}
                  >
                    <AlertTriangle size={16} /> {action.label} (
                    {selectedRows.length})
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div
            className={clsx(
              "flex items-center gap-2 relative"
              // isRtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            {enableSearch && (
              <div className="relative w-full sm:w-96">
                <Input
                  id="datatable-search"
                  name="datatableSearch"
                  icon={
                    <SearchIcon
                      strokeWidth={1}
                      className="text-gray-400 h-5 w-5"
                    />
                  }
                  // iconPosition={isRtl ? "end" : "start"}
                  type="text"
                  placeholder={searchPlaceholder || t("dataTable.search")}
                  className="ps-10 pe-4 pt-2 pb-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            )}

            {availableFilters.length > 0 && (
              <div className="relative">
                <Button
                  ref={filterButtonRef}
                  variant="secondary"
                  className="flex items-center gap-1 text-sm font-light px-1.5"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FilterIcon size={16} strokeWidth={1} />
                  <span className="font-light">{t("dataTable.filters")}</span>
                </Button>

                {showFilters && (
                  <div
                    ref={filterDropdownRef}
                    className={clsx(
                      "absolute mt-2 w-64 bg-white shadow-lg rounded-lg p-4 border z-50",
                      isRtl ? "end-0" : "end-0"
                    )}
                  >
                    <div className="space-y-4">
                      {availableFilters.includes("date") && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {t("dataTable.date")}
                          </label>
                          <MonthYearPicker
                            value={dateFilter}
                            onChange={handleDateChange}
                            className="mt-1"
                            yearRange={[2018, 2030]}
                            // placeholder={t("dataTable.selectDate")}
                          />
                        </div>
                      )}

                      {availableFilters.includes("role") && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {t("dataTable.role")}
                          </label>
                          <Select
                            value={roleFilter || ""}
                            onChange={(value) => {
                              const selectedRole =
                                value === "" ? undefined : value;
                              handleRoleChange(
                                selectedRole as string | undefined
                              );
                            }}
                            options={[
                              { label: t("dataTable.roles"), value: "" },
                              { label: t("roles.Admin"), value: "Admin" },
                              { label: t("roles.Manager"), value: "Manager" },
                              { label: t("roles.Employee"), value: "Employee" },
                            ]}
                            placeholder={t("dataTable.selectRole")}
                            className="mt-1 block w-full"
                            multiple={false}
                          />
                        </div>
                      )}

                      <div
                        className={clsx(
                          "flex justify-end gap-2"
                          // isRtl ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <Button
                          variant="secondary"
                          onClick={() => {
                            handleDateChange(null);
                            handleRoleChange("");
                          }}
                        >
                          {t("dataTable.clear")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow-sm overflow-hidden rounded-lg border-l border-t border-r border-b border-gray-200">
        <table className="w-full divide-y divide-gray-100">
          <thead className="bg-gray-100">
            <tr>
              {expandableRows && <th className="w-8" />}
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-600 uppercase tracking-wider w-8">
                <button
                  onClick={toggleAllRows}
                  className="inline-flex items-center focus:outline-none"
                  aria-label={t("dataTable.toggleAllRows")}
                >
                  {selectedRows.length === data.length ? (
                    <CheckSquare className="h-4 w-4 text-green-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    "px-6 py-3 text-start text-xs font-semibold text-gray-700 uppercase tracking-wider",
                    column.sortable ? "cursor-pointer" : ""
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div
                    className={clsx(
                      "flex items-center gap-1"
                      // isRtl ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {typeof column.header === "function"
                      ? column.header(t)
                      : column.header}
                    {sortable && column.sortable && (
                      <span>
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronsUpDownIcon
                            className="hover:text-gray-600"
                            size={14}
                          />
                        )}
                      </span>
                    )}
                  </div>
                  {column.filterable && onColumnFilterChange && (
                    <input
                      type="text"
                      className="mt-1 block w-full text-xs border rounded p-1"
                      placeholder={t("dataTable.filterColumn", {
                        header:
                          typeof column.header === "function"
                            ? column.header(t)
                            : column.header,
                      })}
                      value={columnFilters[column.key] || ""}
                      onChange={(e) =>
                        onColumnFilterChange(column.key, e.target.value)
                      }
                    />
                  )}
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-6 py-3 text-start text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {t("dataTable.actions")}
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100 [&>tr:last-child]:border-b-0">
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (expandableRows !== undefined ? 3 : 2)
                  }
                  className="py-8 text-center"
                >
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (expandableRows !== undefined ? 3 : 2)
                  }
                  className="p-5 text-center"
                >
                  {emptyState}
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const itemId = getId(item);
                const isExpanded = expandedRows.has(itemId);
                const isSelected = selectedRows.includes(itemId);

                return (
                  <React.Fragment key={itemId}>
                    <tr
                      className={clsx(
                        rowClassName ? rowClassName(item) : "",
                        onRowClick ? "cursor-pointer hover:bg-gray-50" : "",
                        isSelected ? "bg-blue-50" : ""
                      )}
                      onClick={() => onRowClick?.(item)}
                    >
                      {expandableRows && (
                        <td className="px-2 py-4">
                          <button
                            onClick={() => toggleExpansion(itemId)}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label={
                              isExpanded
                                ? t("dataTable.collapseRow")
                                : t("dataTable.expandRow")
                            }
                          >
                            {isExpanded ? "▼" : isRtl ? "◄" : "▶"}
                          </button>
                        </td>
                      )}

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(itemId);
                          }}
                          className="focus:outline-none"
                          aria-label={t("dataTable.toggleRow")}
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-green-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </td>

                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-1.5 whitespace-nowrap text-sm text-gray-700 font-light"
                        >
                          <div
                            className={clsx(
                              "flex items-center gap-2"
                              // isRtl ? "flex-row-reverse" : "flex-row"
                            )}
                          >
                            {column.icon && (
                              <span className="text-gray-400">
                                {column.icon}
                              </span>
                            )}
                            {column.render
                              ? column.render(item)
                              : column.accessor
                              ? (item[column.accessor] as React.ReactNode)
                              : null}
                          </div>
                        </td>
                      ))}

                      {(onView || onEdit || onDelete) && (
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                          <div
                            className={clsx(
                              "flex items-center gap-4"
                              // isRtl ? "flex-row-reverse" : "flex-row"
                            )}
                          >
                            {onView && (
                              <Button
                                variant="secondary"
                                className="pt-1.5 pb-1.5 ps-1.5 pe-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onView(item);
                                }}
                                aria-label={t("dataTable.view")}
                              >
                                <Eye size={18} />
                              </Button>
                            )}
                            {onEdit && (
                              <Button
                                variant="secondary"
                                className="pt-1.5 pb-1.5 ps-1.5 pe-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(item);
                                }}
                                aria-label={t("dataTable.edit")}
                              >
                                <Edit size={14} className="text-gray-800" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="secondary"
                                className="pt-1.5 pb-1.5 ps-1.5 pe-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(item);
                                }}
                                aria-label={t("dataTable.delete")}
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                    {expandableRows && isExpanded && (
                      <tr>
                        <td
                          colSpan={
                            columns.length +
                            (expandableRows !== undefined ? 3 : 2)
                          }
                        >
                          {expandableRows(item)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        className={clsx(
          "px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
          // isRtl ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={clsx(
            "flex items-center gap-2"
            // isRtl ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-sm text-gray-700 font-light">
            {t("dataTable.itemsPerPage")}
          </span>
          <div className="relative">
            <Select
              value={String(effectiveItemsPerPage)}
              onChange={(value) => {
                if (typeof value === "string") {
                  handleItemsPerPageChange(value);
                }
              }}
              options={itemsPerPageOptions.map((size) => ({
                label: String(size),
                value: String(size),
              }))}
              placeholder={t("dataTable.select")}
            />
          </div>
        </div>

        <div
          className={clsx(
            "flex items-center gap-6"
            // isRtl ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-sm font-light text-gray-700">
            {t("dataTable.pagination", {
              currentPage: effectiveCurrentPage,
              totalPages,
              count: totalItems,
            })}
          </span>
          <div
            className={clsx(
              "flex gap-1"
              // isRtl ? "flex-row-reverse" : "flex-row"
            )}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                if (effectiveCurrentPage > 1) handlePrevious();
              }}
              disabled={effectiveCurrentPage === 1}
              className="p-1.5 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label={t("dataTable.previous")}
              tabIndex={-1}
            >
              <ChevronLeftCircleIcon
                className={clsx(
                  "h-5 w-5 text-gray-600",
                  isRtl ? "transform rotate-180" : ""
                )}
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (effectiveCurrentPage < totalPages) handleNext();
              }}
              disabled={effectiveCurrentPage === totalPages}
              className="p-1.5 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label={t("dataTable.next")}
              tabIndex={-1}
            >
              <ChevronRightCircleIcon
                className={clsx(
                  "h-5 w-5 text-gray-600",
                  isRtl ? "transform rotate-180" : ""
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
