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
import { ParticipantRegisterForm } from "../form/register-participant-form";
export const RegisterParticipantModal = () => {
  const { isModalOpen, type, onModalClose, onModalOpen, data } = useModal();
  const isOpen = isModalOpen && type === "register-participant"
  return (
    <Dialog open={isOpen} onOpenChange={onModalClose}>
    <DialogContent className="w-[80vw] max-w-[1200px] max-h-[100vh] overflow-y-auto p-6">
      {/* <DialogHeader className="px-4">
        <DialogTitle className="text-2xl">Đăng ký Thành viên Mới</DialogTitle>
        <DialogDescription className="pt-2">
          Vui lòng điền đầy đủ thông tin bên dưới để đăng ký thành viên mới
        </DialogDescription>
      </DialogHeader> */}
      
      <ParticipantRegisterForm onClose={onModalClose}/>
      
      {/* <DialogFooter className="px-4 pt-4">
        <Button variant="secondary" onClick={onModalClose}>
          Hủy
        </Button>
      </DialogFooter> */}
    </DialogContent>
  </Dialog>
  );
};
