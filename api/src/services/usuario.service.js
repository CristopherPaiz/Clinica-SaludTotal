import db from "../models/index.js";
import { ROLES, HTTP_STATUS } from "../dictionaries/index.js";
import { createAppError } from "../utils/appError.js";
import { Op } from "sequelize";

const { Usuario, Paciente, Medico, sequelize } = db;

export const buscarTodosLosUsuarios = async (query) => {
  const { q, page = 1, size = 10, rol } = query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  const whereClause = {};
  if (q) {
    whereClause.username = { [Op.iLike]: `%${q}%` };
  }
  if (rol) {
    whereClause.rol = rol;
  }

  return await Usuario.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    attributes: ["id", "username", "rol", "createdAt"],
    order: [["username", "ASC"]],
  });
};

const registrarUsuarioConPerfil = async (datos, rol, modeloPerfil, camposPerfil) => {
  const t = await sequelize.transaction();
  try {
    const password = datos.password || `${datos.username.toLowerCase()}123`;

    const nuevoUsuario = await Usuario.create(
      {
        username: datos.username,
        password_hash: password,
        rol: rol,
      },
      { transaction: t }
    );

    const datosPerfil = { usuarioId: nuevoUsuario.id };
    camposPerfil.forEach((campo) => {
      datosPerfil[campo] = datos[campo];
    });

    await modeloPerfil.create(datosPerfil, { transaction: t });

    await t.commit();
    return nuevoUsuario;
  } catch (error) {
    await t.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      throw createAppError("El email, DPI, colegiado o nombre de usuario ya están registrados.", HTTP_STATUS.BAD_REQUEST);
    }
    throw error;
  }
};

export const registrarNuevoPaciente = async (datos) => {
  return registrarUsuarioConPerfil(datos, ROLES.PACIENTE, Paciente, ["nombre_completo", "dpi", "email", "telefono"]);
};

export const registrarNuevoMedico = async (datos) => {
  return registrarUsuarioConPerfil(datos, ROLES.MEDICO, Medico, ["nombre_completo", "colegiado", "especialidad"]);
};
