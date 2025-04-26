'use client';
import { Metadata } from 'next'

import { LoadingOverlay } from '@/app/_components/loading/LoadingComp'
import { useUserService, useAccountService, useModal } from '@/app/_services';
import useLoadingStore from '@/app/store/LoadingStore';
import { useAccountStore } from '@/app/store/use-account-store';
import { useUserStore } from '@/app/store/use-user-store';
import prepareAccountsForDisplay from '@/lib/accountDisplayHelper';
import { useState, useMemo, useEffect, use } from 'react';
import toast from 'react-hot-toast';
import { useColumns } from './components/table/columns';
import { DataTable } from './components/table/data-table';

export default function UsersPage() {
  const {setLoading} = useLoadingStore();
  const {currentUser} = useUserStore();
  const userService = useUserService()
  const accountService = useAccountService()
  const [isLoading, setIsLoading] = useState(true)
  const {accounts} = useAccountStore();
  const { onModalOpen } = useModal();
  const preparedAccounts = useMemo(() => prepareAccountsForDisplay(accounts), [accounts]);
  useEffect(() => {
    if(currentUser?.id){
      fetchData(currentUser.id);
    }
  }, [currentUser]);

  const fetchData = async (userId: string) => {
    try {
      // console.log("userId :>> ", userId);
      if (userId) {
        setLoading(true,"Processing Request", "Getting Accounts Data");
        await accountService.getByUserId(userId);
        setLoading(false);
        if(accounts && accounts.length > 0){
          toast.success('Get accounts successful', {id:'get-accounts-success'});
        }
      }
      // console.log('currentUser :>> ', currentUser);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if(preparedAccounts.length > 0){
      setIsLoading(false)
      console.log('preparedAccounts :>> ', preparedAccounts);
    }
  }, [preparedAccounts]);

  const columns = useColumns({
    onModalOpen
  })

  return <>
      <div className='flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 '>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Accounts</h2>
          </div>
        </div>
        <DataTable data={preparedAccounts} columns={columns} isLoading={isLoading} />
      </div>
  <LoadingOverlay/>
  </>
}
