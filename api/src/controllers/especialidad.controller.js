import * as service from "../services/especialidad.service.js";
import catchAsync from "../utils/catchAsync.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const obtenerEspecialidades = catchAsync(async (req, res) => {
  const especialidades = await service.buscarTodas();
  res.status(HTTP_STATUS.OK).json({ status: "success", data: { especialidades } });
});

export const crearEspecialidad = catchAsync(async (req, res) => {
  const nueva = await service.crearEspecialidad(req.body);
  res.status(HTTP_STATUS.CREATED).json({ status: "success", data: { especialidad: nueva } });
});

export const actualizarEspecialidad = catchAsync(async (req, res) => {
  const actualizada = await service.actualizarEspecialidad(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json({ status: "success", data: { especialidad: actualizada } });
});

export const eliminarEspecialidad = catchAsync(async (req, res) => {
  await service.eliminarEspecialidad(req.params.id);
  res.status(HTTP_STATUS.NO_CONTENT).json({ status: "success", data: null });
});
