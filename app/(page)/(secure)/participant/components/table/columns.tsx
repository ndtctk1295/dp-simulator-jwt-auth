'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'

import { ModalType } from '@/app/_services'
import { IPreparedAccount } from '@/lib/accountDisplayHelper'
import { DataTableColumnHeader } from './data-table-column-header'
import { Button } from '@/components/ui/button'

interface ColumnProps{
  onModalOpen: (type: ModalType, data?: any) => void
}
export const useColumns = ({onModalOpen}: ColumnProps): ColumnDef<IParticipant>[] => [  
  {
    accessorKey: 'participantId',
    header: 'Participant ID'
  },
  {
    accessorKey: 'dpTppId',
    header: 'DP TPP ID'
  },
  {
    accessorKey: 'shortName',
    header: 'Short Name'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (row) => {
      const status = row.cell.getValue() as string;
      return (
        <Badge variant={
          status.toLowerCase() === 'accepted'
            ? 'active'
            : status.toLowerCase() === 'rejected'
              ? 'destructive'
              : 'default'
        }>
          {status}
        </Badge>
      );
    }
  },
  // {
  //   accessorKey: 'logo',
  //   header: 'Logo',
  //   cell: (row) => {
  //     const logo = row.cell.getValue() as string;
  //     return <img src={logo} alt="Logo" className="h-8 w-8" />;
  //   }
  // },
  {
    accessorKey: 'joinDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Join Date" />,
    cell: (row) => {
      const date = new Date(row.cell.getValue() as Date);
      return date.toLocaleDateString();
    }
  },
  {
    accessorKey: 'activeDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active Date" />,
    cell: (row) => {
      const date = new Date(row.cell.getValue() as Date);
      return date.toLocaleDateString();
    }
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="End Date" />,
    cell: (row) => {
      const date = new Date(row.cell.getValue() as Date);
      return date.toLocaleDateString();
        }
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: (row) => {
      const participant = row.row.original;
      return (
        <Button
          className="btn btn-primary"
          onClick={() => onModalOpen('edit-participant', participant)}
        >
          Edit
        </Button>
      );
        }
      }
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
