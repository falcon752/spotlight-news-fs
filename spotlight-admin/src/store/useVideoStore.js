import { create } from "zustand";
import axiosAdmin from "api/axiosAdmin";

const useVideoStore = create((set, get) => ({
  videos: [],
  loading: false,
  error: null,
  editingVideo: null, //  for edit mode

  // Fetch all videos
  fetchVideos: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosAdmin.get("/videos");
      set({ videos: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Create new video
  createVideo: async ({ title, content, videoUrl, authorId, thumbnail }) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", content);
      formData.append("video_url", videoUrl);
      if (authorId) formData.append("author_id", authorId);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const { data } = await axiosAdmin.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ videos: [...get().videos, data], loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },

  // Update video
  updateVideo: async (id, { title, desc, videoUrl, authorId, thumbnail }) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (desc) formData.append("desc", desc); //  FIXED: use desc instead of content
      if (videoUrl) formData.append("video_url", videoUrl);
      if (authorId) formData.append("author_id", authorId);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const { data } = await axiosAdmin.post(
        `/videos/${id}?_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      set({
        videos: get().videos.map((video) => (video.id === id ? data : video)),
        editingVideo: null,
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },

  // Delete a single video
  deleteVideo: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosAdmin.delete(`/videos/${id}`);
      set({
        videos: get().videos.filter((video) => video.id !== id),
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },

  // Clear all videos
  clearVideos: async () => {
    set({ loading: true, error: null });
    try {
      await axiosAdmin.delete("/videos/clear"); // axiosAdmin should send auth
      set({ videos: [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },

  // 🔹 Edit mode handlers
  setEditingVideo: (video) => set({ editingVideo: video }),
  clearEditingVideo: () => set({ editingVideo: null }),
}));

export default useVideoStore;
