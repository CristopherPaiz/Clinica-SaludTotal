import { Router } from "express";
import { obtenerCitasOcupadasPorDia, obtenerMedicos, obtenerMiPerfil } from "../controllers/medico.controller.js";
import horarioRoutes from "./horario.routes.js";
import { isAuth } from "../middleware/auth.js";
import { PERMISOS, TIPOS_PERMISO } from "../utils/permissions.js";

const router = Router();

router.get("/", obtenerMedicos);
router.get("/me", isAuth(PERMISOS.PERFIL, TIPOS_PERMISO.LECTURA), obtenerMiPerfil);

router.use("/:medicoId/horarios", horarioRoutes);
router.get("/:medicoId/citas-ocupadas", obtenerCitasOcupadasPorDia);

export default router;
