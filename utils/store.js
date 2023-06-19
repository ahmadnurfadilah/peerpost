import { create } from "zustand";

export const useWriteStore = create((set) => ({
  title: "",
  showModalTitle: false,
  setTitle: (title) => set({ title: title }),
  setShowModalTitle: (status) => set({ showModalTitle: status }),
}));
