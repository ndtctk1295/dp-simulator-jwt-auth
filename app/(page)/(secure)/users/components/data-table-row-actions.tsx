'use client'

import { DotsHorizontalIcon, Pencil1Icon, CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import {Pencil} from 'lucide-react'
import { Row } from '@tanstack/react-table'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useDialog } from '@/app/store/use-dialog-store'
import { useModal, useUserService } from '@/app/_services'
import { useUserStore } from '@/app/store/use-user-store'
import { StatusChangeDialog } from './modals/status-change-alert-modal'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  table?: any; // Optional table prop that can be passed in
}

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const user = row.original as IUser
  const { onDialogOpen } = useDialog()
  const { onModalOpen } = useModal()
  const userService = useUserService()
  const userStore = useUserStore();
  
  // State for status change dialogs
  const [activeDialogOpen, setActiveDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Get meta from context instead of directly from row.table
  const meta = table?.options.meta as any;

  // Handle setting user status to active
  const handleSetActive = async () => {
    if (!user.id) return
    
    try {
      setIsProcessing(true)
      await userService.update(user.id, { status: 'active' })
      setActiveDialogOpen(false)
    } catch (error) {
      console.error('Error updating user status:', error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Handle setting user status to delete
  const handleSetDelete = async () => {
    if (!user.id) return
    
    try {
      setIsProcessing(true)
      await userService.update(user.id, { status: 'delete' })
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error updating user status:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => meta?.handleStartEditing(row)}
          >
            Edit
            <DropdownMenuShortcut>
              <Pencil1Icon/>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          {/* Status change action buttons */}
          {(user.status === 'pending' || user.status === 'delete') && (
            <DropdownMenuItem onClick={() => setActiveDialogOpen(true)}>
              Set as Active
              <DropdownMenuShortcut>
                <CheckCircledIcon/>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          
          {user.status === 'active' && (
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              Set as Delete
              <DropdownMenuShortcut>
                <CrossCircledIcon/>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}          
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Status change confirmation dialogs */}
      <StatusChangeDialog
        open={activeDialogOpen}
        onOpenChange={setActiveDialogOpen}
        title="Activate User"
        description={`Are you sure you want to set ${user.firstName} ${user.lastName}'s status to active?`}
        onConfirm={handleSetActive}
        confirmText="Activate"
        loading={isProcessing}
      />
      
      <StatusChangeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Set User to Delete"
        description={`Are you sure you want to set ${user.firstName} ${user.lastName}'s status to delete?`}
        onConfirm={handleSetDelete}
        confirmText="Set Delete"
        loading={isProcessing}
      />
    </>
  )
}