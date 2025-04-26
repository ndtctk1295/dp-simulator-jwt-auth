'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'

import { ModalType } from '@/app/_services'
import { IPreparedAccount } from '@/lib/accountDisplayHelper'
import { DataTableColumnHeader } from './data-table-column-header'

interface ColumnProps{
  onModalOpen: (type: ModalType, data?: any) => void
}
export const useColumns = ({onModalOpen}: ColumnProps): ColumnDef<IPreparedAccount>[] => [  {
    accessorKey: "accountNo",
    header: "Account Number",
    cell: (row) => {
      return (
      <span
      className="hover:cursor-pointer"
      onClick={() => onModalOpen("account-details", row.row.original)}
    >
      {row.cell.getValue() + " "}
    </span>
      )
    }
  },
  {
    accessorKey: "availableBalance",
    header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Balance' />
        ),
    cell: (row) => {
      const amountValue = row.cell.getValue() as number;
      const currencyType = row.row.original.currency;
      const currencyString = currencyType === "USD" ? "$" : "VND";

      return (
        <span className={`font-bold`}>
          {amountValue.toLocaleString() + " "} 
          {currencyString}
        </span>
      );
    }
  },
  {
    accessorKey: "openDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created Date' />
    ),
    cell: (row) => {
      let dateData = ""
      dateData = row.cell.getValue() as string;
      return dateData.slice(0, 10);
    }
  },
  {
    accessorKey: "accountLabel",
    header: "Account Type"
  },
  {
    accessorKey: "isActive",
    header: 'Account Status',
    cell: (row) => {
      const isActive = row.cell.getValue() as boolean;
      return (
        <Badge variant={isActive ? 'active' : 'destructive'}>
          {isActive ? 'Hoạt Động' : 'Không Hoạt Động'}
        </Badge>
      )
    }
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
  // {
  //   id: 'actions',
  //   header: '',
  //   cell: ({ row }: { row: any }) => <DataTableRowActions row={row} />
  // }

]
