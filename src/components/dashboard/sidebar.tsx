"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Home, LogOut, Megaphone, Users, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/announcements", icon: Megaphone, label: "Anuncios", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/users", icon: Users, label: "Usuarios", roles: ["lider"] },
];

export function Sidebar() {
  const { bandUser, logout } = useAuth();
  const pathname = usePathname();

  if (!bandUser) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card">
      <div className="p-4 border-b">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) =>
          item.roles.includes(bandUser.rol) ? (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ) : null
        )}
      </nav>
      <div className="p-4 border-t">
        <Button onClick={logout} variant="ghost" className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
