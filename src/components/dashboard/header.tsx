"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Home, Megaphone, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "../logo";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/announcements", icon: Megaphone, label: "Anuncios", roles: ["lider", "dirigente", "miembro"] },
  { href: "/dashboard/users", icon: Users, label: "Usuarios", roles: ["lider"] },
];

export function Header() {
  const { bandUser, logout } = useAuth();
  const pathname = usePathname();

  if (!bandUser) {
    return (
      <header className="flex h-16 items-center justify-end border-b px-4">
        {/* Placeholder for loading state */}
      </header>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
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
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden lg:block"></div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{bandUser.nombreCompleto}</p>
          <p className="text-xs text-muted-foreground capitalize">{bandUser.rol}</p>
        </div>
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${bandUser.id}`} />
          <AvatarFallback>{getInitials(bandUser.nombreCompleto)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
