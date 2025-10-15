import { Router } from "express";
import { obtenerMedicos, obtenerMiPerfil } from "../controllers/medico.controller.js";
import { isAuth } from "../middleware/auth.js";
import { PERMISOS, TIPOS_PERMISO } from "../utils/permissions.js";

const router = Router();

router.get("/", obtenerMedicos);
router.get("/me", isAuth(PERMISOS.PERFIL, TIPOS_PERMISO.LECTURA), obtenerMiPerfil);

export default router;
