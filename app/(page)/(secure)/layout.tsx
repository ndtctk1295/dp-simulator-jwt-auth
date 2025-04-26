import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/_helpers/server'
import Navbar from '@/app/_components/navbar/nav-bar'
// import SecureClient from '@/app/_components/secure-client'

export default function SecureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!auth.isAuthenticated()) {
    const returnUrl = encodeURIComponent(headers().get('x-current-path') || '/')
    redirect(`/login?returnUrl=${returnUrl}`)
  }

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      {/* <SecureClient /> */}
      <Navbar />
      <div className='flex flex-col sm:gap-4 sm:pl-14 sm:pb-4'>{children}</div>
    </div>
  )
}
