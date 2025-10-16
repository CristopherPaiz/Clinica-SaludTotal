import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/dictionaries";

export function Header() {
  const { estaAutenticado, usuario, cerrarSesion } = useAuth();

  const obtenerRutasPanel = () => {
    switch (usuario?.rol) {
      case ROLES.PACIENTE:
        return (
          <>
            <NavLink to="/paciente/citas">Mis Citas</NavLink>
            <NavLink to="/paciente/perfil">Mi Perfil</NavLink>
          </>
        );
      case ROLES.MEDICO:
        return <NavLink to="/medico/agenda">Mi Agenda</NavLink>;
      case ROLES.ADMIN:
        return <NavLink to="/admin/panel">Panel Admin</NavLink>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Clínica SaludTotal</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavLink to="/medicos">Médicos</NavLink>
            {estaAutenticado && obtenerRutasPanel()}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {estaAutenticado ? (
              <Button onClick={cerrarSesion} variant="outline">
                Cerrar Sesión
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link to="/registro">Registrarse</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
