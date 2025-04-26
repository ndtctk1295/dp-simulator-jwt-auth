
import { useRouter } from 'next/navigation'

import { useFetch } from '@/app/_helpers/client'
import { toast } from 'react-hot-toast'
import { useAccountStore } from '../store/use-account-store'

export function useAccountService(): IAccountService {
  const fetch = useFetch()
  const router = useRouter()
  const { accounts, account, currentAccount, setCurrentAccount, setAccounts, setAccount } = useAccountStore()
  return {
    getCurrent: async () => {
      try {
        if (!currentAccount) {
          setCurrentAccount(await fetch.get('/api/users/current'))
        }
      }catch (error){
        console.error("Error getting current user data:", error);
        toast.error("Failed to get current user data");
      }

    },
    getAll: async (...callbacks) => {
      try{
        setAccounts(await fetch.get('/api/users'))
        for (const callback of callbacks) {
          if (typeof callback === 'function') await callback()
        }
      }catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    },
    delete: async (id) => {
      try {
        const response = await fetch.delete(`/api/users/${id}`)
        // remove deleted user from state
        setAccounts(accounts!.filter((x) => x.id !== id))
        // logout if the user deleted their own record
        if (response.deletedSelf) {
          router.push('/login')
        }

        toast.success('Delete user successful')
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    getByUserId: async (userId) => {
      try {
        const accounts = await fetch.get(`/api/bankAccounts/getByUserId/${userId}`)
        setAccounts(accounts);
        if(accounts && accounts.length > 0){
          // toast.success('Get accounts successful');
        }
        // for (const callback of callbacks) {
        //   if (typeof callback === 'function') await callback();
        // }
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!');
      }
    },
        getById: async (id, ...callbacks) => {
          try {
            setAccount(await fetch.get(`/api/bankAccounts/${id}`))
            for (const callback of callbacks) {
              if (typeof callback === 'function') await callback()
            }
          } catch (error: any) {
            toast.error(error ? error : 'Something went wrong!')
          }
        },

    update: async (id, params, ...callbacks) => {
      try {
        await fetch.put(`/api/users/${id}`, params)
        toast.success('Update User successful')

        // update current user if the user updated their own record
        if (id === currentAccount?.id) {
          
          setCurrentAccount({ ...currentAccount, ...params })
        }

        // update the list users
        const newUsers = accounts.map((x) =>
          x.id === id ? { ...x, ...params } : x
        )
        
        setAccounts(newUsers)

        for (const callback of callbacks) {
          if (typeof callback === 'function') await callback()
        }
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    modify: async (email: string) => {
    //   accountStore.setState({
    //     currentAccount: {
    //       firstName: 'xxx',
    //       lastName: 'yyy',
    //       email: email,
    //     },
    //   })
    },
  }
}




interface IAccountService  {
  getCurrent: () => Promise<void>
  getAll: (...callbacks: (() => void | Promise<void>)[]) => Promise<void>
  delete: (id: string) => Promise<void>
  getByUserId: (
    userId: string,
    ...callbacks: (() => void | Promise<void>)[]
  ) => Promise<void>
  update: (
    id: string,
    params: Partial<IAccount>,
    ...callbacks: (() => void | Promise<void>)[]
  ) => Promise<void>
  getById: (
    id: string,
    ...callbacks: (() => void | Promise<void>)[]
  ) => Promise<void>
  modify: (email: string) => Promise<void>
}
