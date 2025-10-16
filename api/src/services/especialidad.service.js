import { HTTP_STATUS } from "../dictionaries/httpStatusCodes.js";
import db from "../models/index.js";
import { createAppError } from "../utils/appError.js";

const { Especialidad } = db;

export const buscarTodas = async () => {
  return await Especialidad.findAll({ order: [["nombre", "ASC"]] });
};

export const crearEspecialidad = async (datos) => {
  return await Especialidad.create(datos);
};

export const actualizarEspecialidad = async (id, datos) => {
  const especialidad = await Especialidad.findByPk(id);
  if (!especialidad) throw createAppError("Especialidad no encontrada", HTTP_STATUS.NOT_FOUND);
  return await especialidad.update(datos);
};

export const eliminarEspecialidad = async (id) => {
  const especialidad = await Especialidad.findByPk(id);
  if (!especialidad) throw createAppError("Especialidad no encontrada", HTTP_STATUS.NOT_FOUND);
  try {
    await especialidad.destroy();
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw createAppError("No se puede eliminar la especialidad porque está asignada a uno o más médicos.", HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};
