"use client";

import type { UserWithRole } from "@/lib/auth/types";
import {
    DollarSign,
    LayoutDashboard,
    type LucideIcon,
    Play,
    Settings,
    Trophy,
    User,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  user: UserWithRole | null;
}

export function Sidebar({ items, user }: SidebarProps) {
  const pathname = usePathname();

  // Filter items based on user role
  // Hide admin section if user is not admin
  const visibleItems = items.filter((item) => {
    if (item.href === "/dashboard/admin" && user?.role !== "admin") {
      return false;
    }
    return true;
  });

  return (
    <aside className="w-64 border-r bg-gray-50">
      <nav className="space-y-2 p-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Export default navigation items for convenience
export const defaultNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Torneos", href: "/dashboard/torneos", icon: Trophy },
  { label: "Equipos", href: "/dashboard/equipos", icon: Users },
  { label: "Jugadores", href: "/dashboard/jugadores", icon: User },
  { label: "Partidos", href: "/dashboard/partidos", icon: Play },
  { label: "Financiero", href: "/dashboard/financiero", icon: DollarSign },
  { label: "Admin", href: "/dashboard/admin", icon: Settings },
];
