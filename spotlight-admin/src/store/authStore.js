// src/stores/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  author: null,   // Logged-in author data
  token: null,    // JWT token from Laravel
  setAuth: (author, token) => set({ author, token }),
  logout: () => set({ author: null, token: null }),
}));

export default useAuthStore;
