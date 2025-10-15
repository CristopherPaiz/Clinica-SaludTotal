import * as configuracionService from "../services/configuracion.service.js";
import catchAsync from "../utils/catchAsync.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const getConfiguracion = catchAsync(async (req, res, next) => {
  const configuracion = await configuracionService.obtenerConfiguracion();
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      configuracion,
    },
  });
});

export const updateConfiguracion = catchAsync(async (req, res, next) => {
  const configuracionActualizada = await configuracionService.actualizarConfiguracion(req.body);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      configuracion: configuracionActualizada,
    },
  });
});
