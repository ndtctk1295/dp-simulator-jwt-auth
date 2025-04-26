import { create } from "zustand";

export interface HomepageStore {
  isShowBalance: boolean;
  setShowBalance: (showBalance: boolean) => void;
  selectedAccounts: string[];
  setSelectedAccounts: (arrAcc: string[]) => void;
}

export const useHomepageStore = create<HomepageStore>((set) => ({
  isShowBalance: false,
  setShowBalance: (showBalance: boolean) => set({ isShowBalance: showBalance }),
  selectedAccounts: [],
  setSelectedAccounts: (arrAcc: string[]) =>
    set((state) => ({
      selectedAccounts: [...state.selectedAccounts, ...arrAcc],
    })),
}));
