import { create } from "zustand";

export type ModalType =
  | 'edit-participant'
  | 'register-participant'
  | 'logout-confirm'
  | "create-user"
  | "account-details"
  | "confirm-disable-account"
  | "settings-modal"
  | null; // export type ModalType = 'account-details'

export interface ModalStore<T> {
  isModalOpen: boolean;
  type: ModalType | null;
  data: T | null;
  onModalOpen: (type: ModalType, data?: T) => void;
  onModalClose: () => void;
}

export const useModal = create<ModalStore<any>>((set) => ({
  type: null,
  data: null,
  isModalOpen: false,
  onModalOpen: (type, data: any) => set({ isModalOpen: true, type, data }),
  onModalClose: () => set({ type: null, isModalOpen: false }),
}));
