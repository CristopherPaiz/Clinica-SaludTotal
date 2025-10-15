import { Router } from "express";
import { iniciarSesion, registrarPaciente, getMe, cerrarSesion } from "../controllers/auth.controller.js";
import { isAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", iniciarSesion);
router.post("/register", registrarPaciente);
router.get("/logout", cerrarSesion);
router.get("/me", isAuth(), getMe);

export default router;
