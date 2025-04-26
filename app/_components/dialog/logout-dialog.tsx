'use client'

import { useUserService } from '@/app/_services'
import { useDialog } from '@/app/store/use-dialog-store'
import {useModal} from '@/app/store/use-modal-store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useEffect } from 'react'

export const LogoutDialog = () => {
  const { isModalOpen, type, onModalClose } = useModal();
  const isOpen = isModalOpen && type === "logout-confirm"
  const userService = useUserService();
  const handleLogout = () => {
    userService.logout();
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={onModalClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to logout?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
