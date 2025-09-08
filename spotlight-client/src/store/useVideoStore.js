// src/store/useVideoStore.js
import { create } from "zustand";
import axiosClient from "../api/axiosClient";

const useVideoStore = create((set) => ({
  videos: [],       // initial state

  // Fetch videos from backend
  fetchVideos: async () => {
    try {
      const videos = await axiosClient.get("/videos");
      set({ videos });
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  },
}));

export default useVideoStore;
