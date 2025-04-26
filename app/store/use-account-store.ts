import {create} from "zustand";

export interface AccountStore{
    accounts: IAccount[];
    account: IAccount | undefined;
    currentAccount: IAccount | undefined;
    setAccounts: (accounts: IAccount[]) => void;
    setAccount: (account: IAccount) => void;
    setCurrentAccount: (account: IAccount) => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
    accounts: [] as IAccount[],
    account: undefined,
    currentAccount: undefined,
    setAccounts: (accounts) => set({accounts}),
    setAccount: (account) => set({account}),
    setCurrentAccount: (account) => set({currentAccount: account}),
}));