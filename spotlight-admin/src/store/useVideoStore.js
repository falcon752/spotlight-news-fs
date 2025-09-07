import { create } from "zustand";
import axiosAdmin from "../api/axiosAdmin"; // ✅ your axios instance

const useVideoStore = create((set) => ({
  videos: [],

  fetchVideos: async () => {
    const res = await axiosAdmin.get("/videos");
    set({ videos: res.data });
  },

  createVideo: async (payload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("desc", payload.content);
    formData.append("video_url", payload.videoUrl);
    formData.append("author_id", payload.authorId);

    if (payload.thumbnail) {
      formData.append("thumbnail", payload.thumbnail);
    }

    await axiosAdmin.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 🔹 Delete a single video
  deleteVideo: async (id) => {
    await axiosAdmin.delete(`/videos/${id}`);
    set((state) => ({
      videos: state.videos.filter((video) => video.id !== id),
    }));
  },

  // 🔹 Clear all videos
  clearVideos: async () => {
    await axiosAdmin.delete("/videos/clear");
    set({ videos: [] });
  },
}));

export default useVideoStore;
