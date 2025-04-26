import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { useConsentStore } from "@/app/store/use-consent-store";
import { useUserStore } from "@/app/store/use-user-store";
import { useConsentService } from "@/app/_services/use-consents-service";
import { CustomCalendar } from "@/components/ui/custom-calendar";

export function FilterFormComp() {
  const { filters, setFilters } = useConsentStore();
  const { currentUser } = useUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const consentService = useConsentService();
  const [open, setOpen] = useState(false);
  const minEndDate = filters.fromDate || undefined;
  const currentDate = new Date();

  const handleApply = async () => {
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
    await consentService.getFilteredConsents(currentUser?.id!, filters);
    clearFilters();
    setOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      fromDate: null,
      toDate: null,
      status: "",
      customer: "",
      duration: "",
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
          <SheetTitle>Filter Consent</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Customer Name Input */}
          <div className="grid items-center gap-4">
            <Input
              id="customer"
              placeholder="Customer Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div className="grid items-center gap-4">
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AWAITING_AUTH">AWAITING_AUTH</SelectItem>
                <SelectItem value="AUTHORIZED">AUTHORIZED</SelectItem>
                <SelectItem value="REVOKE">REVOKE</SelectItem>
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
                      const startDate = new Date(date);
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
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">
              {errorMessage}
            </div>
          )}
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
