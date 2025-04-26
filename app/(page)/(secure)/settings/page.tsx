import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./components/form/profile-form"
import { SidebarNav } from "./components/sidebar-nav"

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
    active: true,
  },
  {
    title: "Account",
    href: "/settings/account",
    active: false,
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    active: false,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    active: false,
  },
  {
    title: "Display",
    href: "/settings/display",
    active: false,
  },
]

export default function SettingsPage() {
  return (
    <div className="container relative mx-auto bg-background">
      <div className="space-y-6 p-6 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  )
}
