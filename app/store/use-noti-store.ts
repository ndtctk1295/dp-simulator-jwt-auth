import { create } from "zustand";

export interface NotiModel {
  id: number;
  message: string;
  details: string;
  time: string;
  target: string;
}

export interface NoitiStore {
  notifications: NotiModel[];
  setNotifications: (arrNoti: NotiModel[]) => void;

  isDialogOpen: boolean;
  setIsDialogOpen: (setDialogOpen: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (setModalOpen: boolean) => void;
}

export const useNotiStore = create<NoitiStore>((set) => ({
  notifications: [],
  setNotifications: (arrNoti: NotiModel[]) => set({ notifications: arrNoti }),

  isDialogOpen: false,
  setIsDialogOpen: (setDialogOpen: boolean) =>
    set({ isDialogOpen: setDialogOpen }),
  isModalOpen: false,

  setIsModalOpen: (setModalOpen: boolean) => set({ isModalOpen: setModalOpen }),
  
}));
