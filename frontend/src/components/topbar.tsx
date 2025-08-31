"use client"

import * as React from "react"
import { Cog, LogOut, Search, Shield, HelpCircle, User2, UserRound, SettingsIcon, Edit3 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { CommandMenu } from "@/components/search/command-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationPopover } from "@/components/notifications/notification-popover"

function AccountMenuContent() {
  return (
    <div className="min-w-[260px]">
      <div className="flex items-center gap-3 p-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>AA</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">Alpha Admin</div>
          <div className="truncate text-xs text-muted-foreground">Partner Admin</div>
        </div>
      </div>
      <DropdownMenuSeparator />
      <div className="p-1">
        <DropdownMenuItem asChild>
          <a href="#" className="flex items-center">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#" className="flex items-center">
            <UserRound className="mr-2 h-4 w-4" />
            View Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#" className="flex items-center">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Account Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="#" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Docs
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Privacy Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600" asChild>
          <a href="#" className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </a>
        </DropdownMenuItem>
      </div>
    </div>
  )
}

export function Topbar() {
  const isMobile = useIsMobile()
  // Mobile account sheet
  const [accountOpen, setAccountOpen] = React.useState(false)
  // Global search (command palette)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [initialQuery, setInitialQuery] = React.useState("")

  // Global Cmd/Ctrl+K listener
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setInitialQuery("") // reset on toggle; you can seed this if desired
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-background">
        <div className="flex h-14 items-center gap-2 px-3 md:px-4">
          <SidebarTrigger className="-ml-1" />
          {/* Search trigger that opens Command Menu */}
          <div className="relative flex-1 max-w-3xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              readOnly
              role="button"
              aria-label="Open global search"
              onClick={() => {
                setInitialQuery("")
                setSearchOpen(true)
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                  e.preventDefault()
                  setInitialQuery("")
                  setSearchOpen((v) => !v)
                }
              }}
              className="cursor-text pl-9"
              placeholder={"Search or jump to... (Ctrl+K / Cmd+K)"}
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden select-none rounded border bg-muted px-1.5 text-[10px] text-muted-foreground md:inline-block">
              ⌘K
            </kbd>
          </div>
          {/* Actions on the right */}
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Cog className="h-5 w-5" />
            </Button>

            {/* Notifications popover */}
            <NotificationPopover
              items={
                [
                  // Example data; replace with real data when wiring up
                  // { id: "1", title: "New ticket assigned", description: "Ticket #4827 • Router outage", icon: "ticket", time: "2m", read: false, href: "/dashboard/tickets" },
                  // { id: "2", title: "Payment received", description: "Invoice INV-2041 • $129.00", icon: "success", time: "1h", read: true, href: "/dashboard/payments" },
                ]
              }
            />

            {/* Theme toggle (light/dark) */}
            <ThemeToggle />

            {/* Account menu: Dropdown on desktop, bottom sheet on mobile */}
            {isMobile ? (
              <Sheet open={accountOpen} onOpenChange={setAccountOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Account">
                    <User2 className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="w-full max-w-full p-0">
                  <SheetHeader className="px-4 pt-4">
                    <SheetTitle>Account</SheetTitle>
                  </SheetHeader>
                  <div className="pb-4">
                    <AccountMenuContent />
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Account">
                    <User2 className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-0">
                  <DropdownMenuLabel className="sr-only">Account</DropdownMenuLabel>
                  <AccountMenuContent />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} initialQuery={initialQuery} />
    </>
  )
}
