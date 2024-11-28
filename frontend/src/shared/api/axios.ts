import axios from "axios";
import type { ResponseData } from "./interfaces";
const isDevelopment = process.env.NODE_ENV === "development";

const baseURL = isDevelopment
  ? process.env.REACT_APP_API_URL + "api/"
  : window.location.origin + "api/";

const api = axios.create({
  baseURL: baseURL,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("refresh_token="))
          ?.split("=")[1];

        const response = await axios.post(`${baseURL}/users/reauth`, {
          refreshToken,
        });
        const { accessToken } = response.data as ResponseData;

        localStorage.setItem("accessToken", accessToken);
        setAuthToken(accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error (e.g., logout user)
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
