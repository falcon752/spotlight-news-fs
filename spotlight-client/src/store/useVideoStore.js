// src/store/useVideoStore.js
import { create } from "zustand";
import axiosClient, { BASE_URL } from "../api/axiosClient";

export const useVideoStore = create((set) => ({
  videos: [],
  videosLoading: false,
  error: null,

  // Fetch all videos
  fetchVideos: async () => {
    set({ videosLoading: true, error: null });
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
        date: video.created_at, // use DB created_at directly
      }));

      set({ videos });
    } catch (err) {
      console.error("Error fetching videos:", err);
      set({ videos: [], error: err.message });
    } finally {
      set({ videosLoading: false });
    }
  },

  // Fetch a single video by ID
  fetchVideoById: async (id) => {
    set({ videosLoading: true, error: null });
    try {
      const video = await axiosClient.get(`/videos/${id}`);
      set({
        videos: [
          {
            ...video,
            author: video.author
              ? {
                  ...video.author,
                  avatar: video.author.avatar
                    ? `${BASE_URL}/storage/${video.author.avatar}`
                    : null,
                }
              : null,
            date: video.created_at,
          },
        ],
      });
    } catch (err) {
      console.error("Error fetching video by ID:", err);
      set({ videos: [], error: err.message });
    } finally {
      set({ videosLoading: false });
    }
  },
}));
