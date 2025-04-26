'use client'

import { useEffect, useMemo, useState } from 'react'
import { columns } from './components/columns'
// import { DataTable } from './components/data-table-with-inline-edit'
import { useUserService } from '@/app/_services'
import { useUserStore } from '@/app/store/use-user-store'
import { DataTable } from './components/data-table'
import { Button } from '@/components/ui/button'
const UsersClient = () => {
  const userService = useUserService()
  const userStore = useUserStore();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    userService.getAll(() => setIsLoading(false))
  }, [])

  const formatedUser = useMemo(() => {
    return userStore?.users?.map((user) => ({
      id: user.id || '', // Nếu id không tồn tại, gán giá trị rỗng
      avatar: '',
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      role: user.role,
    }))
  }, [userStore.users])

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 '>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
          <p className='text-muted-foreground'>Here&apos;s a list of users - Updated Interface</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsLoading(true)}>Refresh</Button>
          <Button onClick={() => alert('Export feature coming soon!')}>Export</Button>
        </div>
      </div>
      <DataTable data={formatedUser} columns={columns} isLoading={isLoading} />
    </div>
  )
}

export default UsersClient
