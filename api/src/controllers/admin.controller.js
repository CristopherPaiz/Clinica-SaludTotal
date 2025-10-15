import { buscarTodosLosUsuarios, registrarNuevoMedico, registrarNuevoPaciente } from "../services/usuario.service.js";
import { buscarMedicoPorId, modificarMedico, eliminarMedico } from "../services/medico.service.js";
import { buscarPacientePorId, modificarPaciente, eliminarPaciente } from "../services/paciente.service.js";
import catchAsync from "../utils/catchAsync.js";
import { createAppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const listarUsuarios = catchAsync(async (req, res, next) => {
  const usuarios = await buscarTodosLosUsuarios(req.query);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      usuarios,
    },
  });
});

export const crearNuevoMedico = catchAsync(async (req, res, next) => {
  const nuevoMedico = await registrarNuevoMedico(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    status: "success",
    data: {
      medico: nuevoMedico,
    },
  });
});

export const crearNuevoPaciente = catchAsync(async (req, res, next) => {
  const nuevoPaciente = await registrarNuevoPaciente(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    status: "success",
    data: {
      paciente: nuevoPaciente,
    },
  });
});

export const obtenerMedicoPorId = catchAsync(async (req, res, next) => {
  const medico = await buscarMedicoPorId(req.params.id);
  if (!medico) {
    return next(createAppError("No se encontró un médico con ese ID", HTTP_STATUS.NOT_FOUND));
  }
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      medico,
    },
  });
});

export const actualizarMedico = catchAsync(async (req, res, next) => {
  const medicoActualizado = await modificarMedico(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      medico: medicoActualizado,
    },
  });
});

export const eliminarMedicoController = catchAsync(async (req, res, next) => {
  await eliminarMedico(req.params.id);
  res.status(HTTP_STATUS.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});

export const obtenerPacientePorId = catchAsync(async (req, res, next) => {
  const paciente = await buscarPacientePorId(req.params.id);
  if (!paciente) {
    return next(createAppError("No se encontró un paciente con ese ID", HTTP_STATUS.NOT_FOUND));
  }
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      paciente,
    },
  });
});

export const actualizarPaciente = catchAsync(async (req, res, next) => {
  const pacienteActualizado = await modificarPaciente(req.params.id, req.body, req.usuario);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      paciente: pacienteActualizado,
    },
  });
});

export const eliminarPacienteController = catchAsync(async (req, res, next) => {
  await eliminarPaciente(req.params.id);
  res.status(HTTP_STATUS.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});
