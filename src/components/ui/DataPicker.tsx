// DatePicker.tsx
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type DateGranularity = "year" | "month" | "day" | "full";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  granularity?: DateGranularity;
  className?: string;
  yearRange?: [number, number];
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DatePicker = ({
  value,
  onChange,
  granularity = "full",
  className = "",
  yearRange = [1900, new Date().getFullYear() + 10],
}: DatePickerProps) => {
  const [year, setYear] = useState<number>(
    value?.getFullYear() || new Date().getFullYear()
  );
  const [month, setMonth] = useState<number>(
    value?.getMonth() ?? new Date().getMonth()
  );
  const [day, setDay] = useState<number>(
    value?.getDate() || new Date().getDate()
  );

  useEffect(() => {
    if (value) {
      setYear(value.getFullYear());
      setMonth(value.getMonth());
      setDay(value.getDate());
    }
  }, [value]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateChange = (
    newYear: number,
    newMonth: number,
    newDay: number
  ) => {
    const finalDate = new Date(newYear, newMonth, newDay);
    onChange(finalDate);
  };

  // Generate year options
  const years = Array.from(
    { length: yearRange[1] - yearRange[0] + 1 },
    (_, i) => yearRange[0] + i
  );

  // Generate day options based on current month/year
  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  return (
    <div className={`flex gap-2 ${className}`}>
      {(granularity === "full" || granularity === "year") && (
        <div className="relative">
          <select
            value={year}
            onChange={(e) => {
              const newYear = parseInt(e.target.value);
              setYear(newYear);
              handleDateChange(newYear, month, day);
            }}
            className="appearance-none pl-3 pr-8 py-2 border rounded-md text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      )}

      {(granularity === "full" || granularity === "month") && (
        <div className="relative">
          <select
            value={month}
            onChange={(e) => {
              const newMonth = parseInt(e.target.value);
              setMonth(newMonth);
              handleDateChange(year, newMonth, day);
            }}
            className="appearance-none pl-3 pr-8 py-2 border rounded-md text-sm"
          >
            {months.map((m, index) => (
              <option key={m} value={index}>
                {m}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      )}

      {(granularity === "full" || granularity === "day") && (
        <div className="relative">
          <select
            value={day}
            onChange={(e) => {
              const newDay = parseInt(e.target.value);
              setDay(newDay);
              handleDateChange(year, month, newDay);
            }}
            className="appearance-none pl-3 pr-8 py-2 border rounded-md text-sm"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
