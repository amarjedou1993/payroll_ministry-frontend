import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          queryClient.setQueryData(["user"], null);
          navigate("/auth");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate, queryClient]);

  return null;
};

export default useAxiosInterceptor;
