'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const BreadcrumbBar = () => {
  const pathname = usePathname();

  // Convert pathname into an array of paths
  const pathSegments = pathname.split('/').filter(Boolean); // Remove empty segments

  if (pathname === '/dashboard') {
    return null; // Don't render breadcrumb for the dashboard page
  }
  // Generate readable breadcrumb titles
  const breadcrumbTitles: { [key: string]: string } = {
    accounts: "Accounts",
    consent: "Consent",
    dashboard: "Dashboard",
    "transaction-history": "Transaction History",
  };

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {/* Home Link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Generate Breadcrumbs Dynamically */}
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className='ml-2'>
                    {breadcrumbTitles[segment] || segment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className='ml-2' asChild>
                    <Link href={href}>
                      {breadcrumbTitles[segment] || segment}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadcrumbBar


{/* <Breadcrumb className='hidden md:flex'>
<BreadcrumbList>
  <BreadcrumbItem>
    <BreadcrumbLink asChild>
      <Link href='#'>Dashboard</Link>
    </BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>
    <BreadcrumbLink asChild>
      <Link href='#'>Orders</Link>
    </BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>
    <BreadcrumbPage>Recent Orders</BreadcrumbPage>
  </BreadcrumbItem>
</BreadcrumbList>
</Breadcrumb> */}