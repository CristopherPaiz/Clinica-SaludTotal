import db from "../models/index.js";
import { createAppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

const { HorarioMedico, Medico } = db;

export const obtenerHorariosPorMedico = async (medicoId) => {
  return await HorarioMedico.findAll({ where: { medicoId }, order: [["dia_semana", "ASC"]] });
};

export const crearHorario = async (medicoId, datosHorario) => {
  const medico = await Medico.findByPk(medicoId);
  if (!medico) {
    throw createAppError("El médico especificado no existe.", HTTP_STATUS.NOT_FOUND);
  }

  const horarioExistente = await HorarioMedico.findOne({
    where: {
      medicoId,
      dia_semana: datosHorario.dia_semana,
    },
  });

  if (horarioExistente) {
    throw createAppError("Ya existe un horario para este médico en el día especificado.", HTTP_STATUS.CONFLICT);
  }

  return await HorarioMedico.create({ ...datosHorario, medicoId });
};

export const actualizarHorario = async (horarioId, datosHorario) => {
  const horario = await HorarioMedico.findByPk(horarioId);
  if (!horario) {
    throw createAppError("El horario especificado no existe.", HTTP_STATUS.NOT_FOUND);
  }
  return await horario.update(datosHorario);
};

export const eliminarHorario = async (horarioId) => {
  const horario = await HorarioMedico.findByPk(horarioId);
  if (!horario) {
    throw createAppError("El horario especificado no existe.", HTTP_STATUS.NOT_FOUND);
  }
  await horario.destroy();
};
