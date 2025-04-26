import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Filter } from "lucide-react";
import { useTransactionStore } from "@/app/store/use-transaction-store";
import { useUserStore } from "@/app/store/use-user-store";
import { useTransactionService } from "@/app/_services/use-transactions-service";
import { useAccountService } from "@/app/_services/use-accounts-service";
import { useAccountStore } from "@/app/store/use-account-store";
import prepareAccountsForDisplay from "@/lib/accountDisplayHelper";

export function FilterTransactionComp() {
  const { filters, setFilters } = useTransactionStore();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useUserStore();
  const transactionService = useTransactionService();
  const accountService = useAccountService();
  const { accounts } = useAccountStore();
  const preparedAccounts = useMemo(() => prepareAccountsForDisplay(accounts), [accounts]);

  useEffect(() => {
    if (currentUser?.id) {
      accountService.getByUserId(currentUser.id);
    }
  }, [currentUser]);

  const minEndDate = filters.fromDate || undefined;

  const currentDate = new Date();

  const handleApply = async () => {
    // console.log('filters', filters);
    if (filters.fromDate && !filters.toDate) {
      setErrorMessage("Please select an end date.");
      return;
    }
    if (!filters.fromDate && filters.toDate) {
      setErrorMessage("Please select a start date.");
      return;
    }

    if (filters.fromDate && filters.toDate) {
      const diffTime = Math.abs(new Date(filters.toDate).getTime() - new Date(filters.fromDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Convert ms to days
      if (diffDays > 30) {
        setErrorMessage("The date range cannot exceed 30 days.");
        return;
      }
    }

    setErrorMessage(""); // Clear error message if validation passes
    await transactionService.getFilteredTransactions(currentUser?.id!, filters);
    clearFilters();
    setOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      fromDate: null,
      toDate: null,
      paymentStatus: "",
      account: "",
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="hidden sm:flex" onClick={() => setOpen(true)}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Transactions</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Account Input */}
          <div className="grid items-center gap-4">
            <Select
              value={filters.account}
              onValueChange={(value) => setFilters({ ...filters, account: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {preparedAccounts.map((account) =>
                  account.id ? (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountNo} - {account.accountLabel}
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div className="grid items-center gap-4">
            <Select
              value={filters.paymentStatus}
              onValueChange={(value) => setFilters({ ...filters, paymentStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACSC">Accepted Settlement Completed</SelectItem>
                <SelectItem value="ACSP">Accepted Settlement in Progress</SelectItem>
                <SelectItem value="PDNG">Pending</SelectItem>
                <SelectItem value="CANC">Cancelled</SelectItem>
                <SelectItem value="RJCT">Rejected</SelectItem>
                <SelectItem value="EXPR">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date Picker */}
          <div className="grid items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-3">
                  {filters.fromDate ? (
                    filters.fromDate.toLocaleDateString("en-GB")
                  ) : (
                    <span>Pick a start date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomCalendar
                  mode="single"
                  selected={filters.fromDate!}
                  onSelect={(date) => {
                    if (date) {
                      // console.log('date', date);
                      const startDate = new Date(date);
                      // console.log('startDate', startDate);
                      startDate.setHours(0, 0, 0, 0); // Set to the very start of the day (local time)
                      setFilters({ ...filters, fromDate: startDate });
                    } else {
                      setFilters({ ...filters, fromDate: null });
                    }
                  }}
                  initialFocus
                  maxDate={currentDate} 
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="grid items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-3">
                  {filters.toDate ? (
                    filters.toDate.toLocaleDateString("en-GB")
                  ) : (
                    <span>Pick an end date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CustomCalendar
                  mode="single"
                  selected={filters.toDate!}
                  onSelect={(date) => {
                    if (date) {
                      const endDate = new Date(date);
                      endDate.setHours(23, 59, 59, 999); // Set to the very end of the day (local time)
                      setFilters({ ...filters, toDate: endDate });
                    } else {
                      setFilters({ ...filters, toDate: null });
                    }
                  }}
                  initialFocus
                  minDate={minEndDate}
                  maxDate={currentDate} 
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">
              {errorMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={clearFilters} variant="secondary">
              Clear
            </Button>
            <Button onClick={handleApply} variant="default">
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
