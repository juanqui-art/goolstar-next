"use client"

import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  user?: User
}

export function Navbar({ user }: NavbarProps) {
  // TODO: Add logout action when auth is implemented

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="font-bold text-lg">GoolStar</div>

        {/* Right: User info + logout */}
        <div className="flex items-center gap-4">
          {user && <span className="text-sm">{user.email}</span>}
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
