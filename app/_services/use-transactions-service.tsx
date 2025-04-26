import { create } from "zustand";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "react-hot-toast";
import { useFetch } from "@/app/_helpers/client";
import { IFilterTransaction, useTransactionStore } from "../store/use-transaction-store";
import { fi } from "@faker-js/faker";

export function useTransactionService(): ITransactionService {
  const fetch = useFetch();
  const router = useRouter();
  const { transactions, transaction, currentTransaction, setCurrentTransaction, setTransaction, setTransactions } = useTransactionStore();
  return {
    getByUserId: async (userId) => {
      try{
        const transactions = await fetch.get(`/api/transactions/${userId}`);
        setTransactions(transactions);
      }catch (error){
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    },
    findByDpTransactionId: async (dpTransactionId) => {
      try {
        const transactions = await fetch.get(
          `/api/transactions/dp-transactionId/${dpTransactionId}`
        );
        return transactions;
      }catch (error){
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data", {id: 'get-transactions-error'});
      }
    },
    getFilteredTransactions: async (userId: string, filters: IFilterTransaction) => {
      try {
        const response = await fetch.post(`/api/transactions`, {
          userId,   // Send userId in the body
          filters,  // Send filters in the body
        });
        setTransactions(response); // Store the filtered transactions
      } catch (error) {
        console.error("Error fetching filtered transactions:", error);
        toast.error("Failed to fetch data", {id: 'get-transactions-error'});
        throw error;
      }
    },
  }
}




interface ITransactionService  {
  getByUserId: (userId: string) => Promise<void>;
  findByDpTransactionId: (dpTransactionId: string) => Promise<any>;
  getFilteredTransactions: (userId: string, filters: IFilterTransaction) => Promise<void>;
}
