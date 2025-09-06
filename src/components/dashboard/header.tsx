
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Home, Megaphone, Users, Music, MessageSquare, CalendarClock, Map, Lightbulb } from "lucide-react";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const avatarStyle = bandUser.avatarStyle || 'micah';

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
             <SheetHeader className="p-4 border-b">
               <SheetTitle>
                 <Link href="/">
                    <span className="text-xl font-semibold text-foreground whitespace-nowrap">La Banda del IDI</span>
                 </Link>
              </SheetTitle>
            </SheetHeader>
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
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex-1 flex justify-end items-center gap-4">
         <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="font-semibold">{bandUser.nombreCompleto}</p>
                <p className="text-xs text-muted-foreground capitalize">{bandUser.rol}</p>
              </div>
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${bandUser.id}`} />
                <AvatarFallback>{getInitials(bandUser.nombreCompleto)}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
               <LogOut className="mr-2 h-4 w-4" />
               <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
