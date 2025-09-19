// src/api/axiosAdmin.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const axiosAdmin = axios.create({
    baseURL: process.env.REACT_APP_API_URL + "/api",
  withCredentials: true,
});


// Request interceptor to add token
axiosAdmin.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAdmin;
