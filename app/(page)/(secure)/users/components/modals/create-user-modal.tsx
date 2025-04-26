'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserService } from '@/app/_services'
import { useModal } from '@/app/store/use-modal-store'
import defaultPassword from './constant/data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
// import { roles } from '../data/data'
import { roles } from '../../data/data'


// Rename the component to better reflect its purpose
export const CreateUserModal = () => {
  const userService = useUserService()
  
  // Simplified schema focused only on creating new users
  const formSchema = z.object({
    email: z
      .string()
      .email({
        message: 'Invalid email format.',
      })
      .min(6, {
        message: 'Email must be at least 6 characters.',
      })
      .max(50, {
        message: 'Email must be maximum 50 characters.',
      }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
        }
      ),    
    firstName: z
      .string()
      .min(2, {
        message: 'First name must be at least 2 characters.',
      })
      .max(50, {
        message: 'First name must be maximum 50 characters.',
      })      
      .regex(/^[A-Za-z\s\u00C0-\u024F\u1EA0-\u1EF9]+$/, {
        message: 'First name cannot contain numbers or special characters.',
      }),
    lastName: z
      .string()
      .min(2, {
        message: 'Last name must be at least 2 characters.',
      })
      .max(50, {
        message: 'Last name must be maximum 50 characters.',
      })
      .regex(/^[A-Za-z\s\u00C0-\u024F\u1EA0-\u1EF9]+$/, {
        message: 'Last name cannot contain numbers or special characters.',
      }),
    status: z.literal('pending').default('pending'),
    role: z.array(z.string()).default(['guest'])
  })

  type RegisterFormValues = z.infer<typeof formSchema>

  const { isModalOpen, onModalClose, type } = useModal()
  
  const isOpen = isModalOpen && type === 'create-user'

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: defaultPassword,
      firstName: '',
      lastName: '',
      status: 'pending',
      role: ['guest']
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    await userService.create(
      data,
      () => {}, 
      handleClose
    )
  }
  const handleClose = () => {
    form.reset({
      email: '',
      password: defaultPassword,
      firstName: '',
      lastName: '',
      status: 'pending',
      role: ['guest']
    }); // Reset form to default values
    onModalClose();
  };

  const isLoading = form.formState.isSubmitting

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='p-0 overflow-hidden max-w-[50%]'>
        <DialogHeader className='hidden'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Create User
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off" // Turn off browser autofill for the form
          >
            <Card>
              <CardHeader>
                <CardTitle className='text-xl'>
                  Create New User
                </CardTitle>
                <CardDescription>
                  Enter information to create a new user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem hidden={true}>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="Enter password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter first name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter last name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>                  
                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem hidden={true}>
                        <FormLabel>Roles</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            {roles.map((role) => (
                              <div key={role.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={role.value}
                                  checked={field.value?.includes(role.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || ['guest'];
                                    if (checked) {
                                      field.onChange([...currentValue, role.value]);
                                    } else {
                                      // Don't allow unchecking if it's the last role
                                      if (currentValue.length > 1) {
                                        field.onChange(currentValue.filter((v) => v !== role.value));
                                      }
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={role.value}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {role.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className='flex justify-end space-x-2'>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {/* {isLoading && <Spinner className='mr-2 h-4 w-4 animate-spin' />} */}
                  Create User
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
