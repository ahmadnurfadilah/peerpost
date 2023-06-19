import { create } from "zustand";

export const useWriteStore = create((set) => ({
  title: "",
  description: "",
  showModalTitle: false,
  setTitle: (title) => set({ title: title }),
  setDescription: (description) => set({ description: description }),
  setShowModalTitle: (status) => set({ showModalTitle: status }),
}));
