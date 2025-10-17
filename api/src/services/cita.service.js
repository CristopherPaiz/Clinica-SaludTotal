export const crearNuevaCita = async (datosCita, usuario) => {
  const { medicoId, fecha_hora } = datosCita;
  const fechaCita = new Date(fecha_hora);

  const configuracion = await Configuracion.findOne();
  if (!configuracion) throw createAppError("La configuración del sistema no está disponible.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  const duracionCitaMin = configuracion.duracion_cita_min;

  if (fechaCita < new Date()) {
    throw createAppError("No se pueden crear citas en el pasado.", HTTP_STATUS.BAD_REQUEST);
  }

  const CLINICA_TIMEZONE = "America/Guatemala";

  const diaSemanaLocal = fechaCita.getDay();
  const diaSemanaParaDB = diaSemanaLocal === 0 ? 7 : diaSemanaLocal;

  const horaLocalString = fechaCita.toLocaleTimeString("en-GB", { timeZone: CLINICA_TIMEZONE, hour: "2-digit", minute: "2-digit" });
  const [hora, minuto] = horaLocalString.split(":").map(Number);
  const horaCitaEnMinutos = hora * 60 + minuto;

  const horarioDelDia = await HorarioMedico.findOne({ where: { medicoId, dia_semana: diaSemanaParaDB } });

  if (!horarioDelDia) {
    throw createAppError("El médico no tiene un horario de trabajo definido para el día seleccionado.", HTTP_STATUS.BAD_REQUEST);
  }

  const [inicioH, inicioM] = horarioDelDia.hora_inicio.split(":").map(Number);
  const horaInicioMin = inicioH * 60 + inicioM;
  const [finH, finM] = horarioDelDia.hora_fin.split(":").map(Number);
  const horaFinMin = finH * 60 + finM;

  if (horaCitaEnMinutos < horaInicioMin || horaCitaEnMinutos + duracionCitaMin > horaFinMin) {
    const horaSolicitada = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
    throw createAppError(
      `La hora solicitada (${horaSolicitada}) está fuera del horario laboral del médico para ese día (${horarioDelDia.hora_inicio} - ${horarioDelDia.hora_fin}).`,
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
