// src/store/useVideoStore.js
import { create } from "zustand";
import axiosClient, { BASE_URL } from "../api/axiosClient";

export const useVideoStore = create((set) => ({
  videos: [],
  loading: false,

  fetchVideos: async () => {
    set({ loading: true });
    try {
      const res = await axiosClient.get("/videos");

      const videos = res.map((video) => ({
        ...video,
        author: video.author
          ? {
              ...video.author,
              avatar: video.author.avatar
                ? `${BASE_URL}/storage/${video.author.avatar}`
                : null,
            }
          : null,
        date: video.created_at, // normalize date like posts
      }));

      set({ videos, loading: false });
    } catch (err) {
      console.error("Error fetching videos:", err);
      set({ loading: false, videos: [] });
    }
  },
}));
