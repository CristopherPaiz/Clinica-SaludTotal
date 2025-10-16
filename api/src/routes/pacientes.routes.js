import { Router } from "express";
import { obtenerPacientes, obtenerMiPerfil, actualizarMiPerfil, obtenerHistorialCitas } from "../controllers/paciente.controller.js";
import { isAuth } from "../middleware/auth.js";
import { PERMISOS, TIPOS_PERMISO } from "../utils/permissions.js";

const router = Router();

router.get("/", isAuth(PERMISOS.PACIENTES, TIPOS_PERMISO.LECTURA), obtenerPacientes);

router.get("/me", isAuth(PERMISOS.PERFIL, TIPOS_PERMISO.LECTURA), obtenerMiPerfil);
router.put("/me", isAuth(PERMISOS.PERFIL, TIPOS_PERMISO.ESCRITURA), actualizarMiPerfil);

router.get("/:pacienteId/citas", isAuth(PERMISOS.PACIENTES, TIPOS_PERMISO.LECTURA), obtenerHistorialCitas);

export default router;
