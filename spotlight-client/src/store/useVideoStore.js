import { create } from "zustand";
import axiosClient, { BASE_URL } from "../api/axiosClient";

export const useVideoStore = create((set, get) => ({
  videos: [],
  videosLoading: false,
  videosFetched: false,  // new flag
  error: null,

  fetchVideos: async () => {
    if (get().videosFetched) return; // skip if already fetched
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
        date: video.created_at,
      }));
      set({ videos, videosFetched: true });
    } catch (err) {
      console.error("Error fetching videos:", err);
      set({ videos: [], error: err.message });
    } finally {
      set({ videosLoading: false });
    }
  },
}));
