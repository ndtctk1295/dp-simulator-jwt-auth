'use client'

import { useEffect, useState } from 'react'
import { LogoutDialog } from '@/app/_components/dialog/logout-dialog'

export const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* <LogoutDialog /> */}
    </>
  )
}
