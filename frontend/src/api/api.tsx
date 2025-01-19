import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: baseURL,
});


api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("@ir-simulator:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.data.message === "Token invalid") {
        sessionStorage.removeItem("@ir-simulator:token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);