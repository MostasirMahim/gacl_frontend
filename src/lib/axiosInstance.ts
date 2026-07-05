import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development" || typeof window !== "undefined") {
      const logId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const status = response.status;
      const url = response.config.url || "UNKNOWN_URL";
      const responseData = response.data;

      console.group(`✅ [AXIOS_SUCCESS_${logId}] HTTP ${status} -> ${url}`);
      console.log("Request Method:", response.config.method?.toUpperCase());
      console.log("Response Data:", responseData);
      console.groupEnd();
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === "development" || typeof window !== "undefined") {
      const logId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const status = error?.response?.status || "NETWORK_ERR";
      const url = error?.config?.url || "UNKNOWN_URL";
      const responseData = error?.response?.data;

      console.group(`🚨 [AXIOS_ERR_${logId}] HTTP ${status} -> ${url}`);
      console.error("Request Method:", error?.config?.method?.toUpperCase());
      console.error("Request Data:", error?.config?.data);
      console.error("Server Response Payload:", responseData);
      console.groupEnd();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
