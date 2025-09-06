import { create } from "zustand";
import axiosAdmin from "../api/axiosAdmin"; // ✅ use your axios instance

const useVideoStore = create((set) => ({
  videos: [],

  fetchVideos: async () => {
    const res = await axiosAdmin.get("/videos"); // uses backend baseURL
    set({ videos: res.data });
  },

  createVideo: async (payload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("desc", payload.content);
    formData.append("video_url", payload.videoUrl);
    formData.append("author_id", payload.authorId);

    // frontend will generate thumbnail; backend doesn't need it
    if (payload.thumbnail) {
      formData.append("thumbnail", payload.thumbnail);
    }

    await axiosAdmin.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
}));

export default useVideoStore;
