import { Router } from "express";
import { getHorariosPorMedico, addHorario, updateHorario, deleteHorario } from "../controllers/horario.controller.js";

const router = Router({ mergeParams: true });

router.get("/", getHorariosPorMedico);
router.post("/", addHorario);

router.put("/:horarioId", updateHorario);
router.delete("/:horarioId", deleteHorario);

export default router;
