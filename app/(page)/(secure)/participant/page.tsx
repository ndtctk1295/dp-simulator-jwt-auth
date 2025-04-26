"use client";
import { Button } from "@/components/ui/button";
import ApprovePartnerModal from "../consent/components/modals/ApproveModal";
import { useColumns } from "./components/table/columns";
import { DataTable } from "./components/table/data-table";
import { useModal } from "@/app/store/use-modal-store";
import { useParticipantStore } from "@/app/store/use-participant-store";
import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/custom-multi-select";
export default function ParticipantPage() {
  const { onModalOpen } = useModal();
  const columns = useColumns({
    onModalOpen,
  });
  const { participants } = useParticipantStore();

  const [selected, setSelected] = useState<string[]>([]);
  const options = ["Frontend", "Backend", "DevOps", "UX Design", "Product Management"];

  useEffect(() => {
      console.log("selected :>> ", selected);
  }, [selected])

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <h1 className="text-2xl font-bold mb-4">Participant</h1>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            onModalOpen("register-participant");
          }}
        >
          Register
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={participants} />
      </div>
    </main>
  );
}
