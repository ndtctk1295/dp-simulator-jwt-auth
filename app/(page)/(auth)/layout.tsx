import { ThemeToggle } from '@/app/_components/theme-toggle'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('AuthLayout')
  return (
    <div className='flex min-h-screen w-full bg-muted/40'>
      {/* <ThemeToggle /> */}
      {children}
    </div>
  )
}
