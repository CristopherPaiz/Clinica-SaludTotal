import { buscarTodosLosPacientes, buscarMiPerfil, modificarPaciente, buscarHistorialCitasPorPacienteId } from "../services/paciente.service.js";
import catchAsync from "../utils/catchAsync.js";
import { createAppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const obtenerPacientes = catchAsync(async (req, res, next) => {
  const pacientes = await buscarTodosLosPacientes(req.query);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      pacientes,
    },
  });
});

export const obtenerMiPerfil = catchAsync(async (req, res, next) => {
  const paciente = await buscarMiPerfil(req.usuario);
  if (!paciente) {
    return next(createAppError("No se encontró el perfil de paciente asociado a este usuario.", HTTP_STATUS.NOT_FOUND));
  }
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      paciente,
    },
  });
});

export const actualizarMiPerfil = catchAsync(async (req, res, next) => {
  const pacienteActualizado = await modificarPaciente(null, req.body, req.usuario);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      paciente: pacienteActualizado,
    },
  });
});

export const obtenerHistorialCitas = catchAsync(async (req, res, next) => {
  const { pacienteId } = req.params;
  const citas = await buscarHistorialCitasPorPacienteId(pacienteId);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      citas,
    },
  });
});
