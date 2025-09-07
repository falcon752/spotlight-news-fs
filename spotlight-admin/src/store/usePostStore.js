import { create } from "zustand";
import axiosAdmin from "api/axiosAdmin";

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  // Fetch all posts with categories
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosAdmin.get("/posts"); // backend returns posts with categories
      set({ posts: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Create a new post
  createPost: async ({
    title,
    content,
    categories = [],
    primaryImage,
    date,
  }) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", content);
      if (date) formData.append("date", date);

      // Append categories as array
      categories.forEach((catId) => formData.append("categories[]", catId));

      if (primaryImage) formData.append("img", primaryImage);

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

  // Update an existing post
  updatePost: async (
    id,
    { title, content, categories = [], primaryImage, date }
  ) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      if (title) formData.append("title", title);
      if (content) formData.append("desc", content);
      if (date) formData.append("date", date);

      // Append categories if provided
      if (categories.length) {
        categories.forEach((catId) => formData.append("categories[]", catId));
      }

      if (primaryImage) formData.append("img", primaryImage);

      const { data } = await axiosAdmin.post(
        `/posts/${id}?_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      set({
        posts: get().posts.map((post) => (post.id === id ? data : post)),
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

  // Delete a post
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
      await axiosAdmin.delete("/posts/clear"); // 🔹 backend endpoint
      set({ posts: [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },
}));

export default usePostStore;
