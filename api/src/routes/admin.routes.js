import { Router } from "express";
import {
  listarUsuarios,
  crearNuevoMedico,
  crearNuevoPaciente,
  obtenerMedicoPorId,
  actualizarMedico,
  eliminarMedico,
  obtenerPacientePorId,
  actualizarPaciente,
  eliminarPaciente,
} from "../controllers/admin.controller.js";
import { isAuth } from "../middleware/auth.js";
import { PERMISOS, TIPOS_PERMISO } from "../utils/permissions.js";

const router = Router();

router.use(isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.LECTURA));

router.get("/usuarios", listarUsuarios);

router.post("/medicos", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), crearNuevoMedico);
router.get("/medicos/:id", obtenerMedicoPorId);
router.put("/medicos/:id", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), actualizarMedico);
router.delete("/medicos/:id", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), eliminarMedico);

router.post("/pacientes", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), crearNuevoPaciente);
router.get("/pacientes/:id", obtenerPacientePorId);
router.put("/pacientes/:id", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), actualizarPaciente);
router.delete("/pacientes/:id", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), eliminarPaciente);

export default router;
