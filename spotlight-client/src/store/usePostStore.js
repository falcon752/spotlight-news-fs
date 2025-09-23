import { create } from "zustand";
import axiosClient, { BASE_URL } from "../api/axiosClient";

export const usePostStore = create((set, get) => ({
  posts: [],
  post: null,
  categories: [],
  postsLoading: false,
  categoriesLoading: false,
  postsFetched: false,
  categoriesFetched: false,
  error: null,

  // Fetch all posts
  fetchPosts: async () => {
    if (get().postsFetched) return; // skip if already fetched
    set({ postsLoading: true, error: null });
    try {
      const data = await axiosClient.get("/posts");
      const posts = data.map((post) => ({
        ...post,
        img: post.img ? `${BASE_URL}/storage/${post.img}` : null,
        slug: post.slug, // ensure slug is present from backend
        author: post.author
          ? {
              ...post.author,
              avatar: post.author.avatar
                ? `${BASE_URL}/storage/${post.author.avatar}`
                : `/assets/default_avatar.png`, // fallback avatar
            }
          : { avatar: `/assets/default_avatar.png` },
        date: post.created_at,
        views: post.views || 0,
      }));
      set({ posts, postsFetched: true });
    } catch (err) {
      console.error("Error fetching posts:", err);
      set({ error: err.message });
    } finally {
      set({ postsLoading: false });
    }
  },

  // Fetch all categories
  fetchCategories: async () => {
    if (get().categoriesFetched) return;
    set({ categoriesLoading: true, error: null });
    try {
      const categories = await axiosClient.get("/categories");
      set({ categories, categoriesFetched: true });
    } catch (err) {
      console.error("Error fetching categories:", err);
      set({ error: err.message });
    } finally {
      set({ categoriesLoading: false });
    }
  },

  // Increment post view count
  incrementPostView: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, views: (post.views || 0) + 1 } : post
      ),
    }));

    // Optional: update server
    axiosClient.post(`/posts/${postId}/increment-view`).catch((err) => {
      console.error("Failed to increment post view:", err);
    });
  },
}));
