import { create } from 'zustand';
import type { MPProfile } from '../data/types';

const MAX_COMPARE = 3;

interface CompareState {
  selectedMPs: MPProfile[];
  maxCompare: number;
  addMP: (mp: MPProfile) => boolean;
  removeMP: (mpId: string) => void;
  clearAll: () => void;
  isSelected: (mpId: string) => boolean;
  canAddMore: () => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selectedMPs: [],
  maxCompare: MAX_COMPARE,

  addMP: (mp) => {
    const current = get().selectedMPs;
    if (current.length >= MAX_COMPARE || current.find(m => m.id === mp.id)) {
      return false;
    }
    set({ selectedMPs: [...current, mp] });
    return true;
  },

  removeMP: (id) => set(s => ({
    selectedMPs: s.selectedMPs.filter(mp => mp.id !== id)
  })),

  clearAll: () => set({ selectedMPs: [] }),
  isSelected: (id) => get().selectedMPs.some(m => m.id === id),
  canAddMore: () => get().selectedMPs.length < MAX_COMPARE,
}));
