// src/store/useVideoStore.js
import { create } from "zustand";
import axiosClient from "../api/axiosClient";


export const useVideoStore = create((set) => ({
  videos: [],
  loading: false,

  fetchVideos: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosClient.get("/api/videos"); // backend endpoint
      set({ videos: data, loading: false });
    } catch (err) {
      console.error("Error fetching videos:", err);
      set({ loading: false });
    }
  },
}));
