import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FullScreenLoader } from "@/components/common/Loader";

export function ProtectedRoute({ rolesPermitidos }) {
  const { estaAutenticado, usuario, cargando } = useAuth();

  if (cargando) {
    return <FullScreenLoader />;
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario?.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
