import db from "../models/index.js";
import { Op } from "sequelize";
import { ROLES, HTTP_STATUS } from "../dictionaries/index.js";
import { createAppError } from "../utils/appError.js";

const { Paciente, Usuario } = db;

export const buscarTodosLosPacientes = async (query) => {
  const { q, page = 1, size = 10 } = query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  const whereClause = {};
  if (q) {
    whereClause[Op.or] = [{ nombre_completo: { [Op.iLike]: `%${q}%` } }, { dpi: { [Op.iLike]: `%${q}%` } }, { email: { [Op.iLike]: `%${q}%` } }];
  }

  return await Paciente.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [["nombre_completo", "ASC"]],
    include: [{ model: Usuario, as: "usuario", attributes: ["username"] }],
  });
};

export const buscarMiPerfil = async (usuario) => {
  return await Paciente.findOne({
    where: { usuarioId: usuario.id },
    include: [{ model: Usuario, as: "usuario", attributes: ["username", "rol"] }],
  });
};

export const buscarPacientePorId = async (id) => {
  return await Paciente.findByPk(id, {
    include: [{ model: Usuario, as: "usuario", attributes: ["username", "rol"] }],
  });
};

export const modificarPaciente = async (id, datosPaciente, usuario) => {
  let paciente;
  if (usuario.rol === ROLES.PACIENTE) {
    paciente = await Paciente.findOne({ where: { usuarioId: usuario.id } });
  } else {
    paciente = await Paciente.findByPk(id);
  }

  if (!paciente) throw createAppError("Paciente no encontrado", HTTP_STATUS.NOT_FOUND);

  const datosPermitidos = { ...datosPaciente };
  delete datosPermitidos.usuarioId;
  delete datosPermitidos.rol;

  return await paciente.update(datosPermitidos);
};

export const eliminarPaciente = async (id) => {
  const paciente = await Paciente.findByPk(id);
  if (!paciente) throw createAppError("Paciente no encontrado", HTTP_STATUS.NOT_FOUND);

  await Usuario.destroy({ where: { id: paciente.usuarioId } });
  return await paciente.destroy();
};
