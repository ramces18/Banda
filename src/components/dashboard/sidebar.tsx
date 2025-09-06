
"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Home, LogOut, Megaphone, Users, Music, MessageSquare, CalendarClock, Map, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/home", icon: Home, label: "Inicio", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/announcements", icon: Megaphone, label: "Anuncios", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/schedules", icon: CalendarClock, label: "Horarios", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/scores", icon: Music, label: "Partituras", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/route", icon: Map, label: "Recorrido", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/forum", icon: MessageSquare, label: "Foro", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/suggestions", icon: Lightbulb, label: "Sugerencias", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/users", icon: Users, label: "Usuarios", roles: ["lider"] },
];

export function Sidebar() {
  const { bandUser, logout } = useAuth();
  const pathname = usePathname();

  if (!bandUser) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card">
      <div className="p-4 border-b h-16 flex items-center">
         <Link href="/">
            <span className="text-xl font-semibold text-foreground whitespace-nowrap">La Banda del IDI</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) =>
          item.roles.includes(bandUser.rol) ? (
            <Button
              key={item.href}
              asChild
              variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
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
