import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/dictionaries";
import {
  Stethoscope,
  LayoutGrid,
  Users,
  Image as ImageIcon,
  Phone,
  CalendarDays,
  UserCircle,
  BookUser,
  Shield,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
} from "lucide-react";

const NavLinkWithIcon = ({ to, icon: Icon, children }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 transition-colors ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <NavLink to={to} className={navLinkClass}>
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  );
};

const SheetNavLink = ({ to, icon: Icon, children }) => (
  <SheetClose asChild>
    <NavLink to={to} className="flex items-center gap-3 p-3 rounded-md hover:bg-accent text-base">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium">{children}</span>
    </NavLink>
  </SheetClose>
);

export function Header() {
  const { estaAutenticado, usuario, cerrarSesion } = useAuth();

  const NavigationLinks = () => (
    <>
      <NavLinkWithIcon to="/servicios" icon={LayoutGrid}>
        Servicios
      </NavLinkWithIcon>
      <NavLinkWithIcon to="/nosotros" icon={Users}>
        Nosotros
      </NavLinkWithIcon>
      <NavLinkWithIcon to="/galeria" icon={ImageIcon}>
        Galería
      </NavLinkWithIcon>
      <NavLinkWithIcon to="/contactos" icon={Phone}>
        Contactos
      </NavLinkWithIcon>
      {estaAutenticado && (
        <>
          {usuario?.rol === ROLES.PACIENTE && (
            <>
              <NavLinkWithIcon to="/paciente/citas" icon={CalendarDays}>
                Mis Citas
              </NavLinkWithIcon>
              <NavLinkWithIcon to="/paciente/perfil" icon={UserCircle}>
                Mi Perfil
              </NavLinkWithIcon>
            </>
          )}
          {usuario?.rol === ROLES.MEDICO && (
            <NavLinkWithIcon to="/medico/agenda" icon={BookUser}>
              Mi Agenda
            </NavLinkWithIcon>
          )}
          {usuario?.rol === ROLES.ADMIN && (
            <NavLinkWithIcon to="/admin/panel" icon={Shield}>
              Panel Admin
            </NavLinkWithIcon>
          )}
        </>
      )}
    </>
  );

  const AuthButtons = () => (
    <>
      {estaAutenticado ? (
        <Button onClick={cerrarSesion} variant="destructive" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      ) : (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/registro">
              <UserPlus className="mr-2 h-4 w-4" />
              Registrarse
            </Link>
          </Button>
        </>
      )}
    </>
  );

  const MobileNavigationLinks = () => (
    <div className="flex flex-col gap-2 pt-4">
      <SheetNavLink to="/servicios" icon={LayoutGrid}>
        Servicios
      </SheetNavLink>
      <SheetNavLink to="/nosotros" icon={Users}>
        Nosotros
      </SheetNavLink>
      <SheetNavLink to="/galeria" icon={ImageIcon}>
        Galería
      </SheetNavLink>
      <SheetNavLink to="/contactos" icon={Phone}>
        Contactos
      </SheetNavLink>
      {estaAutenticado && (
        <>
          {usuario?.rol === ROLES.PACIENTE && (
            <>
              <SheetNavLink to="/paciente/citas" icon={CalendarDays}>
                Mis Citas
              </SheetNavLink>
              <SheetNavLink to="/paciente/perfil" icon={UserCircle}>
                Mi Perfil
              </SheetNavLink>
            </>
          )}
          {usuario?.rol === ROLES.MEDICO && (
            <SheetNavLink to="/medico/agenda" icon={BookUser}>
              Mi Agenda
            </SheetNavLink>
          )}
          {usuario?.rol === ROLES.ADMIN && (
            <SheetNavLink to="/admin/panel" icon={Shield}>
              Panel Admin
            </SheetNavLink>
          )}
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <Stethoscope className="h-7 w-7 text-primary" />
          <span className="inline-block font-bold text-xl">SaludTotal</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm">
            <NavigationLinks />
          </nav>
          <div className="flex items-center gap-2">
            <AuthButtons />
          </div>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px] p-4">
              <nav className="flex flex-col h-full">
                <div className="flex-grow">
                  <MobileNavigationLinks />
                </div>
                <div className="mt-auto border-t pt-4">
                  <div className="flex flex-col gap-2">
                    {estaAutenticado ? (
                      <SheetClose asChild>
                        <Button onClick={cerrarSesion} variant="destructive" className="w-full">
                          <LogOut className="mr-2 h-5 w-5" />
                          Cerrar Sesión
                        </Button>
                      </SheetClose>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Button asChild variant="ghost" className="w-full justify-start p-3">
                            <Link to="/login" className="flex items-center gap-3">
                              <LogIn className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">Iniciar Sesión</span>
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button asChild className="w-full">
                            <Link to="/registro">
                              <UserPlus className="mr-2 h-5 w-5" />
                              Registrarse
                            </Link>
                          </Button>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
