export const ROLES = {
  ADMIN: 1,
  MEDICO: 2,
  PACIENTE: 3,
};

export const NOMBRES_ROLES = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.MEDICO]: "Médico",
  [ROLES.PACIENTE]: "Paciente",
};

export const CITA_ESTADOS = {
  PENDIENTE: 1,
  CONFIRMADA: 2,
  ATENDIDA: 3,
  CANCELADA: 4,
};

export const NOMBRES_ESTADOS_CITA = {
  [CITA_ESTADOS.PENDIENTE]: "Pendiente",
  [CITA_ESTADOS.CONFIRMADA]: "Confirmada",
  [CITA_ESTADOS.ATENDIDA]: "Atendida",
  [CITA_ESTADOS.CANCELADA]: "Cancelada",
};

export const COLORES_ESTADOS_CITA = {
  [CITA_ESTADOS.PENDIENTE]: "default",
  [CITA_ESTADOS.CONFIRMADA]: "secondary",
  [CITA_ESTADOS.ATENDIDA]: "outline",
  [CITA_ESTADOS.CANCELADA]: "destructive",
};

export const DIAS_SEMANA = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  0: "Domingo",
};

export const RUTAS_API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTRO: "/auth/register",
    PERFIL: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  CONFIGURACION: "/configuracion",
  SERVICIOS: "/servicios",
  MEDICOS: "/medicos",
  HORARIOS_MEDICO: (medicoId) => `/medicos/${medicoId}/horarios`,
  CITAS_OCUPADAS_MEDICO: (medicoId, fecha) => `/medicos/${medicoId}/citas-ocupadas?fecha=${fecha}`,
  CITAS: "/citas",
  PACIENTES: {
    BASE: "/pacientes",
    PERFIL: "/pacientes/me",
    HISTORIAL_CITAS: (pacienteId) => `/pacientes/${pacienteId}/citas`,
  },
  ADMIN: {
    DASHBOARD_STATS: "/admin/dashboard-stats",
    USUARIOS: "/admin/usuarios",
    MEDICOS: "/admin/medicos",
    PACIENTES: "/admin/pacientes",
  },
  ESPECIALIDADES: "/especialidades",
};

export const ESPECIALIDADES_MEDICAS = [
  "Cardiología",
  "Pediatría",
  "Dermatología",
  "Medicina General",
  "Nutrición",
  "Psicología",
  "Ginecología",
  "Oftalmología",
];
