import db from "../models/index.js";

const { Servicio } = db;

export const buscarTodosLosServicios = async () => {
  return await Servicio.findAll({
    order: [["nombre", "ASC"]],
  });
};
