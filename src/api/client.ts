// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
//   withCredentials: true,
// });

// export default axiosInstance;

import axios from "axios";
import i18n from "@/i18n";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://185.98.137.109:3000/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = i18n.language;
  return config;
});

export default axiosInstance;
