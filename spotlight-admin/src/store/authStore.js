import { create } from "zustand";
import axiosAdmin from "api/axiosAdmin";

const useAuthStore = create((set) => ({
  author: null,
  token: null,
  authors: [],
  isLoading: false,
  error: null,
  notification: { type: null, message: null },

  // Set authentication
  setAuth: (author, token) => {
    if (token) {
      axiosAdmin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    }
    set({ author, token });
  },

  // Logout
  logout: () => {
    delete axiosAdmin.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    set({ author: null, token: null });
  },

  // Fetch current logged-in author
  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axiosAdmin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      const res = await axiosAdmin.get("/me");
      set({ author: res.data.author, token: token || null, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      set({ author: null, token: null, isLoading: false, error: err.message });
    }
  },

  // Fetch all authors
  fetchAuthors: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosAdmin.get("/authors");
      set({ authors: res.data, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch authors:", err);
      set({ authors: [], isLoading: false, error: err.message });
    }
  },

  // Update profile picture
  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axiosAdmin.post("/authors/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        author: { ...state.author, avatar_url: res.data.avatar },
        notification: { type: "success", message: "Profile picture updated successfully!" },
      }));

      return res.data.avatar;
    } catch (err) {
      console.error("Error uploading avatar:", err);
      set({ notification: { type: "error", message: "Failed to update profile picture." } });
      throw err;
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const res = await axiosAdmin.post("/login", { email, password });
      const { author, token } = res.data;
      useAuthStore.getState().setAuth(author, token);
      return author;
    } catch (err) {
      set({ notification: { type: "error", message: "Invalid credentials." } });
      throw err;
    }
  },

  // Register
  register: async (data) => {
    try {
      const res = await axiosAdmin.post("/register", data);
      const { author, token } = res.data;
      useAuthStore.getState().setAuth(author, token);
      return author;
    } catch (err) {
      set({ notification: { type: "error", message: "Failed to register." } });
      throw err;
    }
  },

  // Clear notification
  clearNotification: () => set({ notification: { type: null, message: null } }),
}));

export default useAuthStore;
