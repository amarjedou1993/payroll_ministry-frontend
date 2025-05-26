// // import {
// //   createBrowserRouter,
// //   Navigate,
// //   ScrollRestoration,
// // } from "react-router-dom";
// // import i18n from "@/i18n";
// // import { QueryClient } from "@tanstack/react-query";
// // import { userDetailsLoader, usersLoader } from "@/utils/loaders";
// // import { UsersLayout } from "@/pages/UsersLayout";
// // import UnauthenticatedRoute from "@/components/UnauthenticatedRoute";
// // import ProtectedRoute from "@/components/ProtectedRoute";
// // import DashboardLayout from "@/pages/DashboardLayout";
// // import Auth from "@/pages/Auth";
// // import Users from "@/pages/Users";
// // import UserDetails from "@/pages/UserDetails";
// // import NotFoundPage from "@/pages/NotFoundPage";
// // import DocumentLayout from "@/pages/DocumentLayout";
// // import UploadPayroll from "@/pages/UploadPayroll";
// // import Dashboard from "@/pages/Dashboard";
// // import ErrorPage from "@/pages/ErrorPage";
// // import AssistancePage from "@/pages/AssisstancePage";
// // import AccountSettings from "@/pages/AccountSettings";

// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       staleTime: 1000 * 60 * 5,
// //       retry: 2,
// //       refetchOnWindowFocus: false,
// //     },
// //   },
// // });

// // const getCrumb = (key: string, language: string) => {
// //   return i18n.t(key, { lng: language });
// // };

// // export const router = (language: string = "fr") =>
// //   createBrowserRouter([
// //     {
// //       path: "/",
// //       element: <Navigate to="/auth" replace />,
// //       errorElement: <ErrorPage />,
// //     },
// //     {
// //       path: "auth",
// //       element: (
// //         <UnauthenticatedRoute>
// //           <Auth />
// //         </UnauthenticatedRoute>
// //       ),
// //       errorElement: <ErrorPage />,
// //     },
// //     {
// //       path: "dashboard",
// //       element: (
// //         <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]} />
// //       ),
// //       errorElement: <ErrorPage />,
// //       children: [
// //         {
// //           path: "",
// //           element: (
// //             <>
// //               <ScrollRestoration />
// //               <DashboardLayout />
// //             </>
// //           ),
// //           handle: { crumb: () => getCrumb("router.dashboard", language) },
// //           errorElement: <ErrorPage />,
// //           children: [
// //             {
// //               index: true,
// //               element: <Dashboard />,
// //               errorElement: <ErrorPage />,
// //             },
// //             {
// //               path: "users",
// //               element: <ProtectedRoute allowedRoles={["Admin"]} />, // Restrict to Admin only
// //               errorElement: <ErrorPage />,
// //               children: [
// //                 {
// //                   path: "",
// //                   element: <UsersLayout />,
// //                   handle: { crumb: () => getCrumb("router.users", language) },
// //                   errorElement: <ErrorPage />,
// //                   children: [
// //                     {
// //                       index: true,
// //                       element: <Users />,
// //                       loader: usersLoader(queryClient),
// //                       errorElement: <ErrorPage />,
// //                     },
// //                     {
// //                       path: ":id",
// //                       element: <UserDetails />,
// //                       loader: userDetailsLoader(queryClient),
// //                       errorElement: <ErrorPage />,
// //                       handle: {
// //                         crumb: (match) => {
// //                           if (!match?.userDetails) {
// //                             console.error(
// //                               "Missing userDetails in match:",
// //                               match
// //                             );
// //                             return getCrumb("router.userDataMissing", language);
// //                           }
// //                           return match?.userDetails?.name;
// //                         },
// //                       },
// //                     },
// //                   ],
// //                 },
// //               ],
// //             },
// //             {
// //               path: "documents",
// //               element: <ProtectedRoute allowedRoles={["Admin", "Manager"]} />,
// //               errorElement: <ErrorPage />,
// //               children: [
// //                 {
// //                   path: "",
// //                   element: <DocumentLayout />,
// //                   handle: {
// //                     crumb: () => getCrumb("router.documents", language),
// //                   },
// //                   errorElement: <ErrorPage />,
// //                   children: [
// //                     {
// //                       index: true,
// //                       element: <UploadPayroll />,
// //                       errorElement: <ErrorPage />,
// //                     },
// //                   ],
// //                 },
// //               ],
// //             },
// //             {
// //               path: "support",
// //               element: <AssistancePage />,
// //             },
// //             {
// //               path: "account",
// //               element: <AccountSettings />,
// //             },
// //           ],
// //         },
// //       ],
// //     },
// //     {
// //       path: "*",
// //       element: <NotFoundPage />,
// //       errorElement: <ErrorPage />,
// //     },
// //   ]);

// import {
//   createBrowserRouter,
//   Navigate,
//   ScrollRestoration,
// } from "react-router-dom";
// import i18n from "@/i18n";
// import { QueryClient } from "@tanstack/react-query";
// import { userDetailsLoader, usersLoader } from "@/utils/loaders";
// import { UsersLayout } from "@/pages/UsersLayout";
// import UnauthenticatedRoute from "@/components/UnauthenticatedRoute";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import DashboardLayout from "@/pages/DashboardLayout";
// import Auth from "@/pages/Auth";
// import Users from "@/pages/Users";
// import UserDetails from "@/pages/UserDetails";
// import NotFoundPage from "@/pages/NotFoundPage";
// import DocumentLayout from "@/pages/DocumentLayout";
// import UploadPayroll from "@/pages/UploadPayroll";
// import Dashboard from "@/pages/Dashboard";
// import ErrorPage from "@/pages/ErrorPage";
// import AccountSettings from "@/pages/AccountSettings";
// import AssistancePage from "@/pages/AssisstancePage";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5, // 5 minutes
//       retry: 2,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// const getCrumb = (key: string, language: string) => {
//   return i18n.t(key, { lng: language });
// };

// export const router = (language: string = "fr") =>
//   createBrowserRouter([
//     {
//       path: "/",
//       element: <Navigate to="/auth" replace />,
//       errorElement: <ErrorPage />,
//     },
//     {
//       path: "auth",
//       element: (
//         <UnauthenticatedRoute>
//           <Auth />
//         </UnauthenticatedRoute>
//       ),
//       errorElement: <ErrorPage />,
//     },
//     {
//       path: "dashboard",
//       element: (
//         <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]} />
//       ),
//       errorElement: <ErrorPage />,
//       children: [
//         {
//           path: "",
//           element: (
//             <>
//               <ScrollRestoration />
//               <DashboardLayout />
//             </>
//           ),
//           handle: { crumb: () => getCrumb("router.dashboard", language) },
//           errorElement: <ErrorPage />,
//           children: [
//             {
//               index: true,
//               element: <Dashboard />,
//               errorElement: <ErrorPage />,
//             },
//             {
//               path: "users",
//               element: <ProtectedRoute allowedRoles={["Admin"]} />,
//               errorElement: <ErrorPage />,
//               children: [
//                 {
//                   path: "",
//                   element: <UsersLayout />,
//                   handle: { crumb: () => getCrumb("router.users", language) },
//                   errorElement: <ErrorPage />,
//                   children: [
//                     {
//                       index: true,
//                       element: <Users />,
//                       loader: usersLoader(queryClient),
//                       errorElement: <ErrorPage />,
//                     },
//                     {
//                       path: ":id",
//                       element: <UserDetails />,
//                       loader: userDetailsLoader(queryClient),
//                       errorElement: <ErrorPage />,
//                       handle: {
//                         crumb: (match: any) => {
//                           if (!match?.userDetails) {
//                             console.warn(
//                               "Missing userDetails in match:",
//                               match
//                             );
//                             return getCrumb("router.userDataMissing", language);
//                           }
//                           return match.userDetails.name;
//                         },
//                       },
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               path: "documents",
//               element: <ProtectedRoute allowedRoles={["Admin", "Manager"]} />,
//               errorElement: <ErrorPage />,
//               children: [
//                 {
//                   path: "",
//                   element: <DocumentLayout />,
//                   handle: {
//                     crumb: () => getCrumb("router.documents", language),
//                   },
//                   errorElement: <ErrorPage />,
//                   children: [
//                     {
//                       index: true,
//                       element: <UploadPayroll />,
//                       errorElement: <ErrorPage />,
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               path: "support",
//               element: <AssistancePage />,
//               handle: { crumb: () => getCrumb("router.support", language) },
//             },
//             {
//               path: "account",
//               element: <AccountSettings />,
//               handle: { crumb: () => getCrumb("router.account", language) },
//             },
//           ],
//         },
//       ],
//     },
//     {
//       path: "*",
//       element: <NotFoundPage />,
//       errorElement: <ErrorPage />,
//     },
//   ]);

import {
  createBrowserRouter,
  Navigate,
  ScrollRestoration,
} from "react-router-dom";
import i18n from "@/i18n";
import { QueryClient } from "@tanstack/react-query";
import { userDetailsLoader, usersLoader } from "@/utils/loaders";
import { UsersLayout } from "@/pages/UsersLayout";
import UnauthenticatedRoute from "@/components/UnauthenticatedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/pages/DashboardLayout";
import Auth from "@/pages/Auth";
import Users from "@/pages/Users";
import UserDetails from "@/pages/UserDetails";
import NotFoundPage from "@/pages/NotFoundPage";
import DocumentLayout from "@/pages/DocumentLayout";
import UploadPayroll from "@/pages/UploadPayroll";
import Dashboard from "@/pages/Dashboard";
import ErrorPage from "@/pages/ErrorPage";
import AccountSettings from "@/pages/AccountSettings";
import AssistancePage from "@/pages/AssisstancePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const getCrumb = (key: string, language: string) => {
  return i18n.t(key, { lng: language });
};

export const router = (language: string = "fr") =>
  createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/auth" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: "auth",
      element: (
        <UnauthenticatedRoute>
          <Auth />
        </UnauthenticatedRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "dashboard",
      element: (
        <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]} />
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: (
            <>
              <ScrollRestoration />
              <DashboardLayout />
            </>
          ),
          handle: { crumb: () => getCrumb("router.dashboard", language) },
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <Dashboard />,
              errorElement: <ErrorPage />,
            },
            {
              path: "users",
              element: <ProtectedRoute allowedRoles={["Admin"]} />,
              errorElement: <ErrorPage />,
              children: [
                {
                  path: "",
                  element: <UsersLayout />,
                  handle: { crumb: () => getCrumb("router.users", language) },
                  errorElement: <ErrorPage />,
                  children: [
                    {
                      index: true,
                      element: <Users />,
                      loader: usersLoader(queryClient),
                      errorElement: <ErrorPage />,
                    },
                    // {
                    //   path: ":id",
                    //   element: <UserDetails />,
                    //   loader: userDetailsLoader(queryClient),
                    //   errorElement: <ErrorPage />,
                    //   handle: {
                    //     crumb: (match: { userDetails?: { name: string } }) =>
                    //       match.userDetails?.name ||
                    //       getCrumb("router.userDataMissing", language),
                    //   },
                    // },
                    {
                      path: ":id",
                      element: <UserDetails />,
                      loader: userDetailsLoader(queryClient),
                      errorElement: <ErrorPage />,
                      handle: {
                        crumb: (match: { userDetails?: { name: string } }) =>
                          match.userDetails?.name ||
                          getCrumb("router.userDataMissing", language),
                      },
                    },
                  ],
                },
              ],
            },
            {
              path: "documents",
              element: <ProtectedRoute allowedRoles={["Admin", "Manager"]} />,
              errorElement: <ErrorPage />,
              children: [
                {
                  path: "",
                  element: <DocumentLayout />,
                  handle: {
                    crumb: () => getCrumb("router.documents", language),
                  },
                  errorElement: <ErrorPage />,
                  children: [
                    {
                      index: true,
                      element: <UploadPayroll />,
                      errorElement: <ErrorPage />,
                    },
                  ],
                },
              ],
            },
            {
              path: "support",
              element: <AssistancePage />,
              handle: { crumb: () => getCrumb("router.support", language) },
            },
            {
              path: "account",
              element: <AccountSettings />,
              handle: { crumb: () => getCrumb("router.account", language) },
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
      errorElement: <ErrorPage />,
    },
  ]);
