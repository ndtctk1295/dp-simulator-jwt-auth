import { create } from 'zustand'

import { useRouter, useSearchParams } from 'next/navigation'

import { toast } from 'react-hot-toast'
import { useFetch } from '@/app/_helpers/client'
import { useUserStore } from '../store/use-user-store'
import { set } from 'mongoose'
import { z } from 'zod';

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// user state store
// const initialState = {
//   users: [],
//   user: undefined, //user to edit
//   currentUser: undefined,
// }
// const userStore = create<IUserStore>(() => initialState)

export function useUserService(): IUserService {
  const fetch = useFetch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { users, user, currentUser, setCurrentUser, setUser, setUsers, setState } = useUserStore()

  const startRefreshTokenTimer = () => {
    setTimeout(() => {
      console.log('Goi ham refreshToken de gia han')
    }, 60000 * 60)
  }

  return {
    register: async (user) => {
      try {
        await fetch.post('/api/account/register', user)
        toast.success('Registration successful')
        router.push('/login')
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    login: async (email, password) => {
      try {
        const currentUser = await fetch.post('/api/account/login', {
          email,
          password,
        })
        toast.success('Login successful')
        setState({ currentUser })
        startRefreshTokenTimer()

        // get return url from query parameters or default to '/'
        const returnUrl = searchParams.get('returnUrl') || '/dashboard'
        router.push(returnUrl)
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    logout: async () => {
      try {
        await fetch.post('/api/account/logout')
        router.push('/login')
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    getCurrent: async () => {
      // console.log('getCurrent:', currentUser)
      if (!currentUser) {
        setCurrentUser(await fetch.get('/api/users/current'))
      }
    },

    create: async (user, ...callbacks) => {
      try {
        const dataResponse = await fetch.post('/api/users', user)
        const { id } = dataResponse.user
        user.id = id
        toast.success('Create User successful')
        setUsers([...users, user])
        for (const callback of callbacks) {
          if (typeof callback === 'function') await callback()
        }
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    getAll: async (...callbacks) => {
      // userStore.setState({
      //   users: await fetch.get('/api/users'),
      // })
      setState({ users: await fetch.get('/api/users') })
      for (const callback of callbacks) {
        if (typeof callback === 'function') await callback()
      }
    },

    delete: async (id) => {
      try {
        // // set isDeleting prop to true on user
        // userStore.setState({
        //   users: users!.map((x) => {
        //     if (x.id === id) {
        //       x.isDeleting = true
        //     }
        //     return x
        //   }),
        // })

        // delete user
        const response = await fetch.delete(`/api/users/${id}`)

        // remove deleted user from state
        setUsers(users.filter((x) => x.id !== id))
        // logout if the user deleted their own record
        if (response.deletedSelf) {
          router.push('/login')
        }

        toast.success('Delete user successful')
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    getById: async (id, ...callbacks) => {
      try {
        // userStore.setState({ user: await fetch.get(`/api/users/${id}`) })
        setUser(await fetch.get(`/api/users/${id}`))

        for (const callback of callbacks) {
          if (typeof callback === 'function') await callback()
        }
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    clearUser: async () => {
      // userStore.setState({ user: undefined })
      setUser(undefined)
    },

    update: async (id, params, ...callbacks) => {
      try {
        console.log('update user ben service:', id, params)
        await fetch.put(`/api/users/${id}`, {...params})
        toast.success('Update User successful')

        // update current user if the user updated their own record
        if (id === currentUser?.id) {
          // userStore.setState({ currentUser: { ...currentUser, ...params } })
          setCurrentUser({ ...currentUser, ...params })
        }

        // update the list users
        const newUsers = users.map((x) =>
          x.id === id ? { ...x, ...params } : x
        )
        // userStore.setState({ users: newUsers })
        setUsers(newUsers)

        for (const callback of callbacks) {
          if (typeof callback === 'function') await callback()
        }
      } catch (error: any) {
        toast.error(error ? error : 'Something went wrong!')
      }
    },

    modify: async (email: string) => {
      // userStore.setState({
      //   currentUser: {
      //     firstName: 'xxx',
      //     lastName: 'yyy',
      //     email: email,
      //   },
      // })
      setCurrentUser({
        firstName: 'xxx',
        lastName: 'yyy',
        email: email,
        status: 'pending',
        role: ['']
      })
    },

    changePassword: async (id: string, data: PasswordFormValues, setError: (field: string, error: { type: string; message: string }) => void) => {
      try {
        const response = await fetch.post(`/api/users/${id}/change-password`, data);
        // console.log('response:', response)
        toast.success(response.message || 'Password updated successfully');
      } catch (error: any) {
        // console.log('Error:', error);
        setError('currentPassword', { type: 'server', message: error || error?.message || 'An unexpected error occurred' });
        throw new Error(error);
      }
    },
  }
}




interface IUserService {
  register: (user: IUser) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getCurrent: () => Promise<void>
  create: (
    user: IUser,
    ...callbacks: (() => void | Promise<void>)[]
  ) => Promise<void>
  getAll: (...callbacks: (() => void | Promise<void>)[]) => Promise<void>
  delete: (id: string) => Promise<void>
  getById: (
    id: string,
    ...callbacks: (() => void | Promise<void>)[]
  ) => Promise<void>
  clearUser: () => Promise<void>
  update: (
    id: string,
    params: Partial<IUser>,
    ...callbacks: (() => void | Promise<void>)[]
  ) => Promise<void>

  modify: (email: string) => Promise<void>
  changePassword: (id: string, data: PasswordFormValues, setError: (field: string, error: { type: string; message: string }) => void) => Promise<void>;
}
