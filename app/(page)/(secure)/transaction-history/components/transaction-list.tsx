
import { DataTable } from "@/app/(page)/(secure)/transaction-history/components/table/data-table";
import { DataTableColumnHeader } from "@/app/(page)/(secure)/transaction-history/components/table/data-table-column-header";
import { useUserService } from "@/app/_services";
import { useAccountService } from "@/app/_services/use-accounts-service";
import {
  useTransactionService,
} from "@/app/_services/use-transactions-service";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useTransactionStore } from "@/app/store/use-transaction-store";
import { useUserStore } from "@/app/store/use-user-store";
import useLoadingStore from "@/app/store/LoadingStore";
import toast from "react-hot-toast";
import { columns } from "@/app/(page)/(secure)/transaction-history/components/table/columns";
import { FilterTransactionComp } from "./FilterTransactionComp";
export function TransactionList() {
  const {setLoading, loading} = useLoadingStore();
  const { transactions, filters } = useTransactionStore();
  const [tableLoader, setTableLoader] = useState(true);
  const accountService = useAccountService();
  const transactionService = useTransactionService();
  const userService = useUserService();
  const {currentUser} = useUserStore();
  useEffect(() => {
    fetchData(currentUser?.id!);
  }, [currentUser]);
  
  const fetchData = async (userId: string) => {
    try {
      if (userId) {
        setLoading(true, "Processing Request", "Getting Transactions Data");
        await accountService.getByUserId(userId);
        // await transactionService.getByUserId(userId);
        await transactionService.getFilteredTransactions(userId, filters);
        setLoading(false);
        // setTableLoader(false);
        toast.success('Get transactions data successful', {id: 'get-transaction-success'});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Use a useEffect to log when transactions change
  useEffect(() => {
    // console.log("Updated transactions:", transactions);
  }, [transactions]); // This will log every time `transactions` changes

  return (
    <>
    <DataTable data={transactions} isLoading={loading} columns={columns} />
    </>
    // <></>
  );
}
