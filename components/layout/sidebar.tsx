"use client";

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
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-gray-50">
      <nav className="space-y-2 p-4">
        {items.map((item) => {
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
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Torneos", href: "/torneos", icon: Trophy },
  { label: "Equipos", href: "/equipos", icon: Users },
  { label: "Jugadores", href: "/jugadores", icon: User },
  { label: "Partidos", href: "/partidos", icon: Play },
  { label: "Financiero", href: "/financiero", icon: DollarSign },
  { label: "Admin", href: "/admin", icon: Settings },
];
