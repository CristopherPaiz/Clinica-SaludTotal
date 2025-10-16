import { buscarTodosLosServicios } from "../services/servicio.service.js";
import catchAsync from "../utils/catchAsync.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

export const obtenerServicios = catchAsync(async (req, res, next) => {
  const servicios = await buscarTodosLosServicios();
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      servicios,
    },
  });
});
