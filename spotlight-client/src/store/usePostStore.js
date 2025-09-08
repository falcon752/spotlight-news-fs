// src/store/usePostStore.js
import { create } from "zustand";
import axiosClient, { BASE_URL } from "../api/axiosClient";

export const usePostStore = create((set) => ({
  posts: [],
  post: null,
  categories: [],
  loading: false,
  error: null,

  // Fetch all posts
  fetchPosts: async () => {
    set({ loading: true, error: null });
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
      }));
      set({ posts });
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch a single post by ID
  fetchPostById: async (id) => {
    set({ loading: true, error: null });
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
        },
      });
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await axiosClient.get("/categories");
      set({ categories });
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
