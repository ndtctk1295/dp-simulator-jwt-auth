"use client";

import { useModal } from "@/app/_services";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// import { AccountDetailsForm } from "../account-details-form";
import { ParticipantEditForm } from "../form/edit-participant-form";
export const EditParticipantModal = () => {
  const { isModalOpen, type, onModalClose, onModalOpen, data } = useModal();
  const isOpen = isModalOpen && type === "edit-participant"
//   const dataToSend : IParticipant = data;
  return (
    <Dialog open={isOpen} onOpenChange={onModalClose}>
    <DialogContent className="w-[80vw] max-w-[1200px] max-h-[100vh] overflow-y-auto p-6">
      <ParticipantEditForm defaultValues={data}/>
    </DialogContent>
  </Dialog>
  );
};
