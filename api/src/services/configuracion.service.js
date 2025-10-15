import db from "../models/index.js";
import { createAppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

const { Configuracion } = db;

export const obtenerConfiguracion = async () => {
  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    throw createAppError("La configuración del sistema no ha sido establecida.", HTTP_STATUS.NOT_FOUND);
  }
  return configuracion;
};

export const actualizarConfiguracion = async (nuevosDatos) => {
  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    throw createAppError("La configuración del sistema no ha sido establecida.", HTTP_STATUS.NOT_FOUND);
  }
  return await configuracion.update(nuevosDatos);
};
