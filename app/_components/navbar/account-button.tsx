'use client'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserService } from '@/app/_services'
import { useRouter } from 'next/navigation'
import { useDialog } from '@/app/store/use-dialog-store'
import { useEffect } from 'react'
import { useUserStore } from '@/app/store/use-user-store'
import { useModal } from '@/app/store/use-modal-store'
const AccountButton = () => {
  const router = useRouter()
  const userService = useUserService()
  const { onDialogOpen } = useDialog()
  const { onModalOpen } = useModal()

  const { currentUser } = useUserStore()
  useEffect(() => {
    const fetchCurrentUser = async () => {
      // console.log(
      //   'Se chay lai ham nay o Account Button 1 lan thoi, F5 lai thi lai render lai'
      // )
      await userService.getCurrent()
    }

    fetchCurrentUser()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/02.png' alt='@shadcn' />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-2'>
            <p className='text-sm font-medium leading-none'>My Account</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onModalOpen('settings-modal')}>Settings</DropdownMenuItem>
        <DropdownMenuItem disabled>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            onModalOpen('logout-confirm', {})
          }
          className='cursor-pointer'
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountButton
