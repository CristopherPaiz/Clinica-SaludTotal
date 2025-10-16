import db from "../models/index.js";
import { Op } from "sequelize";
import { createAppError } from "../utils/appError.js";
import { CITA_ESTADOS } from "../dictionaries/index.js";

const { Medico, Usuario, Cita } = db;

export const buscarTodosLosMedicos = async (query) => {
  const { q, especialidad } = query;
  const whereClause = {};

  if (q) {
    whereClause.nombre_completo = { [Op.iLike]: `%${q}%` };
  }
  if (especialidad) {
    whereClause.especialidad = { [Op.iLike]: `%${especialidad}%` };
  }

  return await Medico.findAll({
    where: whereClause,
    attributes: ["id", "nombre_completo", "especialidad", "colegiado", "telefono"],
    order: [["nombre_completo", "ASC"]],
  });
};

export const buscarMiPerfil = async (usuario) => {
  return await Medico.findOne({
    where: { usuarioId: usuario.id },
    include: [{ model: Usuario, as: "usuario", attributes: ["username", "rol"] }],
  });
};

export const buscarMedicoPorId = async (id) => {
  return await Medico.findByPk(id, {
    include: [{ model: Usuario, as: "usuario", attributes: ["username", "rol"] }],
  });
};

export const modificarMedico = async (id, datosMedico) => {
  const medico = await Medico.findByPk(id);
  if (!medico) throw createAppError("Médico no encontrado", 404);
  return await medico.update(datosMedico);
};

export const eliminarMedico = async (id) => {
  const medico = await Medico.findByPk(id);
  if (!medico) throw createAppError("Médico no encontrado", 404);

  await Usuario.destroy({ where: { id: medico.usuarioId } });
  return await medico.destroy();
};

export const buscarCitasOcupadasPorDia = async (medicoId, fecha) => {
  const inicioDia = new Date(fecha);
  inicioDia.setUTCHours(0, 0, 0, 0);
  const finDia = new Date(fecha);
  finDia.setUTCHours(23, 59, 59, 999);

  return await Cita.findAll({
    where: {
      medicoId,
      fecha_hora: {
        [Op.between]: [inicioDia, finDia],
      },
      estado: { [Op.notIn]: [CITA_ESTADOS.CANCELADA] },
    },
    attributes: ["fecha_hora"],
  });
};
