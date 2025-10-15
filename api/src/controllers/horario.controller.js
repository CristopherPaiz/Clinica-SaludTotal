import { crearHorario, obtenerHorariosPorMedico, actualizarHorario, eliminarHorario } from "../services/horario.service.js";
import catchAsync from "../utils/catchAsync.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const getHorariosPorMedico = catchAsync(async (req, res, next) => {
  const { medicoId } = req.params;
  const horarios = await obtenerHorariosPorMedico(medicoId);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      horarios,
    },
  });
});

export const addHorario = catchAsync(async (req, res, next) => {
  const { medicoId } = req.params;
  const nuevoHorario = await crearHorario(medicoId, req.body);
  res.status(HTTP_STATUS.CREATED).json({
    status: "success",
    data: {
      horario: nuevoHorario,
    },
  });
});

export const updateHorario = catchAsync(async (req, res, next) => {
  const { horarioId } = req.params;
  const horarioActualizado = await actualizarHorario(horarioId, req.body);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      horario: horarioActualizado,
    },
  });
});

export const deleteHorario = catchAsync(async (req, res, next) => {
  const { horarioId } = req.params;
  await eliminarHorario(horarioId);
  res.status(HTTP_STATUS.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});
