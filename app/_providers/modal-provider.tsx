'use client'

import { useEffect, useState } from 'react'
import { CreateUserModal } from '../(page)/(secure)/users/components/modals/create-user-modal'
import { AccountDetailsModal } from '../(page)/(secure)/accounts/components/modals/account-details-modal'
import { ConfirmDisableAccountModal } from '../(page)/(secure)/accounts/components/modals/confirm-disable-account-modal'
import { LogoutDialog } from '../_components/dialog/logout-dialog'
import { RegisterParticipantModal } from "@/app/(page)/(secure)/participant/components/modal/register-participant-modal"
import { EditParticipantModal } from '../(page)/(secure)/participant/components/modal/edit-participant-modal'
import { SettingsModal } from '../_components/settings/settings-modal'
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <CreateUserModal/>
      <AccountDetailsModal /> {/* Added this for account handling */}
      <ConfirmDisableAccountModal /> {/* Added this for account handling */}
      <LogoutDialog/>
      <RegisterParticipantModal/>
      <EditParticipantModal/>
      <SettingsModal />
    </>
  )
}
