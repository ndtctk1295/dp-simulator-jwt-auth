import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean, message?: string, action?: string) => void;
  disableGetStatusButton: boolean;
  setDisableGetStatusButton: (isDisable: boolean) => void;
  disableSubmitButton: boolean;
  setDisableSubmitButton: (isDisable: boolean) => void;
  disableCancelButton: boolean;
  setDisableCancelButton: (isDisable: boolean) => void;

  setDefaultShowButton: () => void;
  setConfirmTransactionButton: () => void;
  allDone: boolean;
  setAllDone: (done: boolean) => void;

  message: string;
  action: string;
}

const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  setLoading: (loading, message = "Loading...", action = "Please wait") =>
    set({ loading, message, action }),
  setDefaultShowButton: () =>
    set({
      allDone: false,
      disableGetStatusButton: false,
      disableSubmitButton: true,
      disableCancelButton: true,
    }),
  setConfirmTransactionButton: () => {
    set({
      allDone: false,
      disableGetStatusButton: true,
      disableSubmitButton: false,
      disableCancelButton: false,
    });
  },
  disableGetStatusButton: false,
  setDisableGetStatusButton: (isDisable) =>
    set({ disableGetStatusButton: isDisable }),
  disableSubmitButton: true,
  setDisableSubmitButton: (isDisable) =>
    set({ disableSubmitButton: isDisable }),
  disableCancelButton: true,
  setDisableCancelButton: (isDisable) =>
    set({ disableCancelButton: isDisable }),
  allDone: false,
  setAllDone: (allDone) => set({ allDone }),
  message: "Loading...",
  action: "Please wait...",
}));

export default useLoadingStore;
