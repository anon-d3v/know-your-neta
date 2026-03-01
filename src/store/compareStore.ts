import { create } from 'zustand';
import type { MPProfile } from '../data/types';

const MAX_COMPARE = 3;

interface CompareState {
  selectedMPs: MPProfile[];
  autoOpen: boolean;
  maxCompare: number;
  addMP: (mp: MPProfile) => boolean;
  removeMP: (mpId: string) => void;
  setMPs: (mps: MPProfile[]) => void;
  clearAll: () => void;
  clearAutoOpen: () => void;
  isSelected: (mpId: string) => boolean;
  canAddMore: () => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selectedMPs: [],
  autoOpen: false,
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

  setMPs: (mps) => set({ selectedMPs: mps.slice(0, MAX_COMPARE), autoOpen: true }),

  clearAll: () => set({ selectedMPs: [], autoOpen: false }),
  clearAutoOpen: () => set({ autoOpen: false }),
  isSelected: (id) => get().selectedMPs.some(m => m.id === id),
  canAddMore: () => get().selectedMPs.length < MAX_COMPARE,
}));
