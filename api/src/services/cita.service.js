import db from "../models/index.js";
import { Op } from "sequelize";
import { ROLES, CITA_ESTADOS, HTTP_STATUS } from "../dictionaries/index.js";
import { createAppError } from "../utils/appError.js";

const { Cita, Paciente, Medico, Configuracion, HorarioMedico } = db;

export const buscarCitas = async (query, usuario) => {
  const { page = 1, size = 10, estado, medicoId, fecha } = query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  const whereClause = {};
  if (estado) whereClause.estado = estado;
  if (medicoId) whereClause.medicoId = medicoId;
  if (fecha) {
    const startOfDay = new Date(fecha);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setUTCHours(23, 59, 59, 999);
    whereClause.fecha_hora = { [Op.between]: [startOfDay, endOfDay] };
  }

  if (usuario.rol === ROLES.PACIENTE) {
    const paciente = await Paciente.findOne({ where: { usuarioId: usuario.id } });
    if (!paciente) throw createAppError("Perfil de paciente no encontrado.", HTTP_STATUS.NOT_FOUND);
    whereClause.pacienteId = paciente.id;
  } else if (usuario.rol === ROLES.MEDICO) {
    const medico = await Medico.findOne({ where: { usuarioId: usuario.id } });
    if (!medico) throw createAppError("Perfil de médico no encontrado.", HTTP_STATUS.NOT_FOUND);
    whereClause.medicoId = medico.id;
  }

  return await Cita.findAndCountAll({
    where: whereClause,
    include: [
      { model: Medico, as: "medico", attributes: ["id", "nombre_completo", "especialidad"] },
      { model: Paciente, as: "paciente", attributes: ["id", "nombre_completo"] },
    ],
    limit,
    offset,
    order: [["fecha_hora", "ASC"]],
  });
};

export const crearNuevaCita = async (datosCita, usuario) => {
  const { medicoId, fecha_hora } = datosCita;
  const fechaCita = new Date(fecha_hora);

  const configuracion = await Configuracion.findOne();
  if (!configuracion) throw createAppError("La configuración del sistema no está disponible.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  const duracionCitaMin = configuracion.duracion_cita_min;

  if (fechaCita < new Date()) {
    throw createAppError("No se pueden crear citas en el pasado.", HTTP_STATUS.BAD_REQUEST);
  }

  const diaSemana = fechaCita.getUTCDay();
  const horaCitaEnMinutos = fechaCita.getUTCHours() * 60 + fechaCita.getUTCMinutes();

  const horarioDelDia = await HorarioMedico.findOne({ where: { medicoId, dia_semana: diaSemana } });

  if (!horarioDelDia) {
    throw createAppError("El médico no tiene un horario de trabajo definido para el día seleccionado.", HTTP_STATUS.BAD_REQUEST);
  }

  const [inicioH, inicioM] = horarioDelDia.hora_inicio.split(":").map(Number);
  const horaInicioMin = inicioH * 60 + inicioM;
  const [finH, finM] = horarioDelDia.hora_fin.split(":").map(Number);
  const horaFinMin = finH * 60 + finM;

  if (horaCitaEnMinutos < horaInicioMin || horaCitaEnMinutos + duracionCitaMin > horaFinMin) {
    throw createAppError(
      `El horario solicitado está fuera del horario laboral del médico (${horarioDelDia.hora_inicio} - ${horarioDelDia.hora_fin}).`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const fechaFinCita = new Date(fechaCita.getTime() + duracionCitaMin * 60000);
  const solape = await Cita.findOne({
    where: {
      medicoId,
      fecha_hora: {
        [Op.lt]: fechaFinCita,
        [Op.gte]: new Date(fechaCita.getTime() - (duracionCitaMin - 1) * 60000),
      },
      estado: { [Op.notIn]: [CITA_ESTADOS.CANCELADA] },
    },
  });

  if (solape) {
    throw createAppError("El médico ya tiene una cita en ese horario.", HTTP_STATUS.CONFLICT);
  }

  const paciente = await Paciente.findOne({ where: { usuarioId: usuario.id } });
  if (!paciente) {
    throw createAppError("El perfil del paciente no fue encontrado.", HTTP_STATUS.NOT_FOUND);
  }

  const startOfDay = new Date(fechaCita);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(fechaCita);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const citaExistenteMismoDia = await Cita.findOne({
    where: {
      pacienteId: paciente.id,
      medicoId,
      fecha_hora: { [Op.between]: [startOfDay, endOfDay] },
      estado: { [Op.notIn]: [CITA_ESTADOS.CANCELADA] },
    },
  });

  if (citaExistenteMismoDia) {
    throw createAppError("Ya tienes una cita con este médico para este día.", HTTP_STATUS.CONFLICT);
  }

  return await Cita.create({ ...datosCita, pacienteId: paciente.id, estado: CITA_ESTADOS.PENDIENTE });
};

export const modificarCita = async (id, datosCita, usuario) => {
  const cita = await Cita.findByPk(id);
  if (!cita) throw createAppError("Cita no encontrada", HTTP_STATUS.NOT_FOUND);

  if (usuario.rol === ROLES.PACIENTE) {
    const paciente = await Paciente.findOne({ where: { usuarioId: usuario.id } });
    if (cita.pacienteId !== paciente.id) {
      throw createAppError("No tienes permiso para modificar esta cita.", HTTP_STATUS.FORBIDDEN);
    }
  } else if (usuario.rol === ROLES.MEDICO) {
    const medico = await Medico.findOne({ where: { usuarioId: usuario.id } });
    if (cita.medicoId !== medico.id) {
      throw createAppError("No tienes permiso para modificar esta cita.", HTTP_STATUS.FORBIDDEN);
    }
  }

  return await cita.update(datosCita);
};

export const cancelarCita = async (id, usuario) => {
  const cita = await Cita.findByPk(id);
  if (!cita) throw createAppError("Cita no encontrada", HTTP_STATUS.NOT_FOUND);

  if (usuario.rol === ROLES.PACIENTE) {
    const paciente = await Paciente.findOne({ where: { usuarioId: usuario.id } });
    if (cita.pacienteId !== paciente.id) {
      throw createAppError("No tienes permiso para cancelar esta cita.", HTTP_STATUS.FORBIDDEN);
    }
  }

  return await cita.update({ estado: CITA_ESTADOS.CANCELADA });
};
