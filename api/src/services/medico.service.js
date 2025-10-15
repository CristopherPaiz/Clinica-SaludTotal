import db from "../models/index.js";
import { Op } from "sequelize";
import { createAppError } from "../utils/appError.js";

const { Medico, Usuario } = db;

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
    attributes: ["id", "nombre_completo", "especialidad", "colegiado"],
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
