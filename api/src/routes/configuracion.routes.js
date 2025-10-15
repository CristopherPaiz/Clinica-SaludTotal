import { Router } from "express";
import { getConfiguracion, updateConfiguracion } from "../controllers/configuracion.controller.js";
import { isAuth } from "../middleware/auth.js";
import { PERMISOS, TIPOS_PERMISO } from "../utils/permissions.js";

const router = Router();

router.get("/", getConfiguracion);
router.put("/", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), updateConfiguracion);

export default router;
