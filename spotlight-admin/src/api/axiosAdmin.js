// src/api/axiosAdmin.js
import axios from "axios";
import useAuthStore from "../store/authStore";

const axiosAdmin = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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
