import { buscarTodosLosMedicos, buscarMiPerfil } from "../services/medico.service.js";
import catchAsync from "../utils/catchAsync.js";
import { createAppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const obtenerMedicos = catchAsync(async (req, res, next) => {
  const medicos = await buscarTodosLosMedicos(req.query);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      medicos,
    },
  });
});

export const obtenerMiPerfil = catchAsync(async (req, res, next) => {
  const medico = await buscarMiPerfil(req.usuario);
  if (!medico) {
    return next(createAppError("No se encontró el perfil de médico asociado a este usuario.", HTTP_STATUS.NOT_FOUND));
  }
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      medico,
    },
  });
});
