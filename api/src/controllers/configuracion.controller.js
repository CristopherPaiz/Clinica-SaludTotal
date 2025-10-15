import { obtenerConfiguracion, actualizarConfiguracion } from "../services/configuracion.service.js";
import catchAsync from "../utils/catchAsync.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const getConfiguracion = catchAsync(async (req, res, next) => {
  const configuracion = await obtenerConfiguracion();
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      configuracion,
    },
  });
});

export const updateConfiguracion = catchAsync(async (req, res, next) => {
  const configuracionActualizada = await actualizarConfiguracion(req.body);
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      configuracion: configuracionActualizada,
    },
  });
});
