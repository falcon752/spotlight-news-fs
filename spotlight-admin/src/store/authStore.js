// src/store/authStore.js
import { create } from "zustand";
import axiosAdmin from "api/axiosAdmin";

const useAuthStore = create((set) => ({
  author: null,
  token: localStorage.getItem("token") || null, // ✅ hydrate token immediately
  notification: { type: null, message: null },
  loading: false, // ✅ track fetch state

  setAuth: (author, token) => {
    if (token) {
      axiosAdmin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    }
    set({ author, token });
  },

  logout: () => {
    delete axiosAdmin.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    set({ author: null, token: null });
  },

  fetchMe: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ author: null, token: null });
        return;
      }

      set({ loading: true });
      axiosAdmin.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axiosAdmin.get("/me");
      set({ author: res.data.author, token, loading: false });
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      set({ author: null, token: null, loading: false });
      localStorage.removeItem("token"); // ✅ clean up invalid token
    }
  },

  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axiosAdmin.post("/authors/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        author: { ...state.author, avatar: res.data.avatar },
        notification: {
          type: "success",
          message: "Profile picture updated successfully!",
        },
      }));

      return res.data.avatar;
    } catch (err) {
      console.error("Error uploading avatar:", err);
      set({
        notification: {
          type: "error",
          message: "Failed to update profile picture.",
        },
      });
      throw err;
    }
  },

  clearNotification: () =>
    set({ notification: { type: null, message: null } }),
}));

export default useAuthStore;
