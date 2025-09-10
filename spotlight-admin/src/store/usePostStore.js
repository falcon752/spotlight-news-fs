import { create } from "zustand";
import axiosAdmin from "api/axiosAdmin";

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  editingPost: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosAdmin.get("/posts");
      set({ posts: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createPost: async ({ title, desc, categories = [], primaryImage, date }) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      if (date) formData.append("date", date);

      categories.forEach((catId) => formData.append("categories[]", catId));
      if (primaryImage instanceof File) formData.append("img", primaryImage);

      const { data } = await axiosAdmin.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ posts: [...get().posts, data], loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },

  updatePost: async (
    id,
    { title, desc, categories = [], primaryImage, date }
  ) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("title", title || "");
      formData.append("desc", desc || "");
      if (date) formData.append("date", date);

      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error("You must select at least one category");
      }
      categories.forEach((catId) => formData.append("categories[]", catId));

      if (primaryImage instanceof File) formData.append("img", primaryImage);

      // ✅ Use POST + _method=PUT
      const { data } = await axiosAdmin.post(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { _method: "PUT" },
      });

      set({
        posts: get().posts.map((post) => (post.id === id ? data : post)),
        editingPost: null,
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

  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosAdmin.delete(`/posts/${id}`);
      set({
        posts: get().posts.filter((post) => post.id !== id),
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

  clearPosts: async () => {
    set({ loading: true, error: null });
    try {
      await axiosAdmin.delete("/posts/clear");
      set({ posts: [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },

  setEditingPost: (post) => set({ editingPost: post }),
  clearEditingPost: () => set({ editingPost: null }),
}));

export default usePostStore;
