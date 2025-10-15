import { Router } from "express";
import { obtenerCitas, crearCita, actualizarCita, cancelarCita } from "../controllers/cita.controller.js";
import { isAuth } from "../middleware/auth.js";
import { PERMISOS, TIPOS_PERMISO } from "../utils/permissions.js";

const router = Router();

router.use(isAuth());

router.get("/", isAuth(PERMISOS.CITAS, TIPOS_PERMISO.LECTURA), obtenerCitas);
router.post("/", isAuth(PERMISOS.CITAS, TIPOS_PERMISO.ESCRITURA), crearCita);
router.put("/:id", isAuth(PERMISOS.CITAS, TIPOS_PERMISO.ESCRITURA), actualizarCita);
router.delete("/:id", isAuth(PERMISOS.CITAS, TIPOS_PERMISO.ESCRITURA), cancelarCita);

export default router;
