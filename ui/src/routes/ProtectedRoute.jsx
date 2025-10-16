import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FullScreenLoader } from "@/components/common/Loader";
import { ROLES } from "@/lib/dictionaries";

export function ProtectedRoute({ rolesPermitidos }) {
  const { estaAutenticado, usuario, cargando } = useAuth();

  if (cargando) {
    return <FullScreenLoader />;
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  const tienePermiso = usuario?.rol === ROLES.ADMIN || !rolesPermitidos || rolesPermitidos.includes(usuario?.rol);

  if (!tienePermiso) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
