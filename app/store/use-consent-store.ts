import { create } from "zustand";

export interface IFilterConsent {
  name: string;
  fromDate: Date | null;
  toDate: Date | null;
  status: string;
  customer: string;
  duration: string;
}

interface ConsentStore {
  consents: IConsent[];
  filters: IFilterConsent;
  setFilters: (filters: IFilterConsent) => void;
  setConsents: (consents: IConsent[]) => void;
}

export const useConsentStore = create<ConsentStore>((set) => ({
  consents: [],
  filters: {
    name: "",
    fromDate: null,
    toDate: null,
    status: "",
    customer: "",
    duration: "",
  },
  setFilters: (filters) => set({ filters }),
  setConsents: (consents) => set({ consents }),
}));
