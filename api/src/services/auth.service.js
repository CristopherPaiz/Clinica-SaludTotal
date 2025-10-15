import db from "../models/index.js";

const { Usuario } = db;

export const buscarUsuarioPorUsername = async (username) => {
  return await Usuario.findOne({ where: { username } });
};
