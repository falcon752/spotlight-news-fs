import { create } from "zustand";
import axiosAdmin from "api/axiosAdmin";

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosAdmin.get("/posts");
      set({ posts: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createPost: async ({ title, content, categories = [], primaryImage }) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", content);
      formData.append("categories", JSON.stringify(categories));
      if (primaryImage) formData.append("img", primaryImage);

      const { data } = await axiosAdmin.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ posts: [...get().posts, data], loading: false });
      return data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default usePostStore;
