"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    active?: boolean
    onClick?: () => void
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <nav className={cn("flex space-y-1 lg:flex-col", className)} {...props}>
      {items.map((item) => (
        <button
          key={item.href}
          onClick={item.onClick}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            item.active ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </button>
      ))}
    </nav>
  )
}
