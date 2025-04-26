import { set } from 'mongoose';
import {create} from "zustand";

export interface IFilterTransaction{
    fromDate: Date | null;
    toDate: Date | null;
    paymentStatus: string;
    account: string;
}

export interface TransactionStore{
    transactions: ITransaction[];
    transaction: ITransaction ;
    currentTransaction: ITransaction ;
    filters: IFilterTransaction
    setTransactions: (transactions: ITransaction[]) => void;
    setTransaction: (transaction: ITransaction) => void;
    setCurrentTransaction: (transaction: ITransaction) => void;
    setFilters: (filters: IFilterTransaction) => void;

}

export const useTransactionStore = create<TransactionStore>((set) => ({
    transactions: [] as ITransaction[],
    transaction: {} as ITransaction,
    currentTransaction: {} as ITransaction,
    filters: {
        fromDate: null,
        toDate: null,
        paymentStatus: "",
        account: "",
    },
    setFilters: (filters) => set({filters}),
    setTransactions: (transactions) => set({transactions}),
    setTransaction: (transaction) => set({transaction}),
    setCurrentTransaction: (transaction) => set({currentTransaction: transaction}),
}));