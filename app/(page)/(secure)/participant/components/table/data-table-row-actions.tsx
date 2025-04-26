'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

// import { labels } from '../data/data'
import { useModal } from "@/app/_services"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const user = userSchema.parse(row.original)
  const { onModalOpen } = useModal()
  const account = row.original
  // console.log("account :>> ", account);
  return (
    <Button
      variant='ghost'
      className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
      onClick={() => onModalOpen('account-details', account)}
    >
      <DotsHorizontalIcon className='h-4 w-4' />
    </Button>
  )
}
