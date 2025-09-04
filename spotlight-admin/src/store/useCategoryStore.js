import { create } from "zustand";
import axiosAdmin from "api/axiosAdmin"; // same axios instance used for auth

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosAdmin.get("/categories"); // token already in headers
      set({ categories: data, loading: false });
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      set({ error: err.message || "Failed to fetch categories", loading: false });
    }
  },

  // Create a new category
  createCategory: async (name) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosAdmin.post("/categories", { name });
      set({ categories: [...get().categories, data], loading: false });
      return data;
    } catch (err) {
      console.error("Failed to create category:", err);
      set({ loading: false, error: err.message || "Failed to create category" });
      throw err;
    }
  },

  // Update a category
  updateCategory: async (id, name) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosAdmin.put(`/categories/${id}`, { name });
      set({
        categories: get().categories.map((cat) => (cat.id === id ? data : cat)),
        loading: false,
      });
      return data;
    } catch (err) {
      console.error("Failed to update category:", err);
      set({ loading: false, error: err.message || "Failed to update category" });
      throw err;
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosAdmin.delete(`/categories/${id}`);
      set({
        categories: get().categories.filter((cat) => cat.id !== id),
        loading: false,
      });
    } catch (err) {
      console.error("Failed to delete category:", err);
      set({ loading: false, error: err.message || "Failed to delete category" });
      throw err;
    }
  },
}));
