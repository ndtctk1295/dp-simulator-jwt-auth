// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONSENT_STATUS } from "@/app/constant/constant";
import { DataTableColumnHeader } from "./data-table-column-header";

interface ColumnProps {
  handleOpenModal: (consent: IConsent) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedConsent: (consent: IConsent) => void;
  revokeConsent: (consentId: string) => void;
  consents: IConsent[];
}

export const useColumns = ({ handleOpenModal, setIsModalOpen, setSelectedConsent, revokeConsent }: ColumnProps): ColumnDef<IConsent>[] => [
  {
    accessorKey: "index",
    header: "Index",
    cell: (row) => <span>{row.row.index + 1}</span>,
  },
  {
    accessorKey: "psuId",
    header: "Customer",
    cell: (row) => <span className="hover:cursor-pointer">{row.row.original.psuId}</span>,
  },
  {
    accessorKey: "dpTransactionId",
    header: "DP Transaction ID",
    cell: (row) => <span>{row.cell.getValue() as string}</span>,
  },
  {
    accessorKey: "created",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: (row) => {
      const dateData = row.cell.getValue() as string;
      return dateData.slice(0, 10);
    },
  },
  {
    accessorKey: "period",
    header: "Duration",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => (
      <Badge variant={consentBadge(row.getValue() as string)}>
        {row.getValue() as string}
      </Badge>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: (row) => {
      const consent = row.row.original;
      return (
        <>
          <Button
            className="mr-2"
            variant="outline"
            onClick={() => handleOpenModal(consent)}
          >
            View
          </Button>
          {consent.status === CONSENT_STATUS.AUTHORIZED ? (
            <Button variant="outline" onClick={() => {
              revokeConsent(consent.id);
              // setIsModalOpen(false);
            }}>Revoke</Button>
          ) : null}
        </>
      );
    },
  },
];

const consentBadge = (status: string) => {
  if (status === "AWAITING_AUTH") return "default";
  else if (status === "AUTHORIZED") return "active";
  else if (status === "REJECT" || status === "REVOKE") return "destructive";
  else return "secondary";
};
