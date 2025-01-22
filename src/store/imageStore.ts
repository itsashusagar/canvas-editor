import { create } from 'zustand';

interface ImageState {
  selectedImage: string | null;
  setSelectedImage: (url: string | null) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  selectedImage: null,
  setSelectedImage: (url) => set({ selectedImage: url }),
}));