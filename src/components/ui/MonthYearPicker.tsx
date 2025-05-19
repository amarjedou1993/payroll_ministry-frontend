// import { useState, useEffect } from "react";
// import Select from "./Select";

// interface MonthYearPickerProps {
//   value?: Date | null;
//   onChange: (value: Date | null) => void;
//   className?: string;
//   yearRange?: [number, number];
// }

// const months = [
//   { label: "January", value: "0" },
//   { label: "February", value: "1" },
//   { label: "March", value: "2" },
//   { label: "April", value: "3" },
//   { label: "May", value: "4" },
//   { label: "June", value: "5" },
//   { label: "July", value: "6" },
//   { label: "August", value: "7" },
//   { label: "September", value: "8" },
//   { label: "October", value: "9" },
//   { label: "November", value: "10" },
//   { label: "December", value: "11" },
// ];

// const MonthYearPicker = ({
//   value,
//   onChange,
//   className = "",
//   yearRange = [2000, new Date().getFullYear() + 5],
// }: MonthYearPickerProps) => {
//   const [year, setYear] = useState<number>(
//     value?.getFullYear() || new Date().getFullYear()
//   );
//   const [month, setMonth] = useState<number>(
//     value?.getMonth() || new Date().getMonth()
//   );

//   useEffect(() => {
//     if (value) {
//       setYear(value.getFullYear());
//       setMonth(value.getMonth());
//     }
//   }, [value]);

//   const handleChange = (newYear: number, newMonth: number) => {
//     const newDate = new Date(newYear, newMonth);
//     onChange(newDate);
//   };

//   const years = Array.from(
//     { length: yearRange[1] - yearRange[0] + 1 },
//     (_, i) => ({
//       label: (yearRange[0] + i).toString(),
//       value: (yearRange[0] + i).toString(),
//     })
//   );

//   // Add null handling

//   // Add clear functionality
//   const clearSelection = () => {
//     onChange(null);
//     setYear(new Date().getFullYear());
//     setMonth(new Date().getMonth());
//   };

//   return (
//     <div className={`flex gap-2 ${className}`}>
//       <Select
//         options={months}
//         value={value ? month.toString() : ""}
//         onChange={(val) => {
//           console.log(val);
//           if (!val) {
//             clearSelection();
//             return;
//           }
//           const newMonth = parseInt(val as string);
//           setMonth(newMonth);
//           handleChange(year, newMonth);
//         }}
//         placeholder="Month"
//       />
//       <Select
//         options={years}
//         value={value ? year.toString() : ""}
//         onChange={(val) => {
//           console.log(val);
//           if (!val) {
//             clearSelection();
//             return;
//           }
//           const newYear = parseInt(val as string);
//           setYear(newYear);
//           handleChange(newYear, month);
//         }}
//         placeholder="Year"
//       />
//     </div>
//   );
// };

// export default MonthYearPicker;

// import { useState, useEffect } from "react";
// import Select from "./Select";

// interface MonthYearPickerProps {
//   value?: Date | null;
//   onChange: (value: Date | null) => void;
//   className?: string;
//   yearRange?: [number, number];
// }

// const months = [
//   { label: "January", value: "0" },
//   { label: "February", value: "1" },
//   { label: "March", value: "2" },
//   { label: "April", value: "3" },
//   { label: "May", value: "4" },
//   { label: "June", value: "5" },
//   { label: "July", value: "6" },
//   { label: "August", value: "7" },
//   { label: "September", value: "8" },
//   { label: "October", value: "9" },
//   { label: "November", value: "10" },
//   { label: "December", value: "11" },
// ];

// const MonthYearPicker = ({
//   value,
//   onChange,
//   className = "",
//   yearRange = [2000, new Date().getFullYear() + 5],
// }: MonthYearPickerProps) => {
//   const [year, setYear] = useState<number>(new Date().getFullYear());
//   const [month, setMonth] = useState<number>(new Date().getMonth());

//   useEffect(() => {
//     if (value) {
//       setYear(value.getFullYear());
//       setMonth(value.getMonth());
//     }
//   }, [value]);

//   const handleChange = (newYear: number, newMonth: number) => {
//     const newDate = new Date(newYear, newMonth);
//     onChange(newDate);
//   };

//   const years = Array.from(
//     { length: yearRange[1] - yearRange[0] + 1 },
//     (_, i) => ({
//       label: (yearRange[0] + i).toString(),
//       value: (yearRange[0] + i).toString(),
//     })
//   );

//   const clearSelection = () => {
//     onChange(null);
//     setYear(new Date().getFullYear());
//     setMonth(new Date().getMonth());
//   };

//   return (
//     <div className={`flex gap-2 ${className}`}>
//       <Select
//         options={months}
//         value={value ? month.toString() : ""}
//         onChange={(val) => {
//           if (!val) {
//             clearSelection();
//             return;
//           }
//           const newMonth = parseInt(val as string);
//           setMonth(newMonth);
//           handleChange(year, newMonth);
//         }}
//         placeholder="Month"
//       />
//       <Select
//         options={years}
//         value={value ? year.toString() : ""}
//         onChange={(val) => {
//           if (!val) {
//             clearSelection();
//             return;
//           }
//           const newYear = parseInt(val as string);
//           setYear(newYear);
//           handleChange(newYear, month);
//         }}
//         placeholder="Year"
//       />
//     </div>
//   );
// };

// export default MonthYearPicker;

// import { useState, useEffect } from "react";
// import { Listbox, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "lucide-react";

// interface MonthYearPickerProps {
//   value?: Date | null;
//   onChange: (value: Date | null) => void;
//   className?: string;
//   yearRange?: [number, number];
// }

// const months = [
//   { label: "Janvier", value: 0 },
//   { label: "Février", value: 1 },
//   { label: "Mars", value: 2 },
//   { label: "Avril", value: 3 },
//   { label: "Mai", value: 4 },
//   { label: "Juin", value: 5 },
//   { label: "Juillet", value: 6 },
//   { label: "Août", value: 7 },
//   { label: "Septembre", value: 8 },
//   { label: "Octobre", value: 9 },
//   { label: "Novembre", value: 10 },
//   { label: "Décembre", value: 11 },
// ];

// const MonthYearPicker = ({
//   value,
//   onChange,
//   className = "",
//   yearRange = [2000, new Date().getFullYear() + 5],
// }: MonthYearPickerProps) => {
//   const [selectedMonth, setSelectedMonth] = useState<number | null>(
//     value ? value.getMonth() : null
//   );
//   const [selectedYear, setSelectedYear] = useState<number | null>(
//     value ? value.getFullYear() : null
//   );

//   useEffect(() => {
//     if (value) {
//       setSelectedMonth(value.getMonth());
//       setSelectedYear(value.getFullYear());
//     } else {
//       setSelectedMonth(null);
//       setSelectedYear(null);
//     }
//   }, [value]);

//   const years = Array.from(
//     { length: yearRange[1] - yearRange[0] + 1 },
//     (_, i) => ({
//       label: yearRange[0] + i,
//       value: yearRange[0] + i,
//     })
//   );

//   const handleSelectionChange = (month: number | null, year: number | null) => {
//     if (month !== null && year !== null) {
//       const newDate = new Date(year, month);
//       onChange(newDate);
//     } else {
//       onChange(null);
//     }
//   };

//   // const clearSelection = () => {
//   //   setSelectedMonth(null);
//   //   setSelectedYear(null);
//   //   onChange(null);
//   // };

//   return (
//     <div className={`flex items-center space-x-4 ${className}`}>
//       {/* Month Picker */}
//       <Listbox
//         value={selectedMonth}
//         onChange={(val) => {
//           setSelectedMonth(val);
//           handleSelectionChange(val, selectedYear);
//         }}
//       >
//         {({ open }) => (
//           <div className="relative">
//             <Listbox.Button className="flex items-center w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
//               <span className="flex-1 text-left">
//                 {selectedMonth !== null ? months[selectedMonth].label : "Mois"}
//               </span>
//               <ChevronDownIcon
//                 className={`w-5 h-5 ml-2 text-gray-500 transition-transform duration-200 ${
//                   open ? "rotate-180" : ""
//                 }`}
//               />
//             </Listbox.Button>
//             <Transition
//               show={open}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
//                 {months.map((month) => (
//                   <Listbox.Option
//                     key={month.value}
//                     value={month.value}
//                     className={({ active }) =>
//                       `cursor-pointer select-none relative py-2 px-4 text-sm ${
//                         active
//                           ? "bg-green-100 text-green-900"
//                           : "text-gray-900"
//                       }`
//                     }
//                   >
//                     {month.label}
//                   </Listbox.Option>
//                 ))}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         )}
//       </Listbox>

//       {/* Year Picker */}
//       <Listbox
//         value={selectedYear}
//         onChange={(val) => {
//           setSelectedYear(val);
//           handleSelectionChange(selectedMonth, val);
//         }}
//       >
//         {({ open }) => (
//           <div className="relative">
//             <Listbox.Button className="flex items-center w-28 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
//               <span className="flex-1 text-left">
//                 {selectedYear !== null ? selectedYear : "Année"}
//               </span>
//               <ChevronDownIcon
//                 className={`w-5 h-5 ml-2 text-gray-500 transition-transform duration-200 ${
//                   open ? "rotate-180" : ""
//                 }`}
//               />
//             </Listbox.Button>
//             <Transition
//               show={open}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
//                 {years.map((year) => (
//                   <Listbox.Option
//                     key={year.value}
//                     value={year.value}
//                     className={({ active }) =>
//                       `cursor-pointer select-none relative py-2 px-4 text-sm ${
//                         active
//                           ? "bg-green-100 text-green-900"
//                           : "text-gray-900"
//                       }`
//                     }
//                   >
//                     {year.label}
//                   </Listbox.Option>
//                 ))}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         )}
//       </Listbox>

//       {/* Clear Button */}
//       {/* {(selectedMonth !== null || selectedYear !== null) && (
//         <button
//           onClick={clearSelection}
//           className="flex items-center justify-center  rounded-full text-gray-500 hover:text-red-600 transition-all duration-200"
//           title="Effacer la sélection"
//         >
//           <XCircleIcon className="w-5 h-5" />
//         </button>
//       )} */}
//     </div>
//   );
// };

// export default MonthYearPicker;

// Responsive
// import { useState, useEffect } from "react";
// import { Listbox, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "lucide-react";

// interface MonthYearPickerProps {
//   value?: Date | null;
//   onChange: (value: Date | null) => void;
//   className?: string;
//   yearRange?: [number, number];
// }

// const months = [
//   { label: "Janvier", value: 0 },
//   { label: "Février", value: 1 },
//   { label: "Mars", value: 2 },
//   { label: "Avril", value: 3 },
//   { label: "Mai", value: 4 },
//   { label: "Juin", value: 5 },
//   { label: "Juillet", value: 6 },
//   { label: "Août", value: 7 },
//   { label: "Septembre", value: 8 },
//   { label: "Octobre", value: 9 },
//   { label: "Novembre", value: 10 },
//   { label: "Décembre", value: 11 },
// ];

// const MonthYearPicker = ({
//   value,
//   onChange,
//   className = "",
//   yearRange = [2000, new Date().getFullYear() + 5],
// }: MonthYearPickerProps) => {
//   const [selectedMonth, setSelectedMonth] = useState<number | null>(
//     value ? value.getMonth() : null
//   );
//   const [selectedYear, setSelectedYear] = useState<number | null>(
//     value ? value.getFullYear() : null
//   );

//   useEffect(() => {
//     if (value) {
//       setSelectedMonth(value.getMonth());
//       setSelectedYear(value.getFullYear());
//     } else {
//       setSelectedMonth(null);
//       setSelectedYear(null);
//     }
//   }, [value]);

//   const years = Array.from(
//     { length: yearRange[1] - yearRange[0] + 1 },
//     (_, i) => ({
//       label: yearRange[0] + i,
//       value: yearRange[0] + i,
//     })
//   );

//   const handleSelectionChange = (month: number | null, year: number | null) => {
//     if (month !== null && year !== null) {
//       const newDate = new Date(year, month);
//       onChange(newDate);
//     } else {
//       onChange(null);
//     }
//   };

//   return (
//     <div
//       className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 ${className}`}
//     >
//       {/* Month Picker */}
//       <Listbox
//         value={selectedMonth}
//         onChange={(val) => {
//           setSelectedMonth(val);
//           handleSelectionChange(val, selectedYear);
//         }}
//       >
//         {({ open }) => (
//           <div className="relative w-full sm:w-40">
//             <Listbox.Button className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
//               <span className="flex-1 text-left truncate">
//                 {selectedMonth !== null ? months[selectedMonth].label : "Mois"}
//               </span>
//               <ChevronDownIcon
//                 className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 text-gray-500 transition-transform duration-200 ${
//                   open ? "rotate-180" : ""
//                 }`}
//               />
//             </Listbox.Button>
//             <Transition
//               show={open}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
//                 {months.map((month) => (
//                   <Listbox.Option
//                     key={month.value}
//                     value={month.value}
//                     className={({ active }) =>
//                       `cursor-pointer select-none relative py-2 px-3 sm:px-4 text-xs sm:text-sm ${
//                         active
//                           ? "bg-green-100 text-green-900"
//                           : "text-gray-900"
//                       }`
//                     }
//                   >
//                     {month.label}
//                   </Listbox.Option>
//                 ))}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         )}
//       </Listbox>

//       {/* Year Picker */}
//       <Listbox
//         value={selectedYear}
//         onChange={(val) => {
//           setSelectedYear(val);
//           handleSelectionChange(selectedMonth, val);
//         }}
//       >
//         {({ open }) => (
//           <div className="relative w-full sm:w-28">
//             <Listbox.Button className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
//               <span className="flex-1 text-left truncate">
//                 {selectedYear !== null ? selectedYear : "Année"}
//               </span>
//               <ChevronDownIcon
//                 className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 text-gray-500 transition-transform duration-200 ${
//                   open ? "rotate-180" : ""
//                 }`}
//               />
//             </Listbox.Button>
//             <Transition
//               show={open}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
//                 {years.map((year) => (
//                   <Listbox.Option
//                     key={year.value}
//                     value={year.value}
//                     className={({ active }) =>
//                       `cursor-pointer select-none relative py-2 px-3 sm:px-4 text-xs sm:text-sm ${
//                         active
//                           ? "bg-green-100 text-green-900"
//                           : "text-gray-900"
//                       }`
//                     }
//                   >
//                     {year.label}
//                   </Listbox.Option>
//                 ))}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         )}
//       </Listbox>
//     </div>
//   );
// };

// export default MonthYearPicker;

// Responsive 02
// import { useState, useEffect } from "react";
// import { Listbox, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "lucide-react";

// interface MonthYearPickerProps {
//   value?: Date | null;
//   onChange: (value: Date | null) => void;
//   className?: string;
//   yearRange?: [number, number];
// }

// const months = [
//   { label: "Janvier", value: 0 },
//   { label: "Février", value: 1 },
//   { label: "Mars", value: 2 },
//   { label: "Avril", value: 3 },
//   { label: "Mai", value: 4 },
//   { label: "Juin", value: 5 },
//   { label: "Juillet", value: 6 },
//   { label: "Août", value: 7 },
//   { label: "Septembre", value: 8 },
//   { label: "Octobre", value: 9 },
//   { label: "Novembre", value: 10 },
//   { label: "Décembre", value: 11 },
// ];

// const MonthYearPicker = ({
//   value,
//   onChange,
//   className = "",
//   yearRange = [2000, new Date().getFullYear() + 5],
// }: MonthYearPickerProps) => {
//   const [selectedMonth, setSelectedMonth] = useState<number | null>(
//     value ? value.getMonth() : null
//   );
//   const [selectedYear, setSelectedYear] = useState<number | null>(
//     value ? value.getFullYear() : null
//   );

//   useEffect(() => {
//     if (value) {
//       setSelectedMonth(value.getMonth());
//       setSelectedYear(value.getFullYear());
//     } else {
//       setSelectedMonth(null);
//       setSelectedYear(null);
//     }
//   }, [value]);

//   const years = Array.from(
//     { length: yearRange[1] - yearRange[0] + 1 },
//     (_, i) => ({
//       label: yearRange[0] + i,
//       value: yearRange[0] + i,
//     })
//   );

//   const handleSelectionChange = (month: number | null, year: number | null) => {
//     if (month !== null && year !== null) {
//       const newDate = new Date(year, month);
//       onChange(newDate);
//     } else {
//       onChange(null);
//     }
//   };

//   return (
//     <div
//       className={`flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-1 sm:gap-4 ${className}`}
//     >
//       {/* Month Picker */}
//       <Listbox
//         value={selectedMonth}
//         onChange={(val) => {
//           setSelectedMonth(val);
//           handleSelectionChange(val, selectedYear);
//         }}
//       >
//         {({ open }) => (
//           <div className="relative w-full xs:w-32 sm:w-40">
//             <Listbox.Button className="flex items-center w-full px-3 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
//               <span className="flex-1 text-left truncate">
//                 {selectedMonth !== null ? months[selectedMonth].label : "Mois"}
//               </span>
//               <ChevronDownIcon
//                 className={`w-4 h-4 xs:w-5 xs:h-5 ml-2 text-gray-500 transition-transform duration-200 ${
//                   open ? "rotate-180" : ""
//                 }`}
//               />
//             </Listbox.Button>
//             <Transition
//               show={open}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
//                 {months.map((month) => (
//                   <Listbox.Option
//                     key={month.value}
//                     value={month.value}
//                     className={({ active }) =>
//                       `cursor-pointer select-none relative py-1.5 xs:py-2 px-3 text-xs xs:text-sm ${
//                         active ? "bg-green-100 text-green-900" : "text-gray-900"
//                       }`
//                     }
//                   >
//                     {month.label}
//                   </Listbox.Option>
//                 ))}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         )}
//       </Listbox>

//       {/* Year Picker */}
//       <Listbox
//         value={selectedYear}
//         onChange={(val) => {
//           setSelectedYear(val);
//           handleSelectionChange(selectedMonth, val);
//         }}
//       >
//         {({ open }) => (
//           <div className="relative w-full xs:w-28 sm:w-32">
//             <Listbox.Button className="flex items-center w-full px-3 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
//               <span className="flex-1 text-left truncate">
//                 {selectedYear !== null ? selectedYear : "Année"}
//               </span>
//               <ChevronDownIcon
//                 className={`w-4 h-4 xs:w-5 xs:h-5 ml-2 text-gray-500 transition-transform duration-200 ${
//                   open ? "rotate-180" : ""
//                 }`}
//               />
//             </Listbox.Button>
//             <Transition
//               show={open}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
//                 {years.map((year) => (
//                   <Listbox.Option
//                     key={year.value}
//                     value={year.value}
//                     className={({ active }) =>
//                       `cursor-pointer select-none relative py-1.5 xs:py-2 px-3 text-xs xs:text-sm ${
//                         active ? "bg-green-100 text-green-900" : "text-gray-900"
//                       }`
//                     }
//                   >
//                     {year.label}
//                   </Listbox.Option>
//                 ))}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         )}
//       </Listbox>
//     </div>
//   );
// };

// export default MonthYearPicker;

// With arabic
import { useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MonthYearPickerProps {
  value?: Date | null | undefined; // Allow undefined to match DataTable
  onChange: (value: Date | null) => void;
  className?: string;
  yearRange?: [number, number];
  placeholder?: string; // Add placeholder prop
}

const MonthYearPicker = ({
  value,
  onChange,
  className = "",
  yearRange = [2000, new Date().getFullYear() + 5],
  placeholder,
}: MonthYearPickerProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  // Use localized month names from i18n
  const months = (t("monthNames", { returnObjects: true }) as string[]).map(
    (label, value) => ({
      label,
      value,
    })
  );

  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    value ? value.getMonth() : null
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(
    value ? value.getFullYear() : null
  );

  useEffect(() => {
    if (value) {
      setSelectedMonth(value.getMonth());
      setSelectedYear(value.getFullYear());
    } else {
      setSelectedMonth(null);
      setSelectedYear(null);
    }
  }, [value]);

  const years = Array.from(
    { length: yearRange[1] - yearRange[0] + 1 },
    (_, i) => ({
      label: yearRange[0] + i,
      value: yearRange[0] + i,
    })
  );

  const handleSelectionChange = (month: number | null, year: number | null) => {
    if (month !== null && year !== null) {
      const newDate = new Date(year, month);
      onChange(newDate);
    } else {
      onChange(null);
    }
  };

  return (
    <div
      className={`flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-1 sm:gap-4 ${className}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Month Picker */}
      <Listbox
        value={selectedMonth}
        onChange={(val) => {
          setSelectedMonth(val);
          handleSelectionChange(val, selectedYear);
        }}
      >
        {({ open }) => (
          <div className="relative w-full xs:w-32 sm:w-40">
            <Listbox.Button
              className={`flex items-center w-full px-3 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              <span className="flex-1 truncate">
                {selectedMonth !== null
                  ? months[selectedMonth].label
                  : placeholder || t("dataTable.selectMonth")}
              </span>
              <ChevronDownIcon
                className={`w-4 h-4 xs:w-5 xs:h-5 ${
                  isRtl ? "mr-2" : "ml-2"
                } text-gray-500 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Listbox.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options
                className={`absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none ${
                  isRtl ? "text-right" : "text-left"
                }`}
              >
                {months.map((month) => (
                  <Listbox.Option
                    key={month.value}
                    value={month.value}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-1.5 xs:py-2 px-3 text-xs xs:text-sm ${
                        active ? "bg-green-100 text-green-900" : "text-gray-900"
                      }`
                    }
                  >
                    {month.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>

      {/* Year Picker */}
      <Listbox
        value={selectedYear}
        onChange={(val) => {
          setSelectedYear(val);
          handleSelectionChange(selectedMonth, val);
        }}
      >
        {({ open }) => (
          <div className="relative w-full xs:w-28 sm:w-32">
            <Listbox.Button
              className={`flex items-center w-full px-3 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              <span className="flex-1 truncate">
                {selectedYear !== null
                  ? selectedYear
                  : placeholder || t("dataTable.selectYear")}
              </span>
              <ChevronDownIcon
                className={`w-4 h-4 xs:w-5 xs:h-5 ${
                  isRtl ? "mr-2" : "ml-2"
                } text-gray-500 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Listbox.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options
                className={`absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none ${
                  isRtl ? "text-right" : "text-left"
                }`}
              >
                {years.map((year) => (
                  <Listbox.Option
                    key={year.value}
                    value={year.value}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-1.5 xs:py-2 px-3 text-xs xs:text-sm ${
                        active ? "bg-green-100 text-green-900" : "text-gray-900"
                      }`
                    }
                  >
                    {year.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default MonthYearPicker;
