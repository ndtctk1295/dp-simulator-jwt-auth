"use client";

import { useModal } from "@/app/_services";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountDetailsForm } from "../account-details-form";
export const AccountDetailsModal = () => {
  const { isModalOpen, type, onModalClose, onModalOpen, data } = useModal();
  const isOpen = isModalOpen && type === "account-details"
  return (
    <Dialog open={isOpen} onOpenChange={onModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
        </DialogHeader>
        <AccountDetailsForm defaultValues={data} />
        <DialogFooter>
          <Button variant="secondary" onClick={onModalClose}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
