// import { useCallback, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useDispatch } from "react-redux";
// import { AlertCircleIcon, LogInIcon } from "lucide-react";
// import { motion } from "framer-motion";
// import { useTranslation } from "react-i18next";
// // import useAxiosInterceptor from "@/hooks/useAxiosInterceptor";
// import axiosInstance from "@/api/client";
// import { getUserProfile } from "@/services/auth.service";
// import { setUser } from "@/store/slices/authSlice";
// import Spinner from "@/components/ui/LoadingSpinner";
// import Logo from "@/components/ui/Logo";
// import Form from "@/components/ui/form/Form";
// import { FormField } from "@/components/ui/form/FormField";
// import Input from "@/components/ui/Input";
// import Checkbox from "@/components/ui/form/Checkbox";
// import Link from "@/components/ui/Link";
// import Button from "@/components/ui/Button";
// import { Footer } from "@/components/ui/Footer";
// import img from "@/assets/app-logo.svg";
// import slogan from "@/assets/Logo-white.svg";
// import sloganAR from "@/assets/sloganArWhite.svg";
// import { LoginFormData, loginSchema } from "@/types/login";
// import Select from "@/components/ui/Select";

// const loginUser = async (data: LoginFormData): Promise<void> => {
//   await axiosInstance.post("/auth/login", data);
// };

// const Auth = () => {
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.language === "ar";

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema(t)),
//     defaultValues: {
//       rememberMe: localStorage.getItem("rememberMe") === "true",
//     },
//   });

//   const { mutate, isPending } = useMutation({
//     mutationFn: loginUser,
//     retry: false,
//     onSuccess: async () => {
//       const userProfile = await getUserProfile();
//       dispatch(setUser(userProfile));
//       navigate("/dashboard");
//     },
//     onError: (err: any) => {
//       let message = t("errors.genericError");
//       if (err.response) {
//         const status = err.response.status;
//         const backendMessage = err.response.data?.message || "";
//         if (status === 401) {
//           message = backendMessage || t("errors.invalidCredentials");
//         } else if (status === 500) {
//           message = t("errors.serverError");
//         }
//       }
//       setErrorMessage(message);
//     },
//   });

//   const onSubmit = useCallback(
//     (data: LoginFormData) => {
//       setErrorMessage("");
//       mutate(data);
//     },
//     [mutate]
//   );

//   return (
//     <div
//       dir={isRtl ? "rtl" : "ltr"}
//       className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] min-h-screen bg-white"
//     >
//       {isPending && <Spinner fullScreen />}

//       {/* Left Column - Form */}
//       <div className="px-8 grid items-center max-w-xl mx-auto w-full relative z-10">
//         <div className="space-y-3 py-12">
//           {/* Language Switcher */}
//           <div className={`flex`}>
//             <Select
//               id="language"
//               name="language"
//               value={i18n.language}
//               onChange={async (value: string | string[] | undefined) => {
//                 if (typeof value === "string") {
//                   await i18n.changeLanguage(value);
//                 }
//               }}
//               options={[
//                 { label: "Français", value: "fr" },
//                 { label: "العربية", value: "ar" },
//               ]}
//               placeholder={t("selectLanguage")}
//               className={`w-fit rounded-lg border-gray-200 ${
//                 isRtl ? "font-arabic text-right" : "font-french text-left"
//               }`}
//             />
//           </div>

//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex flex-col items-center gap-4"
//           >
//             <Logo>
//               <img src={img} alt={t("portal")} className="w-48" />
//             </Logo>
//           </motion.div>

//           {/* Login Card */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-white rounded-2xl shadow-custom-soft p-8"
//           >
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-800">
//                 {t("welcome")}
//               </h2>
//               <p className="text-gray-500 mt-1 text-sm">{t("loginPrompt")}</p>
//             </div>

//             <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* Username Field */}
//               <FormField label={t("username")} htmlFor="username">
//                 <Input
//                   {...register("username")}
//                   type="text"
//                   placeholder={t("usernamePlaceholder")}
//                   className="rounded-lg py-3 px-4 border-gray-200 focus:ring-2 focus:ring-emerald-500"
//                   aria-invalid={!!errors.username}
//                 />
//                 {errors.username && (
//                   <div className="flex items-center mt-2 text-red-600 text-sm">
//                     <AlertCircleIcon className="w-4 h-4 mr-1" />
//                     {errors.username.message}
//                   </div>
//                 )}
//               </FormField>

//               {/* Password Field */}
//               <FormField label={t("password")} htmlFor="password">
//                 <div className="relative">
//                   <Input
//                     {...register("password")}
//                     type={showPassword ? "text" : "password"}
//                     placeholder={t("passwordPlaceholder")}
//                     className="rounded-lg py-3 px-4 border-gray-200 focus:ring-2 focus:ring-emerald-500"
//                     aria-invalid={!!errors.password}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className={`absolute ${
//                       isRtl ? "left-3" : "right-3"
//                     }  top-3 text-gray-400 hover:text-emerald-600 transition-colors`}
//                     // style={{ [isRtl ? "left" : "right"]: "0.75rem" }}
//                     aria-label={t(
//                       showPassword ? "hidePassword" : "showPassword"
//                     )}
//                   >
//                     {showPassword ? (
//                       <FaEyeSlash className="w-5 h-5" />
//                     ) : (
//                       <FaEye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <div className="flex items-center mt-2 text-red-600 text-sm">
//                     <AlertCircleIcon className="w-4 h-4 mr-1" />
//                     {errors.password.message}
//                   </div>
//                 )}
//               </FormField>

//               {/* Checkbox and Link */}
//               <div className="flex items-center justify-between">
//                 <Checkbox
//                   id="rememberMe"
//                   label={t("rememberMe")}
//                   {...register("rememberMe")}
//                   className="text-sm text-gray-600"
//                 />
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
//                 >
//                   {t("forgotPassword")}
//                 </Link>
//               </div>

//               {/* Error Message */}
//               {errorMessage && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3"
//                 >
//                   <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
//                   <span className="text-red-600 text-sm">{errorMessage}</span>
//                 </motion.div>
//               )}

//               {/* Login Button */}
//               <Button
//                 type="submit"
//                 loading={isPending}
//                 className="flex items-center gap-1 justify-center w-full py-3.5 text-sm font-medium rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md transition-all"
//               >
//                 {t("login")}
//                 <LogInIcon className="w-4 h-4 ml-2" />
//               </Button>
//             </Form>

//             {/* Signup Link */}
//             {/* <div className="mt-6 text-center text-sm text-gray-500">
//               {t("noAccount")}{" "}
//               <Link
//                 to="/create-account"
//                 className="font-medium text-emerald-600 hover:text-emerald-700"
//               >
//                 {t("requestAccess")}
//               </Link>
//             </div> */}
//           </motion.div>
//         </div>

//         {/* Footer */}
//         <Footer className="mt-12 text-center pb-6 xs:pb-8 sm:pb-10 text-sm text-gray-400">
//           <p
//             dangerouslySetInnerHTML={{
//               __html: t("footer", { year: new Date().getFullYear() }),
//             }}
//           />
//         </Footer>
//       </div>

//       {/* Right Column - Hero Section */}
//       <div
//         className={`hidden lg:block relative ${
//           isRtl
//             ? "rounded-br-[3rem] rounded-tr-[3rem]"
//             : "rounded-bl-[3rem] rounded-tl-[3rem]"
//         } overflow-hidden  bg-gradient-to-br from-emerald-800 to-green-900`}
//       >
//         {/* Animated Background */}
//         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

//         {/* Content */}
//         <div className="relative h-full flex flex-col justify-center px-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="max-w-3xl mx-auto"
//           >
//             <div className="mb-8 animate-float">
//               <img
//                 src={isRtl ? sloganAR : slogan}
//                 alt={t("heroTitle")}
//                 className="w-full mx-auto filter drop-shadow-lg"
//               />
//             </div>

//             <div className="space-y-6 text-center">
//               <h1 className="text-4xl font-bold text-white leading-tight">
//                 {t("heroTitle")}
//                 <br />
//                 <span className="bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
//                   {t("heroSubtitle")}
//                 </span>
//               </h1>
//               <p className="text-lg text-emerald-100 font-light leading-relaxed">
//                 {t("heroDescription")}
//               </p>
//             </div>

//             {/* Security Badges */}
//             {/* <div className="mt-12 flex justify-center gap-6 opacity-90">
//               <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
//                 <ShieldCheckIcon className="w-6 h-6 text-emerald-300" />
//                 <span className="text-sm text-white">{t("encryption")}</span>
//               </div>
//               <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
//                 <FingerprintIcon className="w-6 h-6 text-emerald-300" />
//                 <span className="text-sm text-white">{t("biometric")}</span>
//               </div>
//             </div> */}
//           </motion.div>
//         </div>

//         {/* Animated Particles */}
//         <div className="absolute inset-0 opacity-30">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-1 h-1 bg-white rounded-full"
//               style={{
//                 top: `${Math.random() * 100}%`,
//                 left: `${Math.random() * 100}%`,
//                 animation: `float ${5 + (i % 3)}s infinite ease-in-out`,
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AlertCircleIcon, LogInIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
// import useAxiosInterceptor from "@/hooks/useAxiosInterceptor";
import axiosInstance from "@/api/client";
import { getUserProfile } from "@/services/auth.service";
import { setUser } from "@/store/slices/authSlice";
import Spinner from "@/components/ui/LoadingSpinner";
import Logo from "@/components/ui/Logo";
import Form from "@/components/ui/form/Form";
import { FormField } from "@/components/ui/form/FormField";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/form/Checkbox";
import Link from "@/components/ui/Link";
import Button from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";
import img from "@/assets/app-logo.svg";
import slogan from "@/assets/Logo-white.svg";
import sloganAR from "@/assets/sloganArWhite.svg";
import { LoginFormData, loginSchema } from "@/types/login";
import Select from "@/components/ui/Select";

const loginUser = async (data: LoginFormData): Promise<void> => {
  await axiosInstance.post("/auth/login", data);
};

const Auth = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      rememberMe: localStorage.getItem("rememberMe") === "true",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    retry: false,
    onSuccess: async () => {
      const userProfile = await getUserProfile();
      dispatch(setUser(userProfile));
      navigate("/dashboard");
    },
    onError: (err: any) => {
      let message = t("errors.genericError");
      if (err.response) {
        const status = err.response.status;
        const backendMessage = err.response.data?.message || "";
        if (status === 401) {
          message = backendMessage || t("errors.invalidCredentials");
        } else if (status === 500) {
          message = t("errors.serverError");
        }
      }
      setErrorMessage(message);
    },
  });

  const onSubmit = useCallback(
    (data: LoginFormData) => {
      setErrorMessage("");
      mutate(data);
    },
    [mutate]
  );

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] min-h-screen bg-white"
    >
      {isPending && <Spinner fullScreen />}

      {/* Left Column - Form */}
      <div className="px-8 grid items-center max-w-xl mx-auto w-full relative z-10">
        <div className="space-y-3 py-12">
          {/* Language Switcher */}
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <Logo>
              <img src={img} alt={t("portal")} className="w-48" />
            </Logo>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-custom-soft p-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                {t("welcome")}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">{t("loginPrompt")}</p>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <FormField label={t("username")} htmlFor="username">
                <Input
                  {...register("username")}
                  type="text"
                  placeholder={t("usernamePlaceholder")}
                  className="rounded-lg py-3 px-4 border-gray-200 focus:ring-2 focus:ring-emerald-500"
                  aria-invalid={!!errors.username}
                />
                {errors.username && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircleIcon className="w-4 h-4 mr-1" />
                    {errors.username.message}
                  </div>
                )}
              </FormField>

              {/* Password Field */}
              <FormField label={t("password")} htmlFor="password">
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    className="rounded-lg py-3 px-4 border-gray-200 focus:ring-2 focus:ring-emerald-500"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${
                      isRtl ? "left-3" : "right-3"
                    }  top-3 text-gray-400 hover:text-emerald-600 transition-colors`}
                    // style={{ [isRtl ? "left" : "right"]: "0.75rem" }}
                    aria-label={t(
                      showPassword ? "hidePassword" : "showPassword"
                    )}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircleIcon className="w-4 h-4 mr-1" />
                    {errors.password.message}
                  </div>
                )}
              </FormField>

              {/* Checkbox and Link */}
              <div className="flex items-center justify-between">
                <Checkbox
                  id="rememberMe"
                  label={t("rememberMe")}
                  {...register("rememberMe")}
                  className="text-sm text-gray-600"
                />
                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3"
                >
                  <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-600 text-sm">{errorMessage}</span>
                </motion.div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                loading={isPending}
                className="flex items-center gap-1 justify-center w-full py-3.5 text-sm font-medium rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md transition-all"
              >
                {t("login")}
                <LogInIcon className="w-4 h-4 ml-2" />
              </Button>
            </Form>

            {/* Signup Link */}
            {/* <div className="mt-6 text-center text-sm text-gray-500">
              {t("noAccount")}{" "}
              <Link
                to="/create-account"
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                {t("requestAccess")}
              </Link>
            </div> */}
          </motion.div>
        </div>

        {/* Footer */}
        <Footer className="mt-12 text-center pb-6 xs:pb-8 sm:pb-10 text-sm text-gray-400">
          <p
            dangerouslySetInnerHTML={{
              __html: t("footer", { year: new Date().getFullYear() }),
            }}
          />
        </Footer>
      </div>

      {/* Right Column - Hero Section */}
      <div
        className={`hidden lg:block relative ${
          isRtl
            ? "rounded-br-[3rem] rounded-tr-[3rem]"
            : "rounded-bl-[3rem] rounded-tl-[3rem]"
        } overflow-hidden  bg-gradient-to-br from-emerald-800 to-green-900`}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-8 animate-float">
              <img
                src={isRtl ? sloganAR : slogan}
                alt={t("heroTitle")}
                className="w-full mx-auto filter drop-shadow-lg"
              />
            </div>

            <div className="space-y-6 text-center">
              <h1 className="text-4xl font-bold text-white leading-tight">
                {t("heroTitle")}
                <br />
                <span className="bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
                  {t("heroSubtitle")}
                </span>
              </h1>
              <p className="text-lg text-emerald-100 font-light leading-relaxed">
                {t("heroDescription")}
              </p>
            </div>

            {/* Security Badges */}
            {/* <div className="mt-12 flex justify-center gap-6 opacity-90">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-300" />
                <span className="text-sm text-white">{t("encryption")}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
                <FingerprintIcon className="w-6 h-6 text-emerald-300" />
                <span className="text-sm text-white">{t("biometric")}</span>
              </div>
            </div> */}
          </motion.div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${5 + (i % 3)}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auth;
