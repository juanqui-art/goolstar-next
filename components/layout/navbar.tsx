"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import type { UserWithRole } from "@/lib/auth/types";

interface NavbarProps {
  user?: UserWithRole;
}

export function Navbar({ user }: NavbarProps) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="font-bold text-lg">GoolStar</div>

        {/* Right: User info + logout */}
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-gray-700">{user.email}</span>}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
