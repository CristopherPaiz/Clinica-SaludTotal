import * as citaService from "../services/cita.service.js";
import catchAsync from "../utils/catchAsync.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const obtenerCitas = catchAsync(async (req, res, next) => {
  const citas = await citaService.buscarCitas(req.query, req.usuario);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      citas,
    },
  });
});

export const crearCita = catchAsync(async (req, res, next) => {
  const nuevaCita = await citaService.crearNuevaCita(req.body, req.usuario);
  res.status(HTTP_STATUS.CREATED).json({
    status: "success",
    data: {
      cita: nuevaCita,
    },
  });
});

export const actualizarCita = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const citaActualizada = await citaService.modificarCita(id, req.body, req.usuario);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      cita: citaActualizada,
    },
  });
});

export const cancelarCita = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await citaService.cancelarCita(id, req.usuario);
  res.status(HTTP_STATUS.NO_CONTENT).json({
    status: "success",
    data: null,
  });
});
