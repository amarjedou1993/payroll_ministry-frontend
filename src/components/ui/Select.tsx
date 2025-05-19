import React, { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import { FiChevronDown, FiX } from "react-icons/fi";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[] | undefined) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
  multiple?: boolean;
  clearable?: boolean;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      label,
      error,
      id,
      name,
      className,
      multiple = false,
      clearable = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const selectRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      setHighlightedIndex(isOpen ? 0 : -1);
    }, [isOpen]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(multiple ? [] : "");
      setIsOpen(false);
    };

    const handleSelect = (selectedValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValue = currentValues.includes(selectedValue)
          ? currentValues.filter((v) => v !== selectedValue)
          : [...currentValues, selectedValue];
        onChange(newValue);
        // Optional: Close dropdown after selection in multiple mode
        // setIsOpen(false);
      } else {
        onChange(selectedValue);
        setIsOpen(false);
      }
      // buttonRef.current?.focus();
      buttonRef.current?.focus({ preventScroll: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && isOpen && highlightedIndex !== -1) {
        handleSelect(options[highlightedIndex].value);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        // buttonRef.current?.focus();
        buttonRef.current?.focus({ preventScroll: true });
      } else if (e.key === "Home") {
        e.preventDefault();
        setHighlightedIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setHighlightedIndex(options.length - 1);
      }
    };

    const handleClickOutside = useCallback((e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // buttonRef.current?.focus();
        buttonRef.current?.focus({ preventScroll: true });
      }
    }, []);

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);

    const selectedLabels = Array.isArray(value)
      ? value.map((v) => options.find((opt) => opt.value === v)?.label)
      : options.find((opt) => opt.value === value)?.label;

    const displayValue = Array.isArray(selectedLabels)
      ? selectedLabels.filter(Boolean).join(", ")
      : selectedLabels;

    return (
      // <div className={clsx("w-full", className)} ref={ref}>
      <div className={clsx("", className)} ref={ref}>
        {label && (
          <label
            className="block text-sm font-light text-gray-700 mb-1"
            htmlFor="select-button"
          >
            {label}
          </label>
        )}
        <div className="relative" ref={selectRef}>
          <button
            type="button"
            id={id}
            name={name}
            className={clsx(
              "w-full flex items-center justify-between border font-light text-gray-700 rounded-md py-2 px-4 text-sm focus:outline-none transition",
              {
                "border-gray-300": !error,
                "border-red-500": error,
                "ring-2 ring-green-700": isOpen,
              }
            )}
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            ref={buttonRef}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls="select-listbox"
            aria-activedescendant={
              highlightedIndex !== -1 ? `option-${highlightedIndex}` : undefined
            }
          >
            <span className="truncate text-left">
              {displayValue || placeholder}
            </span>
            <div className="flex items-center gap-2 ml-2">
              {clearable && (value?.length > 0 || (value && !multiple)) && (
                <FiX
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={handleClear}
                  aria-label="Clear selection"
                />
              )}
              <FiChevronDown
                className={clsx("text-gray-500 transition-transform", {
                  "rotate-180": isOpen,
                })}
              />
            </div>
          </button>

          {isOpen && (
            <ul
              id="select-listbox"
              className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-auto"
              role="listbox"
              aria-labelledby="select-button"
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`option-${index}`}
                  className={clsx(
                    "px-4 py-2 cursor-pointer font-light text-sm hover:bg-gray-100",
                    {
                      "bg-gray-200":
                        (multiple &&
                          Array.isArray(value) &&
                          value.includes(option.value)) ||
                        (!multiple && value === option.value),
                      "bg-blue-100": highlightedIndex === index,
                    }
                  )}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={
                    (multiple &&
                      Array.isArray(value) &&
                      value.includes(option.value)) ||
                    (!multiple && value === option.value)
                  }
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
