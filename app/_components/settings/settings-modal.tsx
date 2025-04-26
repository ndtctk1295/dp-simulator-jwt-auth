"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./sidebar-nav"
import { Cog } from "lucide-react"
import { useModal } from "@/app/store/use-modal-store"
import { useUserStore } from "@/app/store/use-user-store"
import { AccountForm } from "./account-form"
const sidebarNavItems = [
  {
    title: "Profile",
    href: "#profile",
    active: true,
  },
  {
    title: "Account",
    href: "#account",
    active: false,
  },
  // {
  //   title: "Appearance",
  //   href: "#appearance",
  //   active: false,
  // },
  // {
  //   title: "Notifications",
  //   href: "#notifications",
  //   active: false,
  // },
  // {
  //   title: "Display",
  //   href: "#display",
  //   active: false,
  // },
]

export function SettingsModal() {
  const [activeTab, setActiveTab] = useState("profile")
  const { isModalOpen, type, onModalClose, onModalOpen, data } = useModal();
  const userStore = useUserStore();
  const isOpen = isModalOpen && type === "settings-modal"
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleSidebarItemClick = (item: { href: string; title: string }) => {
    const tabValue = item.href.replace("#", "")
    setActiveTab(tabValue)
  }
  // useEffect( () => {
  //   console.log(
  //       'user data:', userStore.currentUser
  //   )
  // },[userStore.currentUser])

  return (
    <Dialog open={isOpen} onOpenChange={onModalClose}>
      <DialogContent className="max-h-[90vh] max-w-[100vw] overflow-y-auto p-0 sm:max-w-[1500px]">
        <div className="md:hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl">Settings</DialogTitle>
            <DialogDescription>Manage your account settings and set e-mail preferences.</DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="px-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              {/* <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger> */}
            </TabsList>
            <TabsContent value="profile" className="mt-6 pb-6">
              <ProfileForm onComplete={() => onModalClose()} />
            </TabsContent>
            <TabsContent value="account" className="mt-6 pb-6">
              <AccountForm onComplete={() => onModalClose()} />
            </TabsContent>
            {/* <TabsContent value="appearance" className="mt-6 pb-6">
              <div className="text-center py-8 text-muted-foreground">Appearance settings will go here</div>
            </TabsContent>
            <TabsContent value="notifications" className="mt-6 pb-6">
              <div className="text-center py-8 text-muted-foreground">Notification settings will go here</div>
            </TabsContent>
            <TabsContent value="display" className="mt-6 pb-6">
              <div className="text-center py-8 text-muted-foreground">Display settings will go here</div>
            </TabsContent> */}
          </Tabs>
        </div>

        <div className="hidden md:block">
          <div className="space-y-6 p-6 pb-16">
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="lg:w-1/5">
                <SidebarNav
                  items={sidebarNavItems.map((item) => ({
                    ...item,
                    active: item.href.replace("#", "") === activeTab,
                    onClick: () => handleSidebarItemClick(item),
                  }))}
                />
              </aside>
              <div className="flex-1">
                {activeTab === "profile" && <ProfileForm onComplete={() => onModalClose()} />}
                {activeTab === "account" && <AccountForm onComplete={() => onModalClose()} />}
                {/* {activeTab === "appearance" && (
                  <div className="text-center py-8 text-muted-foreground">Appearance settings will go here</div>
                )}
                {activeTab === "notifications" && (
                  <div className="text-center py-8 text-muted-foreground">Notification settings will go here</div>
                )}
                {activeTab === "display" && (
                  <div className="text-center py-8 text-muted-foreground">Display settings will go here</div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
