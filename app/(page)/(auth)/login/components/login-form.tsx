'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Icons } from '@/app/_components/icons'
import { useUserService } from '@/app/_services'
import { useRouter, useSearchParams } from 'next/navigation'

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
})

type LoginFormValues = z.infer<typeof formSchema>

const LoginForm = () => {
  const userService = useUserService()

  // 1. Define your form.
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: LoginFormValues) => {
    await userService.login(data?.email, data?.password)
  }

  const isLoading = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mx-auto my-auto'>
        <Card className='max-w-sm'>
          <CardHeader>
            <CardTitle className='text-2xl'>Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
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
                      <Input
                        disabled={isLoading}
                        placeholder='m@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center'>
                      <FormLabel>Password</FormLabel>
                      <Link
                        href='#'
                        className='ml-auto inline-block text-sm underline font-normal'
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type='password' disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin'></Icons.spinner>
                )}
                Login
              </Button>
              <Button variant='outline' className='w-full'>
                Login with Google
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{' '}
              <Link href='/register' className='underline'>
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

export default LoginForm
