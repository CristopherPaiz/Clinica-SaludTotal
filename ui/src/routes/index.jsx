import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/paginas/shared/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROLES } from "@/lib/dictionaries";

import { PaginaInicio } from "@/paginas/publicas/PaginaInicio";
import { PaginaLogin } from "@/paginas/publicas/PaginaLogin";
import { PaginaRegistro } from "@/paginas/publicas/PaginaRegistro";
import { PaginaMedicos } from "@/paginas/publicas/PaginaMedicos";

import { PaginaMisCitas } from "@/paginas/privadas/paciente/PaginaMisCitas";
import { PaginaNuevaCita } from "@/paginas/privadas/paciente/PaginaNuevaCita";
import { PaginaMiPerfil } from "@/paginas/privadas/paciente/PaginaMiPerfil";

import { PaginaAgendaMedico } from "@/paginas/privadas/medico/PaginaAgendaMedico";

import { PaginaPanelAdmin } from "@/paginas/privadas/admin/PaginaPanelAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <PaginaInicio /> },
      { path: "login", element: <PaginaLogin /> },
      { path: "registro", element: <PaginaRegistro /> },
      { path: "medicos", element: <PaginaMedicos /> },
      {
        element: <ProtectedRoute rolesPermitidos={[ROLES.PACIENTE]} />,
        children: [
          { path: "paciente/citas", element: <PaginaMisCitas /> },
          { path: "paciente/citas/nueva", element: <PaginaNuevaCita /> },
          { path: "paciente/perfil", element: <PaginaMiPerfil /> },
        ],
      },
      {
        element: <ProtectedRoute rolesPermitidos={[ROLES.MEDICO]} />,
        children: [{ path: "medico/agenda", element: <PaginaAgendaMedico /> }],
      },
      {
        element: <ProtectedRoute rolesPermitidos={[ROLES.ADMIN]} />,
        children: [{ path: "admin/panel", element: <PaginaPanelAdmin /> }],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
