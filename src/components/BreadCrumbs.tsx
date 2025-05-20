// // import {
// //   Link,
// //   useMatches,
// //   useLocation,
// //   useNavigation,
// //   UIMatch,
// // } from "react-router-dom";
// // import { Fragment, useMemo, useState, useEffect, memo } from "react";
// // import { cn } from "@/utils";
// // import { ChevronRightIcon } from "lucide-react";

// // type BreadcrumbHandle<Data = unknown> = {
// //   crumb?:
// //     | string
// //     | ((data: Data, params: Record<string, string | undefined>) => string)
// //     | ((
// //         data: Data,
// //         params: Record<string, string | undefined>
// //       ) => Promise<string>);
// // };

// // type EnterpriseBreadcrumbsProps = {
// //   className?: string;
// //   separator?: React.ReactNode;
// //   linkClass?: string;
// //   currentPageClass?: string;
// //   separatorClass?: string;
// //   loadingElement?: React.ReactNode;
// //   errorElement?: React.ReactNode;
// // };

// // const AsyncBreadcrumbPromise = ({
// //   promise,
// //   errorElement,
// //   loadingElement,
// // }: {
// //   promise: Promise<string>;
// //   errorElement: React.ReactNode;
// //   loadingElement: React.ReactNode;
// // }) => {
// //   const [result, setResult] = useState<string | null>(null);
// //   const [error, setError] = useState<React.ReactNode | null>(null);

// //   useEffect(() => {
// //     let isMounted = true;
// //     promise
// //       .then((res) => isMounted && setResult(res))
// //       .catch((err) => isMounted && setError(err));
// //     return () => {
// //       isMounted = false;
// //     };
// //   }, [promise]);

// //   if (error) return <>{errorElement}</>;
// //   return <>{result || loadingElement}</>;
// // };

// // const MemoizedCrumb = memo(
// //   ({
// //     crumb,
// //     isLast,
// //     isNavigating,
// //     linkClass,
// //     currentPageClass,
// //   }: {
// //     crumb: { pathname: string; label: React.ReactNode; isCurrent: boolean };
// //     isLast: boolean;
// //     isNavigating: boolean;
// //     linkClass: string;
// //     currentPageClass: string;
// //   }) => (
// //     <li>
// //       {isLast ? (
// //         <span
// //           className={cn(currentPageClass, { "opacity-50": isNavigating })}
// //           aria-current="page"
// //         >
// //           {crumb.label}
// //         </span>
// //       ) : (
// //         <Link
// //           to={crumb.pathname}
// //           className={cn(linkClass, {
// //             "pointer-events-none opacity-50": isNavigating,
// //           })}
// //         >
// //           {crumb.label}
// //         </Link>
// //       )}
// //     </li>
// //   )
// // );

// // export function EnterpriseBreadcrumbs({
// //   className,
// //   separator = <ChevronRightIcon className="h-4 w-4 mx-2" />,
// //   linkClass = "text-gray-500 hover:text-gray-700 transition-colors",
// //   currentPageClass = "text-gray-400",
// //   separatorClass = "text-gray-300",
// //   loadingElement = (
// //     <span className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
// //   ),
// //   errorElement = <span className="text-red-500">Error</span>,
// // }: EnterpriseBreadcrumbsProps) {
// //   const matches = useMatches() as UIMatch<unknown, BreadcrumbHandle>[];
// //   const location = useLocation();
// //   const navigation = useNavigation();

// //   const crumbs = useMemo(() => {
// //     return matches
// //       .filter((match) => match.handle?.crumb)
// //       .map((match) => {
// //         const { handle, data, pathname, params } = match;
// //         let label: React.ReactNode = pathname;

// //         if (typeof handle.crumb === "function") {
// //           try {
// //             const result = handle.crumb(
// //               data,
// //               Object.fromEntries(
// //                 Object.entries(params).filter(
// //                   ([_, value]) => value !== undefined
// //                 )
// //               ) as Record<string, string>
// //             );

// //             if (result instanceof Promise) {
// //               label = (
// //                 <AsyncBreadcrumbPromise
// //                   promise={result}
// //                   errorElement={errorElement}
// //                   loadingElement={loadingElement}
// //                 />
// //               );
// //             } else {
// //               label = result;
// //             }
// //           } catch (error) {
// //             console.error("Breadcrumb label error:", error);
// //             label = errorElement;
// //           }
// //         } else if (handle.crumb) {
// //           label = handle.crumb;
// //         }

// //         return {
// //           pathname,
// //           label,
// //           isCurrent: location.pathname === pathname,
// //         };
// //       });
// //   }, [matches, location.pathname, errorElement, loadingElement]);

// //   const memoizedSeparator = useMemo(
// //     () => (
// //       <li className={separatorClass} aria-hidden="true">
// //         {separator}
// //       </li>
// //     ),
// //     [separator, separatorClass]
// //   );

// //   if (crumbs.length <= 1) return null;

// //   return (
// //     <nav
// //       className={cn("flex items-center text-sm font-medium", className)}
// //       aria-label="Breadcrumb"
// //     >
// //       <ol className="flex items-center space-x-2">
// //         {crumbs.map((crumb, index) => {
// //           const isLast = index === crumbs.length - 1;
// //           const isNavigating = navigation.state === "loading";

// //           return (
// //             <Fragment key={`${crumb.pathname}-${index}`}>
// //               <MemoizedCrumb
// //                 crumb={crumb}
// //                 isLast={isLast}
// //                 isNavigating={isNavigating}
// //                 linkClass={linkClass}
// //                 currentPageClass={currentPageClass}
// //               />
// //               {!isLast && memoizedSeparator}
// //             </Fragment>
// //           );
// //         })}
// //       </ol>
// //     </nav>
// //   );
// // }

// // import {
// //   Link,
// //   useMatches,
// //   useLocation,
// //   UIMatch,
// //   useNavigation,
// // } from "react-router-dom";
// // import { Fragment, useMemo, useState, useEffect, memo } from "react";
// // import { cn } from "@/utils";
// // import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
// // import { useTranslation } from "react-i18next";

// // type BreadcrumbHandle<Data = unknown> = {
// //   crumb?:
// //     | string
// //     | ((data: Data, params: Record<string, string | undefined>) => string)
// //     | ((
// //         data: Data,
// //         params: Record<string, string | undefined>
// //       ) => Promise<string>);
// // };

// // type EnterpriseBreadcrumbsProps = {
// //   className?: string;
// //   separator?: React.ReactNode;
// //   linkClass?: string;
// //   currentPageClass?: string;
// //   separatorClass?: string;
// //   loadingElement?: React.ReactNode;
// //   errorElement?: React.ReactNode;
// // };

// // const AsyncBreadcrumbPromise = ({
// //   promise,
// //   errorElement,
// //   loadingElement,
// // }: {
// //   promise: Promise<string>;
// //   errorElement: React.ReactNode;
// //   loadingElement: React.ReactNode;
// // }) => {
// //   const [result, setResult] = useState<string | null>(null);
// //   const [error, setError] = useState<React.ReactNode | null>(null);

// //   useEffect(() => {
// //     let isMounted = true;
// //     promise
// //       .then((res) => isMounted && setResult(res))
// //       .catch((err) => isMounted && setError(err));
// //     return () => {
// //       isMounted = false;
// //     };
// //   }, [promise]);

// //   if (error) return <>{errorElement}</>;
// //   return <>{result || loadingElement}</>;
// // };

// // const MemoizedCrumb = memo(
// //   ({
// //     crumb,
// //     isLast,
// //     isNavigating,
// //     linkClass,
// //     currentPageClass,
// //   }: {
// //     crumb: { pathname: string; label: React.ReactNode; isCurrent: boolean };
// //     isLast: boolean;
// //     isNavigating: boolean;
// //     linkClass: string;
// //     currentPageClass: string;
// //   }) => (
// //     <li>
// //       {isLast ? (
// //         <span
// //           className={cn(currentPageClass, { "opacity-50": isNavigating })}
// //           aria-current="page"
// //         >
// //           {crumb.label}
// //         </span>
// //       ) : (
// //         <Link
// //           to={crumb.pathname}
// //           className={cn(linkClass, {
// //             "pointer-events-none opacity-50": isNavigating,
// //           })}
// //         >
// //           {crumb.label}
// //         </Link>
// //       )}
// //     </li>
// //   )
// // );

// // export function EnterpriseBreadcrumbs({
// //   className,
// //   separator,
// //   linkClass = "text-gray-500 hover:text-gray-700 transition-colors",
// //   currentPageClass = "text-gray-400",
// //   separatorClass = "text-gray-300",
// //   loadingElement = (
// //     <span className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
// //   ),
// //   errorElement,
// // }: EnterpriseBreadcrumbsProps) {
// //   const { t, i18n } = useTranslation();
// //   const isRtl = i18n.language === "ar";
// //   const matches = useMatches() as UIMatch<unknown, BreadcrumbHandle>[];
// //   const location = useLocation();
// //   const navigation = useNavigation();

// //   const resolvedErrorElement = errorElement || (
// //     <span className="text-red-500">{t("breadcrumbs.error")}</span>
// //   );

// //   const defaultSeparator = isRtl ? (
// //     <ChevronLeftIcon className="h-4 w-4 mx-2" />
// //   ) : (
// //     <ChevronRightIcon className="h-4 w-4 mx-2" />
// //   );

// //   const memoizedSeparator = useMemo(
// //     () => (
// //       <li className={separatorClass} aria-hidden="true">
// //         {separator || defaultSeparator}
// //       </li>
// //     ),
// //     [separator, defaultSeparator, separatorClass]
// //   );

// //   const crumbs = useMemo(() => {
// //     if (!location || !matches) {
// //       return [];
// //     }

// //     const crumbList = matches
// //       .filter((match) => match.handle?.crumb)
// //       .map((match) => {
// //         const { handle, data, pathname, params } = match;
// //         let label: React.ReactNode = pathname;

// //         if (typeof handle.crumb === "function") {
// //           try {
// //             const result = handle.crumb(
// //               data,
// //               Object.fromEntries(
// //                 Object.entries(params).filter(
// //                   ([_, value]) => value !== undefined
// //                 )
// //               ) as Record<string, string>
// //             );

// //             if (result instanceof Promise) {
// //               label = (
// //                 <AsyncBreadcrumbPromise
// //                   promise={result}
// //                   errorElement={resolvedErrorElement}
// //                   loadingElement={loadingElement}
// //                 />
// //               );
// //             } else {
// //               label = typeof result === "string" ? result : String(result);
// //             }
// //           } catch (error) {
// //             console.error("Breadcrumb label error:", error);
// //             label = resolvedErrorElement;
// //           }
// //         } else if (typeof handle.crumb === "string") {
// //           label = handle.crumb;
// //         } else {
// //           label = resolvedErrorElement;
// //         }

// //         return {
// //           pathname,
// //           label,
// //           isCurrent: location.pathname === pathname,
// //         };
// //       });

// //     return isRtl ? crumbList.reverse() : crumbList;
// //   }, [matches, location, resolvedErrorElement, loadingElement, isRtl]);

// //   if (crumbs.length <= 1) {
// //     return null;
// //   }

// //   return (
// //     <nav
// //       className={cn(
// //         "flex items-center text-sm font-medium",
// //         isRtl ? "font-arabic justify-end" : "Inter",
// //         className
// //       )}
// //       aria-label={t("breadcrumbs.ariaLabel")}
// //       dir={isRtl ? "rtl" : "ltr"}
// //     >
// //       <ol
// //         className={cn(
// //           "flex items-center",
// //           isRtl ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
// //         )}
// //       >
// //         {crumbs.map((crumb, index) => {
// //           const isLast = index === crumbs.length - 1;
// //           const isNavigating = navigation.state === "loading";

// //           return (
// //             <Fragment key={`${crumb.pathname}-${index}`}>
// //               <MemoizedCrumb
// //                 crumb={crumb}
// //                 isLast={isLast}
// //                 isNavigating={isNavigating}
// //                 linkClass={linkClass}
// //                 currentPageClass={currentPageClass}
// //               />
// //               {!isLast && memoizedSeparator}
// //             </Fragment>
// //           );
// //         })}
// //       </ol>
// //     </nav>
// //   );
// // }

// import {
//   Link,
//   useMatches,
//   useLocation,
//   useNavigation,
//   UIMatch,
// } from "react-router-dom";
// import { Fragment, useMemo, useState, useEffect, memo } from "react";
// import { cn } from "@/utils";
// import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
// import { useTranslation } from "react-i18next";

// type BreadcrumbHandle<Data = unknown> = {
//   crumb?:
//     | string
//     | ((data: Data, params: Record<string, string | undefined>) => string)
//     | ((
//         data: Data,
//         params: Record<string, string | undefined>
//       ) => Promise<string>);
// };

// type EnterpriseBreadcrumbsProps = {
//   className?: string;
//   separator?: React.ReactNode;
//   linkClass?: string;
//   currentPageClass?: string;
//   separatorClass?: string;
//   loadingElement?: React.ReactNode;
//   errorElement?: React.ReactNode;
// };

// const AsyncBreadcrumbPromise = ({
//   promise,
//   errorElement,
//   loadingElement,
// }: {
//   promise: Promise<string>;
//   errorElement: React.ReactNode;
//   loadingElement: React.ReactNode;
// }) => {
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<React.ReactNode | null>(null);

//   useEffect(() => {
//     let isMounted = true;
//     promise
//       .then((res) => isMounted && setResult(res))
//       .catch((err) => isMounted && setError(err));
//     return () => {
//       isMounted = false;
//     };
//   }, [promise]);

//   if (error) return <>{errorElement}</>;
//   return <>{result || loadingElement}</>;
// };

// const MemoizedCrumb = memo(
//   ({
//     crumb,
//     isLast,
//     isNavigating,
//     linkClass,
//     currentPageClass,
//   }: {
//     crumb: { pathname: string; label: React.ReactNode; isCurrent: boolean };
//     isLast: boolean;
//     isNavigating: boolean;
//     linkClass: string;
//     currentPageClass: string;
//   }) => (
//     <li>
//       {isLast ? (
//         <span
//           className={cn(currentPageClass, { "opacity-50": isNavigating })}
//           aria-current="page"
//         >
//           {crumb.label}
//         </span>
//       ) : (
//         <Link
//           to={crumb.pathname}
//           className={cn(linkClass, {
//             "pointer-events-none opacity-50": isNavigating,
//           })}
//         >
//           {crumb.label}
//         </Link>
//       )}
//     </li>
//   )
// );

// export function EnterpriseBreadcrumbs({
//   className,
//   separator,
//   linkClass = "text-gray-500 hover:text-gray-700 transition-colors",
//   currentPageClass = "text-gray-400",
//   separatorClass = "text-gray-300",
//   loadingElement = (
//     <span className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
//   ),
//   errorElement,
// }: EnterpriseBreadcrumbsProps) {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.language === "ar";
//   const matches = useMatches() as UIMatch<unknown, BreadcrumbHandle>[];
//   const location = useLocation();
//   const navigation = useNavigation();

//   // Stabilize resolvedErrorElement
//   const resolvedErrorElement = useMemo(
//     () =>
//       errorElement || (
//         <span className="text-red-500">{t("breadcrumbs.error")}</span>
//       ),
//     [errorElement, t]
//   );

//   // Stabilize defaultSeparator
//   const defaultSeparator = useMemo(
//     () =>
//       isRtl ? (
//         <ChevronLeftIcon className="h-4 w-4 mx-2" />
//       ) : (
//         <ChevronRightIcon className="h-4 w-4 mx-2" />
//       ),
//     [isRtl]
//   );

//   const memoizedSeparator = useMemo(
//     () => (
//       <li className={separatorClass} aria-hidden="true">
//         {separator || defaultSeparator}
//       </li>
//     ),
//     [separator, defaultSeparator, separatorClass]
//   );

//   const crumbs = useMemo(() => {
//     if (!location || !matches) {
//       return [];
//     }

//     const crumbList = matches
//       .filter((match) => match.handle?.crumb)
//       .map((match) => {
//         const { handle, data, pathname, params } = match;
//         let label: React.ReactNode = pathname;

//         if (typeof handle.crumb === "function") {
//           try {
//             const result = handle.crumb(
//               data,
//               Object.fromEntries(
//                 Object.entries(params).filter(
//                   ([_, value]) => value !== undefined
//                 )
//               ) as Record<string, string>
//             );

//             if (result instanceof Promise) {
//               label = (
//                 <AsyncBreadcrumbPromise
//                   promise={result}
//                   errorElement={resolvedErrorElement}
//                   loadingElement={loadingElement}
//                 />
//               );
//             } else {
//               label = typeof result === "string" ? result : String(result);
//             }
//           } catch (error) {
//             console.error("Breadcrumb label error:", error);
//             label = resolvedErrorElement;
//           }
//         } else if (typeof handle.crumb === "string") {
//           label = handle.crumb;
//         } else {
//           label = resolvedErrorElement;
//         }

//         return {
//           pathname,
//           label,
//           isCurrent: location.pathname === pathname,
//         };
//       });

//     return isRtl ? crumbList.reverse() : crumbList;
//   }, [matches, location, resolvedErrorElement, loadingElement, isRtl]);

//   if (crumbs.length <= 1) {
//     return null;
//   }

//   return (
//     <nav
//       className={cn(
//         "flex items-center text-sm font-medium",
//         isRtl ? "font-arabic " : "Inter",
//         className
//       )}
//       aria-label={t("breadcrumbs.ariaLabel")}
//       dir={isRtl ? "rtl" : "ltr"}
//     >
//       <ol
//         className={cn(
//           "flex items-center",
//           isRtl ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
//         )}
//       >
//         {crumbs.map((crumb, index) => {
//           const isLast = index === crumbs.length - 1;
//           const isNavigating = navigation.state === "loading";

//           return (
//             <Fragment key={`${crumb.pathname}-${index}`}>
//               <MemoizedCrumb
//                 crumb={crumb}
//                 isLast={isLast}
//                 isNavigating={isNavigating}
//                 linkClass={linkClass}
//                 currentPageClass={currentPageClass}
//               />
//               {!isLast && memoizedSeparator}
//             </Fragment>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// }

import { Link, useMatches, useLocation, useNavigation } from "react-router-dom";
import { Fragment, useMemo, memo } from "react";
import { cn } from "@/utils";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomRouteMatch } from "@/types/types";

type EnterpriseBreadcrumbsProps = {
  className?: string;
  separator?: React.ReactNode;
  linkClass?: string;
  currentPageClass?: string;
  separatorClass?: string;
  errorElement?: React.ReactNode;
};

const MemoizedCrumb = memo(
  ({
    crumb,
    isLast,
    isNavigating,
    linkClass,
    currentPageClass,
  }: {
    crumb: { pathname: string; label: string; isCurrent: boolean };
    isLast: boolean;
    isNavigating: boolean;
    linkClass: string;
    currentPageClass: string;
  }) => (
    <li>
      {isLast ? (
        <span
          className={cn(currentPageClass, { "opacity-50": isNavigating })}
          aria-current="page"
        >
          {crumb.label}
        </span>
      ) : (
        <Link
          to={crumb.pathname}
          className={cn(linkClass, {
            "pointer-events-none opacity-50": isNavigating,
          })}
        >
          {crumb.label}
        </Link>
      )}
    </li>
  )
);

export function EnterpriseBreadcrumbs({
  className,
  separator,
  linkClass = "text-gray-500 hover:text-gray-700 transition-colors",
  currentPageClass = "text-gray-400",
  separatorClass = "text-gray-300",
  errorElement,
}: EnterpriseBreadcrumbsProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const matches = useMatches() as CustomRouteMatch[];
  const location = useLocation();
  const navigation = useNavigation();

  // Stabilize resolvedErrorElement
  const resolvedErrorElement = useMemo(
    () =>
      errorElement || (
        <span className="text-red-500">{t("breadcrumbs.error")}</span>
      ),
    [errorElement, t]
  );

  // Stabilize defaultSeparator
  const defaultSeparator = useMemo(
    () =>
      isRtl ? (
        <ChevronLeftIcon className="h-4 w-4 mx-2" />
      ) : (
        <ChevronRightIcon className="h-4 w-4 mx-2" />
      ),
    [isRtl]
  );

  const memoizedSeparator = useMemo(
    () => (
      <li className={separatorClass} aria-hidden="true">
        {separator || defaultSeparator}
      </li>
    ),
    [separator, defaultSeparator, separatorClass]
  );

  const crumbs = useMemo(() => {
    if (!location || !matches) {
      return [];
    }

    const crumbList = matches
      .filter((match) => match.handle?.crumb != null)
      .map((match) => {
        const { handle, data, pathname } = match;
        let label: string;

        if (typeof handle!.crumb === "function") {
          try {
            label = handle!.crumb({ data }) || pathname;
          } catch (error) {
            console.error("Breadcrumb label error:", error);
            label = resolvedErrorElement as string;
          }
        } else {
          label = handle!.crumb;
        }

        return {
          pathname,
          label,
          isCurrent: location.pathname === pathname,
        };
      });

    return isRtl ? crumbList.reverse() : crumbList;
  }, [matches, location, resolvedErrorElement, isRtl]);

  if (crumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      className={cn(
        "flex items-center text-sm font-medium",
        isRtl ? "font-arabic" : "Inter",
        className
      )}
      aria-label={t("breadcrumbs.ariaLabel")}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <ol
        className={cn(
          "flex items-center",
          isRtl ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
        )}
      >
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const isNavigating = navigation.state === "loading";

          return (
            <Fragment key={`${crumb.pathname}-${index}`}>
              <MemoizedCrumb
                crumb={crumb}
                isLast={isLast}
                isNavigating={isNavigating}
                linkClass={linkClass}
                currentPageClass={currentPageClass}
              />
              {!isLast && memoizedSeparator}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
