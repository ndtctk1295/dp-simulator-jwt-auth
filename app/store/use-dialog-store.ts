import { create } from 'zustand'

export type DialogType =
  | 'logout-confirm'
  | 'delete-user-confirm'
  | 'update-user-confirm'
  | 'account-details'

interface DialogData {
  id?: string
  title?: string
  subTitle?: string
  btnCancel?: string
  btnContinue?: string
  handleCancel?: () => void
  handleContinue?: () => void
}

interface DialogStore {
  type: DialogType | null
  data: DialogData
  isDialogOpen: boolean
  onDialogOpen: (type: DialogType, data?: DialogData) => void
  onDialogClose: () => void
}

export const useDialog = create<DialogStore>((set) => ({
  type: null,
  data: {},
  isDialogOpen: false,
  onDialogOpen: (type, data = {}) => set({ isDialogOpen: true, type, data }),
  onDialogClose: () => set({ type: null, isDialogOpen: false, data: {} }),
}))
