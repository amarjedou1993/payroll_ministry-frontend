// // // import { FC, useEffect, useState } from "react";
// // // import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
// // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // // import {
// // //   LogOutIcon,
// // //   LayoutDashboard,
// // //   Users,
// // //   File,
// // //   UserRoundPen,
// // //   ChevronsUpDownIcon,
// // //   CircleUserRoundIcon,
// // //   UserCircle2,
// // //   ChevronDownIcon,
// // //   PanelRightOpenIcon,
// // //   CircleHelpIcon,
// // //   PanelLeftOpenIcon,
// // // } from "lucide-react";
// // // import { useSelector } from "react-redux";
// // // import { motion, AnimatePresence } from "framer-motion";
// // // import { EnterpriseBreadcrumbs } from "@/components/BreadCrumbs";
// // // import axiosInstance from "@/api/client";
// // // import { IUserResponse, Role, User } from "@/types/types";
// // // import { useAppDispatch } from "@/store/hook";
// // // import { RootState } from "@/store";
// // // import { getUserProfile, getUsers } from "@/services/auth.service";
// // // import { clearUser } from "@/store/slices/authSlice";
// // // import Spinner from "@/components/ui/LoadingSpinner";
// // // import Sidebar from "@/components/ui/Sidebar3";
// // // import Button from "@/components/ui/Button";
// // // import { getInitials } from "@/utils/getInitials";
// // // import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
// // // import { Footer } from "@/components/ui/Footer";
// // // import Logo from "@/components/ui/Logo";
// // // import img from "@/assets/app-logo.svg";
// // // import { useTranslation } from "react-i18next";
// // // import Select from "@/components/ui/Select";

// // // const logoutUser = async () => {
// // //   await axiosInstance.post<User>("/auth/logout");
// // // };

// // // const DashboardLayout: FC = () => {
// // //   const { t, i18n } = useTranslation();
// // //   const isRtl = i18n.language === "ar";
// // //   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
// // //   const [logoutError, setLogoutError] = useState<string | null>(null);
// // //   const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
// // //   const location = useLocation();
// // //   const navigate = useNavigate();
// // //   const dispatch = useAppDispatch();
// // //   const queryClient = useQueryClient();

// // //   const { isAuthenticated, isLoading: authLoading } = useSelector(
// // //     (state: RootState) => state.auth
// // //   );

// // //   const matches = useMatches();

// // //   const hasParentAndChildCrumbs = matches.some((match, index) => {
// // //     const hasCrumb = !!match.handle?.crumb;
// // //     if (!hasCrumb) return false;
// // //     const hasChildWithCrumb = matches
// // //       .slice(index + 1)
// // //       .some((childMatch) => !!childMatch.handle?.crumb);
// // //     return hasCrumb && hasChildWithCrumb;
// // //   });

// // //   const {
// // //     data: user,
// // //     isLoading: userLoading,
// // //     isError: userError,
// // //   } = useQuery<User | null, Error>({
// // //     queryKey: ["user"],
// // //     queryFn: getUserProfile,
// // //     retry: false,
// // //     enabled: !!isAuthenticated,
// // //   });

// // //   useEffect(() => {
// // //     if (user && user.roles) {
// // //       setIsAdmin(user.roles.some((role: Role) => role.name === "Admin"));
// // //     } else {
// // //       setIsAdmin(false);
// // //     }
// // //   }, [user]);

// // //   const { data: allUsers, isLoading: allUsersLoading } = useQuery<
// // //     IUserResponse[],
// // //     Error
// // //   >({
// // //     queryKey: ["users"],
// // //     queryFn: getUsers,
// // //     retry: false,
// // //     enabled: !!isAuthenticated && isAdmin === true,
// // //   });

// // //   const { mutate: handleLogout } = useMutation<void, Error>({
// // //     mutationFn: logoutUser,
// // //     onSuccess: () => {
// // //       dispatch(clearUser());
// // //       queryClient.removeQueries({ queryKey: ["user"] });
// // //       navigate("/auth", { replace: true });
// // //     },
// // //     onError: (error) => {
// // //       setLogoutError(error.message || t("errors.genericError"));
// // //     },
// // //     onSettled: () => {
// // //       setLogoutError(null);
// // //     },
// // //   });

// // //   const handleAccountSettings = () => navigate("/dashboard/account");

// // //   useEffect(() => {
// // //     if (!authLoading && !isAuthenticated && userError) {
// // //       navigate("/auth");
// // //     }
// // //   }, [authLoading, isAuthenticated, navigate, userError]);

// // //   useEffect(() => {
// // //     window.scrollTo(0, 0);
// // //     return () => {
// // //       const mainContainer = document.querySelector(".main-content");
// // //       if (mainContainer) mainContainer.scrollTop = 0;
// // //     };
// // //   }, []);

// // //   const isLoading = authLoading || userLoading || allUsersLoading;
// // //   if (isLoading) {
// // //     return <Spinner fullScreen />;
// // //   }

// // //   const sidebarGroups = [
// // //     {
// // //       title: t("sidebar.main"),
// // //       items: [
// // //         {
// // //           name: t("sidebar.dashboard"),
// // //           path: "/dashboard",
// // //           icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
// // //           roles: ["Admin", "Manager", "Employee"],
// // //         },
// // //         {
// // //           name: t("sidebar.documents"),
// // //           path: "/dashboard/documents",
// // //           icon: <File size={20} strokeWidth={1.5} />,
// // //           roles: ["Admin", "Manager"],
// // //         },
// // //       ],
// // //     },
// // //     {
// // //       title: t("sidebar.admin"),
// // //       items: [
// // //         {
// // //           name: t("sidebar.users"),
// // //           path: "/dashboard/users",
// // //           icon: <Users size={20} strokeWidth={1.5} />,
// // //           roles: ["Admin"],
// // //           children: [
// // //             { name: t("sidebar.allUsers"), path: "/dashboard/users" },
// // //             // { name: t("sidebar.roles"), path: "/dashboard/users/roles" },
// // //           ],
// // //         },
// // //         // {
// // //         //   name: t("sidebar.settings"),
// // //         //   path: "/dashboard/settings",
// // //         //   icon: <Settings2Icon size={20} strokeWidth={1.5} />,
// // //         //   roles: ["Admin", "Manager"],
// // //         // },
// // //         {
// // //           name: t("sidebar.support"),
// // //           path: "/dashboard/support",
// // //           icon: <CircleHelpIcon size={20} strokeWidth={1.5} />,
// // //           roles: ["Admin", "Manager"],
// // //         },
// // //       ],
// // //     },
// // //   ];

// // //   const isEmployee = user?.roles[0].name.includes("Employee");

// // //   const filteredGroups = sidebarGroups
// // //     .map((group) => ({
// // //       ...group,
// // //       items: group.items.filter((item) =>
// // //         item.roles.some((role) =>
// // //           user?.roles?.some((userRole) => userRole.name === role)
// // //         )
// // //       ),
// // //     }))
// // //     .filter((group) => group.items.length > 0);

// // //   if (isAdmin) {
// // //     if (allUsersLoading) {
// // //       return <Spinner fullScreen />;
// // //     }
// // //     if (!allUsers) {
// // //       return <p>{t("loadingUsers")}</p>;
// // //     }
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex" dir={isRtl ? "rtl" : "ltr"}>
// // //       {!isEmployee && (
// // //         <Sidebar
// // //           isOpen={isSidebarOpen}
// // //           onToggle={setIsSidebarOpen}
// // //           groups={filteredGroups}
// // //           footer={
// // //             <Dropdown
// // //               position={`${isRtl ? "top-right" : "top-left"}`}
// // //               trigger={
// // //                 <div
// // //                   role="button"
// // //                   className="flex border items-center gap-3 px-2 py-2 rounded-md shadow-sm bg-white"
// // //                 >
// // //                   <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
// // //                     <UserCircle2 size={24} strokeWidth={1.5} />
// // //                   </div>
// // //                   {isSidebarOpen && (
// // //                     <>
// // //                       <div className="flex-1 truncate">
// // //                         <p className="text-sm font-medium">{user?.username}</p>
// // //                         <p className="text-xs font-light text-gray-500 text-muted-foreground truncate">
// // //                           {t(`roles.${user?.roles[0].name}`)}
// // //                         </p>
// // //                       </div>
// // //                       <Button
// // //                         variant="secondary"
// // //                         className="hover:bg-accent border-none rounded pt-1.5 pb-1.5 pr-1.5 pl-1.5"
// // //                       >
// // //                         <ChevronsUpDownIcon size={20} strokeWidth={1.5} />
// // //                       </Button>
// // //                     </>
// // //                   )}
// // //                 </div>
// // //               }
// // //             >
// // //               <div className="p-2">
// // //                 <div className="flex items-center gap-3 px-2 py-2">
// // //                   <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
// // //                     {user ? (
// // //                       getInitials(user?.username as string)
// // //                     ) : (
// // //                       <UserRoundPen />
// // //                     )}
// // //                   </div>
// // //                   <div>
// // //                     <p className="text-sm font-medium">{user?.username}</p>
// // //                     <p className="text-xs font-light text-gray-500 text-muted-foreground">
// // //                       {t(`roles.${user?.roles[0].name}`)}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //                 <div className="border-t border-gray-200 my-2" />
// // //                 <Button
// // //                   variant="secondary"
// // //                   onClick={() => handleAccountSettings()}
// // //                   className="w-full flex items-center gap-1 mt-1 text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
// // //                 >
// // //                   <CircleUserRoundIcon size={16} strokeWidth={1.5} />
// // //                   {t("dropdown.account")}
// // //                 </Button>
// // //                 <div className="border-t border-gray-200 my-2" />
// // //                 <Button
// // //                   className="flex mt-1 items-center gap-1 w-full text-left px-3 py-2 text-sm"
// // //                   onClick={() => handleLogout()}
// // //                 >
// // //                   <LogOutIcon size={16} strokeWidth={1.5} />
// // //                   {t("dropdown.logout")}
// // //                 </Button>
// // //               </div>
// // //             </Dropdown>
// // //           }
// // //         />
// // //       )}

// // //       <div className="flex flex-col flex-1 min-h-0">
// // //         {isEmployee ? (
// // //           <header className="bg-white border-b px-8 py-4 shadow-sm">
// // //             <div className="px-4 flex justify-between items-center">
// // //               <div className="flex items-center gap-4">
// // //                 <Logo className="block">
// // //                   <img className="w-24" src={img} alt={t("logoAlt")} />
// // //                 </Logo>
// // //               </div>
// // //               <Dropdown
// // //                 position="bottom-right"
// // //                 trigger={
// // //                   <div
// // //                     role="button"
// // //                     className="flex items-center border gap-2 xs:gap-3 px-2 xs:px-3 py-1.5 xs:py-2 rounded-full xs:rounded-xl"
// // //                   >
// // //                     <div className="h-8 w-8 xs:h-10 xs:w-10 shadow-sm rounded-full bg-accent flex items-center justify-center">
// // //                       {getInitials(user?.username as string)}
// // //                     </div>
// // //                     {isSidebarOpen && (
// // //                       <>
// // //                         <div className="flex-1 truncate hidden xs:block">
// // //                           <p className="text-xs xs:text-sm font-medium">
// // //                             {user?.username}
// // //                           </p>
// // //                           <p className="text-xs font-light text-gray-500 text-muted-foreground truncate">
// // //                             {t(`roles.${user?.roles[0].name}`)}
// // //                           </p>
// // //                         </div>
// // //                         <Button
// // //                           variant="secondary"
// // //                           className="hover:bg-accent border-none rounded pt-1 xs:pt-1.5 xs:pb-1.5 xs:pr-1.5 xs:pl-1.5"
// // //                         >
// // //                           <ChevronDownIcon size={16} strokeWidth={1.5} />
// // //                         </Button>
// // //                       </>
// // //                     )}
// // //                   </div>
// // //                 }
// // //               >
// // //                 <div className="p-1.5 xs:p-2">
// // //                   <Button
// // //                     onClick={() => navigate("/dashboard/account")}
// // //                     variant="secondary"
// // //                     className="w-full flex items-center gap-1 mt-1 text-left px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm hover:bg-gray-100 rounded"
// // //                   >
// // //                     <CircleUserRoundIcon size={14} strokeWidth={1.5} />
// // //                     {t("dropdown.account")}
// // //                   </Button>
// // //                   <div className="border-t border-gray-200 my-1 xs:my-2" />
// // //                   <div className={`flex`}>
// // //                     <Select
// // //                       id="language"
// // //                       name="language"
// // //                       value={i18n.language}
// // //                       onChange={async (
// // //                         value: string | string[] | undefined
// // //                       ) => {
// // //                         if (typeof value === "string") {
// // //                           await i18n.changeLanguage(value);
// // //                         }
// // //                       }}
// // //                       options={[
// // //                         { label: "Français", value: "fr" },
// // //                         { label: "العربية", value: "ar" },
// // //                       ]}
// // //                       placeholder={t("selectLanguage")}
// // //                       className={`w-full rounded-lg border-gray-200 ${
// // //                         isRtl
// // //                           ? "font-arabic text-right"
// // //                           : "font-french text-left"
// // //                       }`}
// // //                     />
// // //                   </div>
// // //                   <div className="border-t border-gray-200 my-1 xs:my-2" />
// // //                   <Button
// // //                     onClick={() => handleLogout()}
// // //                     className="flex mt-1 items-center gap-1 w-full text-left px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm"
// // //                   >
// // //                     <LogOutIcon size={14} strokeWidth={1.5} />
// // //                     {t("dropdown.logout")}
// // //                   </Button>
// // //                 </div>
// // //               </Dropdown>
// // //             </div>
// // //           </header>
// // //         ) : (
// // //           <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
// // //             <div className="flex items-center gap-4">
// // //               <button
// // //                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// // //                 className="text-gray-700"
// // //                 aria-label={t("toggleSidebar")}
// // //               >
// // //                 {isSidebarOpen ? (
// // //                   <PanelRightOpenIcon strokeWidth={1} className="w-6 h-6" />
// // //                 ) : (
// // //                   <PanelLeftOpenIcon strokeWidth={1} className="w-6 h-6" />
// // //                 )}
// // //               </button>
// // //               <div>
// // //                 <h1 className="text-lg font-semibold">
// // //                   {user?.username || t("user")}
// // //                 </h1>
// // //               </div>
// // //             </div>
// // //             {/* <Button
// // //               onClick={() => handleLogout()}
// // //               className="flex items-center gap-2 px-4 py-2 text-sm"
// // //             >
// // //               <span className="font-light">{t("dropdown.logout")}</span>
// // //               <LogOutIcon size={16} />
// // //             </Button> */}
// // //             <div className={`flex`}>
// // //               <Select
// // //                 id="language"
// // //                 name="language"
// // //                 value={i18n.language}
// // //                 onChange={async (value: string | string[] | undefined) => {
// // //                   if (typeof value === "string") {
// // //                     await i18n.changeLanguage(value);
// // //                   }
// // //                 }}
// // //                 options={[
// // //                   { label: "Français", value: "fr" },
// // //                   { label: "العربية", value: "ar" },
// // //                 ]}
// // //                 placeholder={t("selectLanguage")}
// // //                 className={`w-fit rounded-lg border-gray-200 ${
// // //                   isRtl ? "font-arabic text-right" : "font-french text-left"
// // //                 }`}
// // //               />
// // //             </div>
// // //           </header>
// // //         )}

// // //         <div className="flex-1">
// // //           {!isEmployee && hasParentAndChildCrumbs && (
// // //             <div className="px-8 py-3 mt-2 shrink-0">
// // //               <EnterpriseBreadcrumbs />
// // //             </div>
// // //           )}

// // //           <AnimatePresence mode="wait">
// // //             <motion.main
// // //               key={location.pathname}
// // //               initial={{ opacity: 0, y: 10 }}
// // //               animate={{
// // //                 opacity: 1,
// // //                 y: 0,
// // //                 transition: { duration: 0.3, ease: "easeOut" },
// // //               }}
// // //               exit={{ opacity: 0, y: 10 }}
// // //               className={`p-8 pt-2 min-h-full ${
// // //                 isRtl ? "font-arabic" : "Inter"
// // //               }`}
// // //             >
// // //               <Outlet />
// // //             </motion.main>
// // //           </AnimatePresence>
// // //         </div>

// // //         <div className="grid grid-cols-1 justify-center">
// // //           <Footer className="pt-2 pb-6 xs:pb-8 sm:pb-10 text-center text-xs xs:text-sm sm:text-sm">
// // //             <p className="px-4">
// // //               {t("footer", { year: new Date().getFullYear() })}
// // //             </p>
// // //           </Footer>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default DashboardLayout;

// // import { FC, useEffect, useState } from "react";
// // import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
// // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // import {
// //   LogOutIcon,
// //   LayoutDashboard,
// //   Users,
// //   File,
// //   UserRoundPen,
// //   ChevronsUpDownIcon,
// //   CircleUserRoundIcon,
// //   UserCircle2,
// //   ChevronDownIcon,
// //   PanelRightOpenIcon,
// //   CircleHelpIcon,
// //   PanelLeftOpenIcon,
// // } from "lucide-react";
// // import { useSelector } from "react-redux";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { EnterpriseBreadcrumbs } from "@/components/BreadCrumbs";
// // import axiosInstance from "@/api/client";
// // import { IUserResponse, Role, User, CustomRouteMatch } from "@/types/types";
// // import { useAppDispatch } from "@/store/hook";
// // import { RootState } from "@/store";
// // import { getUserProfile, getUsers } from "@/services/auth.service";
// // import { clearUser } from "@/store/slices/authSlice";
// // import Spinner from "@/components/ui/LoadingSpinner";
// // import Sidebar from "@/components/ui/Sidebar3";
// // import Button from "@/components/ui/Button";
// // import { getInitials } from "@/utils/getInitials";
// // import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
// // import { Footer } from "@/components/ui/Footer";
// // import Logo from "@/components/ui/Logo";
// // import img from "@/assets/app-logo.svg";
// // import { useTranslation } from "react-i18next";
// // import Select from "@/components/ui/Select";

// // const logoutUser = async () => {
// //   await axiosInstance.post<User>("/auth/logout");
// // };

// // const DashboardLayout: FC = () => {
// //   const { t, i18n } = useTranslation();
// //   const isRtl = i18n.language === "ar";
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
// //   const [logoutError, setLogoutError] = useState<string | null>(null);
// //   const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const dispatch = useAppDispatch();
// //   const queryClient = useQueryClient();

// //   const { isAuthenticated, isLoading: authLoading } = useSelector(
// //     (state: RootState) => state.auth
// //   );

// //   const matches = useMatches() as CustomRouteMatch[];

// //   const hasParentAndChildCrumbs = matches.some((match, index) => {
// //     const hasCrumb = !!match.handle?.crumb;
// //     if (!hasCrumb) return false;
// //     const hasChildWithCrumb = matches
// //       .slice(index + 1)
// //       .some((childMatch) => !!childMatch.handle?.crumb);
// //     return hasCrumb && hasChildWithCrumb;
// //   });

// //   const {
// //     data: user,
// //     isLoading: userLoading,
// //     isError: userError,
// //   } = useQuery<User | null, Error>({
// //     queryKey: ["user"],
// //     queryFn: getUserProfile,
// //     retry: false,
// //     enabled: !!isAuthenticated,
// //   });

// //   useEffect(() => {
// //     if (user && user.roles) {
// //       setIsAdmin(user.roles.some((role: Role) => role.name === "Admin"));
// //     } else {
// //       setIsAdmin(false);
// //     }
// //   }, [user]);

// //   const { data: allUsers, isLoading: allUsersLoading } = useQuery<
// //     IUserResponse[],
// //     Error
// //   >({
// //     queryKey: ["users"],
// //     queryFn: getUsers,
// //     retry: false,
// //     enabled: !!isAuthenticated && isAdmin === true,
// //   });

// //   const { mutate: handleLogout } = useMutation<void, Error>({
// //     mutationFn: logoutUser,
// //     onSuccess: () => {
// //       dispatch(clearUser());
// //       queryClient.removeQueries({ queryKey: ["user"] });
// //       navigate("/auth", { replace: true });
// //     },
// //     onError: (error) => {
// //       setLogoutError(error.message || t("errors.genericError"));
// //     },
// //     onSettled: () => {
// //       setLogoutError(null);
// //     },
// //   });

// //   const handleAccountSettings = () => navigate("/dashboard/account");

// //   useEffect(() => {
// //     if (!authLoading && !isAuthenticated && userError) {
// //       navigate("/auth");
// //     }
// //   }, [authLoading, isAuthenticated, navigate, userError]);

// //   useEffect(() => {
// //     window.scrollTo(0, 0);
// //     return () => {
// //       const mainContainer = document.querySelector(".main-content");
// //       if (mainContainer) mainContainer.scrollTop = 0;
// //     };
// //   }, []);

// //   const isLoading = authLoading || userLoading || allUsersLoading;
// //   if (isLoading) {
// //     return <Spinner fullScreen />;
// //   }

// //   const sidebarGroups = [
// //     {
// //       title: t("sidebar.main"),
// //       items: [
// //         {
// //           name: t("sidebar.dashboard"),
// //           path: "/dashboard",
// //           icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
// //           roles: ["Admin", "Manager", "Employee"],
// //         },
// //         {
// //           name: t("sidebar.documents"),
// //           path: "/dashboard/documents",
// //           icon: <File size={20} strokeWidth={1.5} />,
// //           roles: ["Admin", "Manager"],
// //         },
// //       ],
// //     },
// //     {
// //       title: t("sidebar.admin"),
// //       items: [
// //         {
// //           name: t("sidebar.users"),
// //           path: "/dashboard/users",
// //           icon: <Users size={20} strokeWidth={1.5} />,
// //           roles: ["Admin"],
// //           children: [{ name: t("sidebar.allUsers"), path: "/dashboard/users" }],
// //         },
// //         {
// //           name: t("sidebar.support"),
// //           path: "/dashboard/support",
// //           icon: <CircleHelpIcon size={20} strokeWidth={1.5} />,
// //           roles: ["Admin", "Manager"],
// //         },
// //       ],
// //     },
// //   ];

// //   const isEmployee = user?.roles[0].name.includes("Employee");

// //   const filteredGroups = sidebarGroups
// //     .map((group) => ({
// //       ...group,
// //       items: group.items.filter((item) =>
// //         item.roles.some((role) =>
// //           user?.roles?.some((userRole) => userRole.name === role)
// //         )
// //       ),
// //     }))
// //     .filter((group) => group.items.length > 0);

// //   if (isAdmin) {
// //     if (allUsersLoading) {
// //       return <Spinner fullScreen />;
// //     }
// //     if (!allUsers) {
// //       return <p>{t("loadingUsers")}</p>;
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen flex" dir={isRtl ? "rtl" : "ltr"}>
// //       {!isEmployee && (
// //         <Sidebar
// //           isOpen={isSidebarOpen}
// //           onToggle={setIsSidebarOpen}
// //           groups={filteredGroups}
// //           footer={
// //             <Dropdown
// //               position={`${isRtl ? "top-right" : "top-left"}`}
// //               trigger={
// //                 <div
// //                   role="button"
// //                   className="flex border items-center gap-3 px-2 py-2 rounded-md shadow-sm bg-white"
// //                 >
// //                   <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
// //                     <UserCircle2 size={24} strokeWidth={1.5} />
// //                   </div>
// //                   {isSidebarOpen && (
// //                     <>
// //                       <div className="flex-1 truncate">
// //                         <p className="text-sm font-medium">{user?.username}</p>
// //                         <p className="text-xs font-light text-gray-500 text-muted-foreground truncate">
// //                           {t(`roles.${user?.roles[0].name}`)}
// //                         </p>
// //                       </div>
// //                       <Button
// //                         variant="secondary"
// //                         className="hover:bg-accent border-none rounded pt-1.5 pb-1.5 pr-1.5 pl-1.5"
// //                       >
// //                         <ChevronsUpDownIcon size={20} strokeWidth={1.5} />
// //                       </Button>
// //                     </>
// //                   )}
// //                 </div>
// //               }
// //             >
// //               <div className="p-2">
// //                 <div className="flex items-center gap-3 px-2 py-2">
// //                   <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
// //                     {user ? (
// //                       getInitials(user?.username as string)
// //                     ) : (
// //                       <UserRoundPen />
// //                     )}
// //                   </div>
// //                   <div>
// //                     <p className="text-sm font-medium">{user?.username}</p>
// //                     <p className="text-xs font-light text-gray-500 text-muted-foreground">
// //                       {t(`roles.${user?.roles[0].name}`)}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="border-t border-gray-200 my-2" />
// //                 <Button
// //                   variant="secondary"
// //                   onClick={() => handleAccountSettings()}
// //                   className="w-full flex items-center gap-1 mt-1 text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
// //                 >
// //                   <CircleUserRoundIcon size={16} strokeWidth={1.5} />
// //                   {t("dropdown.account")}
// //                 </Button>
// //                 <div className="border-t border-gray-200 my-2" />
// //                 <Button
// //                   className="flex mt-1 items-center gap-1 w-full text-left px-3 py-2 text-sm"
// //                   onClick={() => handleLogout()}
// //                 >
// //                   <LogOutIcon size={16} strokeWidth={1.5} />
// //                   {t("dropdown.logout")}
// //                 </Button>
// //               </div>
// //             </Dropdown>
// //           }
// //         />
// //       )}

// //       <div className="flex flex-col flex-1 min-h-0">
// //         {isEmployee ? (
// //           <header className="bg-white border-b px-8 py-4 shadow-sm">
// //             <div className="px-4 flex justify-between items-center">
// //               <div className="flex items-center gap-4">
// //                 <Logo className="block">
// //                   <img className="w-24" src={img} alt={t("logoAlt")} />
// //                 </Logo>
// //               </div>
// //               <Dropdown
// //                 position="bottom-right"
// //                 trigger={
// //                   <div
// //                     role="button"
// //                     className="flex items-center border gap-2 xs:gap-3 px-2 xs:px-3 py-1.5 xs:py-2 rounded-full xs:rounded-xl"
// //                   >
// //                     <div className="h-8 w-8 xs:h-10 xs:w-10 shadow-sm rounded-full bg-accent flex items-center justify-center">
// //                       {getInitials(user?.username as string)}
// //                     </div>
// //                     {isSidebarOpen && (
// //                       <>
// //                         <div className="flex-1 truncate hidden xs:block">
// //                           <p className="text-xs xs:text-sm font-medium">
// //                             {user?.username}
// //                           </p>
// //                           <p className="text-xs font-light text-gray-500 text-muted-foreground truncate">
// //                             {t(`roles.${user?.roles[0].name}`)}
// //                           </p>
// //                         </div>
// //                         <Button
// //                           variant="secondary"
// //                           className="hover:bg-accent border-none rounded pt-1 xs:pt-1.5 xs:pb-1.5 xs:pr-1.5 xs:pl-1.5"
// //                         >
// //                           <ChevronDownIcon size={16} strokeWidth={1.5} />
// //                         </Button>
// //                       </>
// //                     )}
// //                   </div>
// //                 }
// //               >
// //                 <div className="p-1.5 xs:p-2">
// //                   <Button
// //                     onClick={() => navigate("/dashboard/account")}
// //                     variant="secondary"
// //                     className="w-full flex items-center gap-1 mt-1 text-left px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm hover:bg-gray-100 rounded"
// //                   >
// //                     <CircleUserRoundIcon size={14} strokeWidth={1.5} />
// //                     {t("dropdown.account")}
// //                   </Button>
// //                   <div className="border-t border-gray-200 my-1 xs:my-2" />
// //                   <div className={`flex`}>
// //                     <Select
// //                       id="language"
// //                       name="language"
// //                       value={i18n.language}
// //                       onChange={async (
// //                         value: string | string[] | undefined
// //                       ) => {
// //                         if (typeof value === "string") {
// //                           await i18n.changeLanguage(value);
// //                         }
// //                       }}
// //                       options={[
// //                         { label: "Français", value: "fr" },
// //                         { label: "العربية", value: "ar" },
// //                       ]}
// //                       placeholder={t("selectLanguage")}
// //                       className={`w-full rounded-lg border-gray-200 ${
// //                         isRtl
// //                           ? "font-arabic text-right"
// //                           : "font-french text-left"
// //                       }`}
// //                     />
// //                   </div>
// //                   <div className="border-t border-gray-200 my-1 xs:my-2" />
// //                   <Button
// //                     onClick={() => handleLogout()}
// //                     className="flex mt-1 items-center gap-1 w-full text-left px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm"
// //                   >
// //                     <LogOutIcon size={14} strokeWidth={1.5} />
// //                     {t("dropdown.logout")}
// //                   </Button>
// //                 </div>
// //               </Dropdown>
// //             </div>
// //           </header>
// //         ) : (
// //           <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
// //             <div className="flex items-center gap-4">
// //               <button
// //                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                 className="text-gray-700"
// //                 aria-label={t("toggleSidebar")}
// //               >
// //                 {isSidebarOpen ? (
// //                   <PanelRightOpenIcon strokeWidth={1} className="w-6 h-6" />
// //                 ) : (
// //                   <PanelLeftOpenIcon strokeWidth={1} className="w-6 h-6" />
// //                 )}
// //               </button>
// //               <div>
// //                 <h1 className="text-lg font-semibold">
// //                   {user?.username || t("user")}
// //                 </h1>
// //               </div>
// //             </div>
// //             <div className={`flex`}>
// //               <Select
// //                 id="language"
// //                 name="language"
// //                 value={i18n.language}
// //                 onChange={async (value: string | string[] | undefined) => {
// //                   if (typeof value === "string") {
// //                     await i18n.changeLanguage(value);
// //                   }
// //                 }}
// //                 options={[
// //                   { label: "Français", value: "fr" },
// //                   { label: "العربية", value: "ar" },
// //                 ]}
// //                 placeholder={t("selectLanguage")}
// //                 className={`w-fit rounded-lg border-gray-200 ${
// //                   isRtl ? "font-arabic text-right" : "font-french text-left"
// //                 }`}
// //               />
// //             </div>
// //           </header>
// //         )}

// //         <div className="flex-1">
// //           {!isEmployee && hasParentAndChildCrumbs && (
// //             <div className="px-8 py-3 mt-2 shrink-0">
// //               <EnterpriseBreadcrumbs />
// //             </div>
// //           )}

// //           <AnimatePresence mode="wait">
// //             <motion.main
// //               key={location.pathname}
// //               initial={{ opacity: 0, y: 10 }}
// //               animate={{
// //                 opacity: 1,
// //                 y: 0,
// //                 transition: { duration: 0.3, ease: "easeOut" },
// //               }}
// //               exit={{ opacity: 0, y: 10 }}
// //               className={`p-8 pt-2 min-h-full ${
// //                 isRtl ? "font-arabic" : "Inter"
// //               }`}
// //             >
// //               <Outlet />
// //             </motion.main>
// //           </AnimatePresence>
// //         </div>

// //         <div className="grid grid-cols-1 justify-center">
// //           <Footer className="pt-2 pb-6 xs:pb-8 sm:pb-10 text-center text-xs xs:text-sm sm:text-sm">
// //             <p className="px-4">
// //               {t("footer", { year: new Date().getFullYear() })}
// //             </p>
// //           </Footer>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardLayout;

// import { FC, useEffect, useState } from "react";
// import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   LogOutIcon,
//   LayoutDashboard,
//   Users,
//   File,
//   UserRoundPen,
//   ChevronsUpDownIcon,
//   CircleUserRoundIcon,
//   UserCircle2,
//   ChevronDownIcon,
//   PanelRightOpenIcon,
//   CircleHelpIcon,
//   PanelLeftOpenIcon,
// } from "lucide-react";
// import { useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { EnterpriseBreadcrumbs } from "@/components/BreadCrumbs";
// import axiosInstance from "@/api/client";
// import { IUserResponse, Role, User, CustomRouteMatch } from "@/types/types";
// import { useAppDispatch } from "@/store/hook";
// import { RootState } from "@/store";
// import { getUserProfile, getUsers } from "@/services/auth.service";
// import { clearUser } from "@/store/slices/authSlice";
// import Spinner from "@/components/ui/LoadingSpinner";
// import Sidebar from "@/components/ui/Sidebar3";
// import Button from "@/components/ui/Button";
// import { getInitials } from "@/utils/getInitials";
// import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
// import { Footer } from "@/components/ui/Footer";
// import Logo from "@/components/ui/Logo";
// import img from "@/assets/app-logo.svg";
// import { useTranslation } from "react-i18next";
// import Select from "@/components/ui/Select";

// const logoutUser = async () => {
//   await axiosInstance.post<User>("/auth/logout");
// };

// const DashboardLayout: FC = () => {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.language === "ar";
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [logoutError, setLogoutError] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const queryClient = useQueryClient();

//   const { isAuthenticated, isLoading: authLoading } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const matches = useMatches() as CustomRouteMatch[];

//   const hasParentAndChildCrumbs = matches.some((match, index) => {
//     // Check if handle exists and crumb is a string or function
//     const hasCrumb = !!match.handle && match.handle.crumb != null;
//     if (!hasCrumb) return false;
//     const hasChildWithCrumb = matches
//       .slice(index + 1)
//       .some(
//         (childMatch) => !!childMatch.handle && childMatch.handle.crumb != null
//       );
//     return hasCrumb && hasChildWithCrumb;
//   });

//   const {
//     data: user,
//     isLoading: userLoading,
//     isError: userError,
//   } = useQuery<User | null, Error>({
//     queryKey: ["user"],
//     queryFn: getUserProfile,
//     retry: false,
//     enabled: !!isAuthenticated,
//   });

//   useEffect(() => {
//     if (user && user.roles) {
//       setIsAdmin(user.roles.some((role: Role) => role.name === "Admin"));
//     } else {
//       setIsAdmin(false);
//     }
//   }, [user]);

//   const { data: allUsers, isLoading: allUsersLoading } = useQuery<
//     IUserResponse[],
//     Error
//   >({
//     queryKey: ["users"],
//     queryFn: getUsers,
//     retry: false,
//     enabled: !!isAuthenticated && isAdmin === true,
//   });

//   const { mutate: handleLogout } = useMutation<void, Error>({
//     mutationFn: logoutUser,
//     onSuccess: () => {
//       dispatch(clearUser());
//       queryClient.removeQueries({ queryKey: ["user"] });
//       navigate("/auth", { replace: true });
//     },
//     onError: (error) => {
//       setLogoutError(error.message || t("errors.genericError"));
//     },
//     onSettled: () => {
//       setLogoutError(null);
//     },
//   });

//   const handleAccountSettings = () => navigate("/dashboard/account");

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated && userError) {
//       navigate("/auth");
//     }
//   }, [authLoading, isAuthenticated, navigate, userError]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     return () => {
//       const mainContainer = document.querySelector(".main-content");
//       if (mainContainer) mainContainer.scrollTop = 0;
//     };
//   }, []);

//   const isLoading = authLoading || userLoading || allUsersLoading;
//   if (isLoading) {
//     return <Spinner fullScreen />;
//   }

//   const sidebarGroups = [
//     {
//       title: t("sidebar.main"),
//       items: [
//         {
//           name: t("sidebar.dashboard"),
//           path: "/dashboard",
//           icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
//           roles: ["Admin", "Manager", "Employee"],
//         },
//         {
//           name: t("sidebar.documents"),
//           path: "/dashboard/documents",
//           icon: <File size={20} strokeWidth={1.5} />,
//           roles: ["Admin", "Manager"],
//         },
//       ],
//     },
//     {
//       title: t("sidebar.admin"),
//       items: [
//         {
//           name: t("sidebar.users"),
//           path: "/dashboard/users",
//           icon: <Users size={20} strokeWidth={1.5} />,
//           roles: ["Admin"],
//           children: [{ name: t("sidebar.allUsers"), path: "/dashboard/users" }],
//         },
//         {
//           name: t("sidebar.support"),
//           path: "/dashboard/support",
//           icon: <CircleHelpIcon size={20} strokeWidth={1.5} />,
//           roles: ["Admin", "Manager"],
//         },
//       ],
//     },
//   ];

//   const isEmployee = user?.roles[0].name.includes("Employee");

//   const filteredGroups = sidebarGroups
//     .map((group) => ({
//       ...group,
//       items: group.items.filter((item) =>
//         item.roles.some((role) =>
//           user?.roles?.some((userRole) => userRole.name === role)
//         )
//       ),
//     }))
//     .filter((group) => group.items.length > 0);

//   if (isAdmin) {
//     if (allUsersLoading) {
//       return <Spinner fullScreen />;
//     }
//     if (!allUsers) {
//       return <p>{t("loadingUsers")}</p>;
//     }
//   }

//   return (
//     <div className="min-h-screen flex" dir={isRtl ? "rtl" : "ltr"}>
//       {!isEmployee && (
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onToggle={setIsSidebarOpen}
//           groups={filteredGroups}
//           footer={
//             <Dropdown
//               position={`${isRtl ? "top-right" : "top-left"}`}
//               trigger={
//                 <div
//                   role="button"
//                   className="flex border items-center gap-3 px-2 py-2 rounded-md shadow-sm bg-white"
//                 >
//                   <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
//                     <UserCircle2 size={24} strokeWidth={1.5} />
//                   </div>
//                   {isSidebarOpen && (
//                     <>
//                       <div className="flex-1 truncate">
//                         <p className="text-sm font-medium">{user?.username}</p>
//                         <p className="text-xs font-light text-gray-500 text-muted-foreground truncate">
//                           {t(`roles.${user?.roles[0].name}`)}
//                         </p>
//                       </div>
//                       <Button
//                         variant="secondary"
//                         className="hover:bg-accent border-none rounded pt-1.5 pb-1.5 pr-1.5 pl-1.5"
//                       >
//                         <ChevronsUpDownIcon size={20} strokeWidth={1.5} />
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               }
//             >
//               <div className="p-2">
//                 <div className="flex items-center gap-3 px-2 py-2">
//                   <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
//                     {user ? (
//                       getInitials(user?.username as string)
//                     ) : (
//                       <UserRoundPen />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">{user?.username}</p>
//                     <p className="text-xs font-light text-gray-500 text-muted-foreground">
//                       {t(`roles.${user?.roles[0].name}`)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="border-t border-gray-200 my-2" />
//                 <Button
//                   variant="secondary"
//                   onClick={() => handleAccountSettings()}
//                   className="w-full flex items-center gap-1 mt-1 text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
//                 >
//                   <CircleUserRoundIcon size={16} strokeWidth={1.5} />
//                   {t("dropdown.account")}
//                 </Button>
//                 <div className="border-t border-gray-200 my-2" />
//                 <Button
//                   className="flex mt-1 items-center gap-1 w-full text-left px-3 py-2 text-sm"
//                   onClick={() => handleLogout()}
//                 >
//                   <LogOutIcon size={16} strokeWidth={1.5} />
//                   {t("dropdown.logout")}
//                 </Button>
//               </div>
//             </Dropdown>
//           }
//         />
//       )}

//       <div className="flex flex-col flex-1 min-h-0">
//         {isEmployee ? (
//           <header className="bg-white border-b px-8 py-4 shadow-sm">
//             <div className="px-4 flex justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <Logo className="block">
//                   <img className="w-24" src={img} alt={t("logoAlt")} />
//                 </Logo>
//               </div>
//               <Dropdown
//                 position="bottom-right"
//                 trigger={
//                   <div
//                     role="button"
//                     className="flex items-center border gap-2 xs:gap-3 px-2 xs:px-3 py-1.5 xs:py-2 rounded-full xs:rounded-xl"
//                   >
//                     <div className="h-8 w-8 xs:h-10 xs:w-10 shadow-sm rounded-full bg-accent flex items-center justify-center">
//                       {getInitials(user?.username as string)}
//                     </div>
//                     {isSidebarOpen && (
//                       <>
//                         <div className="flex-1 truncate hidden xs:block">
//                           <p className="text-xs xs:text-sm font-medium">
//                             {user?.username}
//                           </p>
//                           <p className="text-xs font-light text-gray-500 text-muted-foreground truncate">
//                             {t(`roles.${user?.roles[0].name}`)}
//                           </p>
//                         </div>
//                         <Button
//                           variant="secondary"
//                           className="hover:bg-accent border-none rounded pt-1 xs:pt-1.5 xs:pb-1.5 xs:pr-1.5 xs:pl-1.5"
//                         >
//                           <ChevronDownIcon size={16} strokeWidth={1.5} />
//                         </Button>
//                       </>
//                     )}
//                   </div>
//                 }
//               >
//                 <div className="p-1.5 xs:p-2">
//                   <Button
//                     onClick={() => navigate("/dashboard/account")}
//                     variant="secondary"
//                     className="w-full flex items-center gap-1 mt-1 text-left px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm hover:bg-gray-100 rounded"
//                   >
//                     <CircleUserRoundIcon size={14} strokeWidth={1.5} />
//                     {t("dropdown.account")}
//                   </Button>
//                   <div className="border-t border-gray-200 my-1 xs:my-2" />
//                   <div className={`flex`}>
//                     <Select
//                       id="language"
//                       name="language"
//                       value={i18n.language}
//                       onChange={async (
//                         value: string | string[] | undefined
//                       ) => {
//                         if (typeof value === "string") {
//                           await i18n.changeLanguage(value);
//                         }
//                       }}
//                       options={[
//                         { label: "Français", value: "fr" },
//                         { label: "العربية", value: "ar" },
//                       ]}
//                       placeholder={t("selectLanguage")}
//                       className={`w-full rounded-lg border-gray-200 ${
//                         isRtl
//                           ? "font-arabic text-right"
//                           : "font-french text-left"
//                       }`}
//                     />
//                   </div>
//                   <div className="border-t border-gray-200 my-1 xs:my-2" />
//                   <Button
//                     onClick={() => handleLogout()}
//                     className="flex mt-1 items-center gap-1 w-full text-left px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm"
//                   >
//                     <LogOutIcon size={14} strokeWidth={1.5} />
//                     {t("dropdown.logout")}
//                   </Button>
//                 </div>
//               </Dropdown>
//             </div>
//           </header>
//         ) : (
//           <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                 className="text-gray-700"
//                 aria-label={t("toggleSidebar")}
//               >
//                 {isSidebarOpen ? (
//                   <PanelRightOpenIcon strokeWidth={1} className="w-6 h-6" />
//                 ) : (
//                   <PanelLeftOpenIcon strokeWidth={1} className="w-6 h-6" />
//                 )}
//               </button>
//               <div>
//                 <h1 className="text-lg font-semibold">
//                   {user?.username || t("user")}
//                 </h1>
//               </div>
//             </div>
//             <div className={`flex`}>
//               <Select
//                 id="language"
//                 name="language"
//                 value={i18n.language}
//                 onChange={async (value: string | string[] | undefined) => {
//                   if (typeof value === "string") {
//                     await i18n.changeLanguage(value);
//                   }
//                 }}
//                 options={[
//                   { label: "Français", value: "fr" },
//                   { label: "العربية", value: "ar" },
//                 ]}
//                 placeholder={t("selectLanguage")}
//                 className={`w-fit rounded-lg border-gray-200 ${
//                   isRtl ? "font-arabic text-right" : "font-french text-left"
//                 }`}
//               />
//             </div>
//           </header>
//         )}

//         <div className="flex-1">
//           {!isEmployee && hasParentAndChildCrumbs && (
//             <div className="px-8 py-3 mt-2 shrink-0">
//               <EnterpriseBreadcrumbs />
//             </div>
//           )}

//           <AnimatePresence mode="wait">
//             <motion.main
//               key={location.pathname}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//                 transition: { duration: 0.3, ease: "easeOut" },
//               }}
//               exit={{ opacity: 0, y: 10 }}
//               className={`p-8 pt-2 min-h-full ${
//                 isRtl ? "font-arabic" : "Inter"
//               }`}
//             >
//               <Outlet />
//             </motion.main>
//           </AnimatePresence>
//         </div>

//         <div className="grid grid-cols-1 justify-center">
//           <Footer className="pt-2 pb-6 xs:pb-8 sm:pb-10 text-center text-xs xs:text-sm sm:text-sm">
//             <p className="px-4">
//               {t("footer", { year: new Date().getFullYear() })}
//             </p>
//           </Footer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import { FC, useEffect, useState } from "react";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LogOutIcon,
  LayoutDashboard,
  Users,
  File,
  UserRoundPen,
  ChevronsUpDownIcon,
  CircleUserRoundIcon,
  UserCircle2,
  ChevronDownIcon,
  PanelRightOpenIcon,
  CircleHelpIcon,
  PanelLeftOpenIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { EnterpriseBreadcrumbs } from "@/components/BreadCrumbs";
import { IUserResponse, Role, CustomRouteMatch } from "@/types/types";
import { useAppDispatch } from "@/store/hook";
import { RootState } from "@/store";
import { getUserProfile, getUsers, logoutUser } from "@/services/auth.service";
import { clearUser } from "@/store/slices/authSlice";
import Spinner from "@/components/ui/LoadingSpinner";
import Sidebar from "@/components/ui/Sidebar3";
import Button from "@/components/ui/Button";
import { getInitials } from "@/utils/getInitials";
import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
import { Footer } from "@/components/ui/Footer";
import Logo from "@/components/ui/Logo";
import img from "@/assets/app-logo.svg";
import { useTranslation } from "react-i18next";
import Select from "@/components/ui/Select";

const DashboardLayout: FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { isAuthenticated, isLoading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const matches = useMatches() as CustomRouteMatch[];

  const hasParentAndChildCrumbs = matches.some((match, index) => {
    const hasCrumb = !!match.handle && match.handle.crumb != null;
    if (!hasCrumb) return false;
    const hasChildWithCrumb = matches
      .slice(index + 1)
      .some(
        (childMatch) => !!childMatch.handle && childMatch.handle.crumb != null
      );
    return hasCrumb && hasChildWithCrumb;
  });

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery<IUserResponse | null, Error>({
    queryKey: ["user"],
    queryFn: getUserProfile,
    retry: false,
    enabled: !!isAuthenticated,
  });

  useEffect(() => {
    if (user && user.roles) {
      setIsAdmin(user.roles.some((role: Role) => role.name === "Admin"));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const { data: allUsers, isLoading: allUsersLoading } = useQuery<
    IUserResponse[],
    Error
  >({
    queryKey: ["users"],
    queryFn: getUsers,
    retry: false,
    enabled: !!isAuthenticated && isAdmin === true,
  });

  const { mutate: handleLogout } = useMutation<void, Error>({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.removeQueries({ queryKey: ["user"] });
      navigate("/auth", { replace: true });
    },
    onError: (error) => {
      setLogoutError(error.message || t("errors.genericError"));
    },
    onSettled: () => {
      setLogoutError(null);
    },
  });

  const handleAccountSettings = () => navigate("/dashboard/account");

  useEffect(() => {
    if (!authLoading && !isAuthenticated && userError) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate, userError]);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      const mainContainer = document.querySelector(".main-content");
      if (mainContainer) mainContainer.scrollTop = 0;
    };
  }, []);

  const isLoading = authLoading || userLoading || allUsersLoading;
  if (isLoading) {
    return <Spinner fullScreen />;
  }

  const sidebarGroups = [
    {
      title: t("sidebar.main"),
      items: [
        {
          name: t("sidebar.dashboard"),
          path: "/dashboard",
          icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
          roles: ["Admin", "Manager", "Employee"],
        },
        {
          name: t("sidebar.documents"),
          path: "/dashboard/documents",
          icon: <File size={20} strokeWidth={1.5} />,
          roles: ["Admin", "Manager"],
        },
      ],
    },
    {
      title: t("sidebar.admin"),
      items: [
        {
          name: t("sidebar.users"),
          path: "/dashboard/users",
          icon: <Users size={20} strokeWidth={1.5} />,
          roles: ["Admin"],
          children: [{ name: t("sidebar.allUsers"), path: "/dashboard/users" }],
        },
        {
          name: t("sidebar.support"),
          path: "/dashboard/support",
          icon: <CircleHelpIcon size={20} strokeWidth={1.5} />,
          roles: ["Admin", "Manager"],
        },
      ],
    },
  ];

  const isEmployee = user?.roles
    ? user.roles[0].name.includes("Employee")
    : false;

  const filteredGroups = sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.roles.some((role) =>
          user?.roles?.some((userRole) => userRole.name === role)
        )
      ),
    }))
    .filter((group) => group.items.length > 0);

  if (isAdmin) {
    if (allUsersLoading) {
      return <Spinner fullScreen />;
    }
    if (!allUsers) {
      return <p>{t("loadingUsers")}</p>;
    }
  }

  return (
    <div className="min-h-screen flex" dir={isRtl ? "rtl" : "ltr"}>
      {!isEmployee && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={setIsSidebarOpen}
          groups={filteredGroups}
          footer={
            <Dropdown
              position={`${isRtl ? "top-right" : "top-left"}`}
              trigger={
                <div
                  role="button"
                  className="flex border items-center gap-3 px-2 py-2 rounded-md shadow-sm bg-white"
                >
                  <div className="h-10 w-10 rounded-full bg-accent flex items- center justify-center">
                    <UserCircle2 size={24} strokeWidth={1.5} />
                  </div>
                  {isSidebarOpen && (
                    <>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium">
                          {user?.username ?? t("user")}
                        </p>
                        <p className="text-xs font-light text-gray-500 text-muted-foreground truncate">
                          {user?.roles
                            ? t(`roles.${user.roles[0].name}`)
                            : t("roles.Unknown")}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        className="hover:bg-accent border-none rounded pt-1.5 pb-1.5 pr-1.5 pl-1.5"
                      >
                        <ChevronsUpDownIcon size={20} strokeWidth={1.5} />
                      </Button>
                    </>
                  )}
                </div>
              }
            >
              <div className="p-2">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                    {user ? getInitials(user.username) : <UserRoundPen />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {user?.username ?? t("user")}
                    </p>
                    <p className="text-xs font-light text-gray-500 text-muted-foreground">
                      {user?.roles
                        ? t(`roles.${user.roles[0].name}`)
                        : t("roles.Unknown")}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 my-2" />
                <Button
                  variant="secondary"
                  onClick={() => handleAccountSettings()}
                  className="w-full flex items-center gap-1 mt-1 text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  <CircleUserRoundIcon size={16} strokeWidth={1.5} />
                  {t("dropdown.account")}
                </Button>
                <div className="border-t border-gray-200 my-2" />
                <Button
                  className="flex mt-1 items-center gap-1 w-full text-left px-3 py-2 text-sm"
                  onClick={() => handleLogout()}
                >
                  <LogOutIcon size={16} strokeWidth={1.5} />
                  {t("dropdown.logout")}
                </Button>
              </div>
            </Dropdown>
          }
        />
      )}

      <div className="flex flex-col flex-1 min-h-0">
        {isEmployee ? (
          <header className="bg-white border-b px-8 py-4 shadow-sm">
            <div className="px-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Logo className="block">
                  <img className="w-24" src={img} alt={t("logoAlt")} />
                </Logo>
              </div>
              <Dropdown
                position="bottom-right"
                trigger={
                  <div
                    role="button"
                    className="flex items-center border gap-2 xs:gap-3 px-2 xs:px-3 py-1.5 xs:py-2 rounded-full xs:rounded-xl"
                  >
                    <div className="h-8 w-8 xs:h-10 xs:w-10 shadow-sm rounded-full bg-accent flex items-center justify-center">
                      {user ? getInitials(user.username) : t("user")[0]}
                    </div>
                    {isSidebarOpen && (
                      <>
                        <div className="flex-1 truncate hidden xs:block">
                          <p className="text-xs xs:text-sm font-medium">
                            {user?.username ?? t("user")}
                          </p>
                          <p className="text-xs font-light text-gray-500 text-muted-foreground truncate">
                            {user?.roles
                              ? t(`roles.${user.roles[0].name}`)
                              : t("roles.Unknown")}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          className="hover:bg-accent border-none rounded pt-1 xs:pt-1.5 xs:pb-1.5 xs:pr-1.5 xs:pl-1.5"
                        >
                          <ChevronDownIcon size={16} strokeWidth={1.5} />
                        </Button>
                      </>
                    )}
                  </div>
                }
              >
                <div className="p-1.5 xs:p-2">
                  <Button
                    onClick={() => navigate("/dashboard/account")}
                    variant="secondary"
                    className="w-full flex items-center gap-1 mt-1 text-left px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm hover:bg-gray-100 rounded"
                  >
                    <CircleUserRoundIcon size={14} strokeWidth={1.5} />
                    {t("dropdown.account")}
                  </Button>
                  <div className="border-t border-gray-200 my-1 xs:my-2" />
                  <div className={`flex`}>
                    <Select
                      id="language"
                      name="language"
                      value={i18n.language}
                      onChange={async (
                        value: string | string[] | undefined
                      ) => {
                        if (typeof value === "string") {
                          await i18n.changeLanguage(value);
                        }
                      }}
                      options={[
                        { label: "Français", value: "fr" },
                        { label: "العربية", value: "ar" },
                      ]}
                      placeholder={t("selectLanguage")}
                      className={`w-full rounded-lg border-gray-200 ${
                        isRtl
                          ? "font-arabic text-right"
                          : "font-french text-left"
                      }`}
                    />
                  </div>
                  <div className="border-t border-gray-200 my-1 xs:my-2" />
                  <Button
                    onClick={() => handleLogout()}
                    className="flex mt-1 items-center gap-1 w-full text-left px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm"
                  >
                    <LogOutIcon size={14} strokeWidth={1.5} />
                    {t("dropdown.logout")}
                  </Button>
                </div>
              </Dropdown>
            </div>
          </header>
        ) : (
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-700"
                aria-label={t("toggleSidebar")}
              >
                {isSidebarOpen ? (
                  <PanelRightOpenIcon strokeWidth={1} className="w-6 h-6" />
                ) : (
                  <PanelLeftOpenIcon strokeWidth={1} className="w-6 h-6" />
                )}
              </button>
              <div>
                <h1 className="text-lg font-semibold">
                  {user?.username ?? t("user")}
                </h1>
              </div>
            </div>
            <div className={`flex`}>
              <Select
                id="language"
                name="language"
                value={i18n.language}
                onChange={async (value: string | string[] | undefined) => {
                  if (typeof value === "string") {
                    await i18n.changeLanguage(value);
                  }
                }}
                options={[
                  { label: "Français", value: "fr" },
                  { label: "العربية", value: "ar" },
                ]}
                placeholder={t("selectLanguage")}
                className={`w-fit rounded-lg border-gray-200 ${
                  isRtl ? "font-arabic text-right" : "font-french text-left"
                }`}
              />
            </div>
          </header>
        )}

        <div className="flex-1">
          {!isEmployee && hasParentAndChildCrumbs && (
            <div className="px-8 py-3 mt-2 shrink-0">
              <EnterpriseBreadcrumbs />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              exit={{ opacity: 0, y: 10 }}
              className={`p-8 pt-2 min-h-full ${
                isRtl ? "font-arabic" : "Inter"
              }`}
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 justify-center">
          <Footer className="pt-2 pb-6 xs:pb-8 sm:pb-10 text-center text-xs xs:text-sm sm:text-sm">
            <p className="px-4">
              {t("footer", { year: new Date().getFullYear() })}
            </p>
          </Footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
