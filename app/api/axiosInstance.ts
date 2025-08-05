import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken, logout } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_MY_BACKEND_URL as string;

const axiosInstance = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
   withCredentials: true,
});

// Response Interceptor
axiosInstance.interceptors.response.use(
   (response: AxiosResponse): AxiosResponse => response,
   async (error: any) => {
      const originalRequest = error.config;

      if (
         error.response &&
         (error.response.status === 401 || error.response.status === 403) &&
         !originalRequest._retry
      ) {
         originalRequest._retry = true;

         try {
            await refreshAccessToken();
            return axiosInstance(originalRequest);
         } catch (err) {
            logout();
            return Promise.reject(err);
         }
      }

      return Promise.reject(error);
   }
);

export default axiosInstance;
