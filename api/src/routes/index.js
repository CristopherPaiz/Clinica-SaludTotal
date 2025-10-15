import { Router } from "express";
import authRoutes from "./auth.routes.js";
import pacienteRoutes from "./pacientes.routes.js";
import medicoRoutes from "./medicos.routes.js";
import citaRoutes from "./citas.routes.js";
import adminRoutes from "./admin.routes.js";
import configuracionRoutes from "./configuracion.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/pacientes", pacienteRoutes);
router.use("/medicos", medicoRoutes);
router.use("/citas", citaRoutes);
router.use("/admin", adminRoutes);
router.use("/configuracion", configuracionRoutes);

export default router;
