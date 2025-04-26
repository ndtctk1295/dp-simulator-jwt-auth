// OverviewConsent.tsx
"use client";

import { DataTable } from "@/app/(page)/(secure)/consent/components/table/data-table";
import { DataTableColumnHeader } from "@/app/(page)/(secure)/consent/components/table/data-table-column-header";
import { useConsentStore, useNotiStore } from "@/app/_services";
import { useAccountService } from "@/app/_services/use-accounts-service";
import { useConsentService } from "@/app/_services/use-consents-service";
import { CONSENT_STATUS } from "@/app/constant/constant";
import useLoadingStore from "@/app/store/LoadingStore";
import { useAccountStore } from "@/app/store/use-account-store";
import { useUserStore } from "@/app/store/use-user-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApprovePartnerModal from "./modals/ApproveModal";
import { FilterFormComp } from "./FilterConsentComp";
import { useColumns } from "@/app/(page)/(secure)/consent/components/table/columns";

export default function ConsentManagement() {
  const [tableLoader, setTableLoader] = useState(true);
  const { setLoading } = useLoadingStore();
  const [selectedConsent, setSelectedConsent] = useState<IConsent | null>(null);
  const { isModalOpen, setIsModalOpen } = useNotiStore();
  const { consents, filters } = useConsentStore();
  const { accounts } = useAccountStore();
  const accountService = useAccountService();
  const consentService = useConsentService();
  const { currentUser } = useUserStore();

  const columns = useColumns({  
    handleOpenModal: (consent: IConsent) => {
      setSelectedConsent(consent);
      setIsModalOpen(true);
    },
    setIsModalOpen,
    setSelectedConsent, 
    revokeConsent: consentService.revokeConsent,
    consents
  });

  useEffect(() => {
    if (currentUser?.id) {
      fetchData(currentUser.id);
    }
  }, [currentUser]);

  const fetchData = async (userId: string) => {
    try {
      setLoading(true, "Processing Request", "Getting Consents Data");
      await accountService.getByUserId(userId);
      // Initial load: fetch all consents (filters are empty)
      await consentService.getFilteredConsents(userId, filters);
      setLoading(false);
      setTableLoader(false);
      toast.success("Get consents data successful", { id: "get-consents-success" });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Danh sách Consents</h2>
        <div className="flex items-center gap-4">
          <FilterFormComp />
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={consents}
          isLoading={tableLoader}
          filters={filters}
        />
      </div>
      <ApprovePartnerModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        consentData={selectedConsent || ({} as IConsent)}
        accountsData={accounts}
      />
    </div>
  );
}
