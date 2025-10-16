import { Router } from "express";
import * as controller from "../controllers/especialidad.controller.js";
import { isAuth } from "../middleware/auth.js";
import { PERMISOS, TIPOS_PERMISO } from "../utils/permissions.js";

const router = Router();

router.get("/", controller.obtenerEspecialidades);

router.post("/", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), controller.crearEspecialidad);
router.put("/:id", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), controller.actualizarEspecialidad);
router.delete("/:id", isAuth(PERMISOS.ADMIN_PANEL, TIPOS_PERMISO.ESCRITURA), controller.eliminarEspecialidad);

export default router;
