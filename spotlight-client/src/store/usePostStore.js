import { create } from "zustand";
import axiosClient, { BASE_URL } from "../api/axiosClient";

export const usePostStore = create((set) => ({
  posts: [],
  post: null,
  categories: [],
  postsLoading: false,
  categoriesLoading: false,
  error: null,

  // Fetch all posts
  fetchPosts: async () => {
    set({ postsLoading: true, error: null });
    try {
      const data = await axiosClient.get("/posts");
      const posts = data.map((post) => ({
        ...post,
        img: post.img ? `${BASE_URL}/storage/${post.img}` : null,
        author: post.author
          ? {
              ...post.author,
              avatar: post.author.avatar
                ? `${BASE_URL}/storage/${post.author.avatar}`
                : null,
            }
          : null,
        date: post.created_at, // normalize date
      }));
      set({ posts });
    } catch (err) {
      console.error("Error fetching posts:", err);
      set({ error: err.message });
    } finally {
      set({ postsLoading: false });
    }
  },

  // Fetch a single post by ID
  fetchPostById: async (id) => {
    set({ postsLoading: true, error: null });
    try {
      const post = await axiosClient.get(`/posts/${id}`);
      set({
        post: {
          ...post,
          img: post.img ? `${BASE_URL}/storage/${post.img}` : null,
          author: post.author
            ? {
                ...post.author,
                avatar: post.author.avatar
                  ? `${BASE_URL}/storage/${post.author.avatar}`
                  : null,
              }
            : null,
          date: post.created_at,
        },
      });
    } catch (err) {
      console.error("Error fetching post by ID:", err);
      set({ error: err.message });
    } finally {
      set({ postsLoading: false });
    }
  },

  // Fetch all categories
  fetchCategories: async () => {
    set({ categoriesLoading: true, error: null });
    try {
      const categories = await axiosClient.get("/categories");
      set({ categories });
    } catch (err) {
      console.error("Error fetching categories:", err);
      set({ error: err.message });
    } finally {
      set({ categoriesLoading: false });
    }
  },
}));
