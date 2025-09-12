import { create } from "zustand";
import axiosAdmin from "api/axiosAdmin";

const usePageVisitStore = create((set) => ({
  totalVisits: 0,
  loading: false,
  error: null,

  fetchTotalVisits: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosAdmin.get("/page-visit/total");
      set({ totalVisits: data.total, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default usePageVisitStore;
