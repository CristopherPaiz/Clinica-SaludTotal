import { fileURLToPath } from "url";
import db from "../models/index.js";
import { ROLES, CITA_ESTADOS } from "../dictionaries/index.js";

export const inicializarBaseDeDatos = async () => {
  try {
    console.log("Borrando y recreando todas las tablas...");
    await db.sequelize.sync({ force: true });
    console.log("Tablas creadas exitosamente.");

    await db.Configuracion.create({
      nombre_negocio: "Clínica SaludTotal",
      servicios: "Ofrecemos servicios de Cardiología, Pediatría y Dermatología con profesionales altamente calificados.",
      horarios: "Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 9:00 AM - 1:00 PM.",
      ubicacion: "Avenida Las Américas 18-81, Zona 14, Ciudad de Guatemala",
      mapa_coordenadas: "14.5881, -90.5133",
      duracion_cita_min: 30,
      nosotros_texto:
        "En Clínica SaludTotal, nuestra misión es proporcionar atención médica integral y de alta calidad a nuestros pacientes. Fundada en 2010, hemos crecido hasta convertirnos en un referente de confianza en la comunidad, gracias a nuestro compromiso con la excelencia, la ética profesional y el trato humano. Contamos con un equipo de especialistas dedicados y tecnología de vanguardia para garantizar diagnósticos precisos y tratamientos efectivos.",
      galeria_imagenes: [
        {
          url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
          descripcion: "Equipo médico de última generación.",
        },
        {
          url: "https://plus.unsplash.com/premium_photo-1661608181771-15c091904235",
          descripcion: "Atención pediátrica especializada.",
        },
        {
          url: "https://images.unsplash.com/photo-1567745566980-4378a3db17fc",
          descripcion: "Consultorios cómodos y seguros.",
        },
      ],
    });

    await db.Servicio.bulkCreate([
      { nombre: "Cardiología", descripcion: "Prevención, diagnóstico y tratamiento de enfermedades del corazón.", icono: "HeartPulse" },
      { nombre: "Pediatría", descripcion: "Atención médica integral para bebés, niños y adolescentes.", icono: "Stethoscope" },
      { nombre: "Dermatología", descripcion: "Cuidado de la piel, cabello y uñas, tratando diversas afecciones.", icono: "Sparkles" },
      { nombre: "Medicina General", descripcion: "Atención primaria y continua para pacientes de todas las edades.", icono: "Activity" },
      { nombre: "Nutrición", descripcion: "Asesoramiento para una alimentación saludable y planes personalizados.", icono: "Salad" },
      { nombre: "Psicología", descripcion: "Apoyo para el bienestar mental y emocional de nuestros pacientes.", icono: "Brain" },
    ]);

    const now = new Date();
    const usuarios = await db.Usuario.bulkCreate(
      [
        { username: "admin", password_hash: "admin123", rol: ROLES.ADMIN, createdAt: now, updatedAt: now },
        { username: "superadmin", password_hash: "superadmin123", rol: ROLES.ADMIN, createdAt: now, updatedAt: now },
        { username: "cmorales", password_hash: "medico123", rol: ROLES.MEDICO, createdAt: now, updatedAt: now },
        { username: "acastillo", password_hash: "medico123", rol: ROLES.MEDICO, createdAt: now, updatedAt: now },
        { username: "lvega", password_hash: "medico123", rol: ROLES.MEDICO, createdAt: now, updatedAt: now },
        { username: "jbarrios", password_hash: "medico123", rol: ROLES.MEDICO, createdAt: now, updatedAt: now },
        ...Array.from({ length: 10 }, (_, i) => ({
          username: `paciente${i + 1}`,
          password_hash: "user123",
          rol: ROLES.PACIENTE,
          createdAt: now,
          updatedAt: now,
        })),
      ],
      { individualHooks: true, returning: true }
    );

    const medicos = await db.Medico.bulkCreate(
      [
        { nombre_completo: "Dr. Carlos Morales", colegiado: "12345", especialidad: "Cardiología", telefono: "2233-4455", usuarioId: usuarios[2].id },
        {
          nombre_completo: "Dra. Ana Sofía Castillo",
          colegiado: "54321",
          especialidad: "Pediatría",
          telefono: "2233-4456",
          usuarioId: usuarios[3].id,
        },
        { nombre_completo: "Dra. Lucía Vega", colegiado: "98765", especialidad: "Dermatología", telefono: "2233-4457", usuarioId: usuarios[4].id },
        { nombre_completo: "Dr. Javier Barrios", colegiado: "67890", especialidad: "Cardiología", telefono: "2233-4458", usuarioId: usuarios[5].id },
      ],
      { returning: true }
    );

    await db.HorarioMedico.bulkCreate([
      { medicoId: medicos[0].id, dia_semana: 1, hora_inicio: "08:00", hora_fin: "12:00" },
      { medicoId: medicos[0].id, dia_semana: 3, hora_inicio: "08:00", hora_fin: "12:00" },
      { medicoId: medicos[0].id, dia_semana: 5, hora_inicio: "08:00", hora_fin: "12:00" },
      { medicoId: medicos[1].id, dia_semana: 2, hora_inicio: "14:00", hora_fin: "18:00" },
      { medicoId: medicos[1].id, dia_semana: 4, hora_inicio: "14:00", hora_fin: "18:00" },
      { medicoId: medicos[2].id, dia_semana: 1, hora_inicio: "09:00", hora_fin: "17:00" },
      { medicoId: medicos[2].id, dia_semana: 2, hora_inicio: "09:00", hora_fin: "17:00" },
      { medicoId: medicos[3].id, dia_semana: 5, hora_inicio: "10:00", hora_fin: "14:00" },
    ]);

    const nombresPacientes = [
      "José Hernández",
      "María Rodríguez",
      "Pedro Gómez",
      "Sofía Fuentes",
      "Luis Vásquez",
      "Ana Pérez",
      "Juan García",
      "Laura Martínez",
      "Diego López",
      "Carla Sánchez",
    ];
    const pacientes = await db.Paciente.bulkCreate(
      Array.from({ length: 10 }, (_, i) => ({
        nombre_completo: nombresPacientes[i],
        dpi: `25801234501${String(i).padStart(2, "0")}`,
        email: `paciente${i + 1}@example.com`,
        telefono: `5555${String(i).padStart(4, "0")}`,
        usuarioId: usuarios[i + 6].id,
      })),
      { returning: true }
    );

    const baseDate = new Date("2025-10-18T00:00:00Z");
    const citas = [
      { medico: 0, paciente: 0, diaOffset: 2, hora: 9, min: 30 },
      { medico: 0, paciente: 1, diaOffset: 2, hora: 10, min: 0 },
      { medico: 1, paciente: 2, diaOffset: 3, hora: 14, min: 0 },
      { medico: 1, paciente: 3, diaOffset: 3, hora: 15, min: 30 },
      { medico: 2, paciente: 4, diaOffset: 2, hora: 11, min: 0 },
      { medico: 2, paciente: 5, diaOffset: 3, hora: 10, min: 0 },
      { medico: 3, paciente: 6, diaOffset: 6, hora: 10, min: 30 },
      { medico: 0, paciente: 7, diaOffset: 4, hora: 9, min: 0 },
      { medico: 1, paciente: 8, diaOffset: 5, hora: 16, min: 0 },
      { medico: 2, paciente: 9, diaOffset: 2, hora: 14, min: 30 },
    ];

    await db.Cita.bulkCreate(
      citas.map((c) => {
        const fecha = new Date(baseDate);
        fecha.setUTCDate(baseDate.getUTCDate() + c.diaOffset);
        fecha.setUTCHours(c.hora, c.min, 0, 0);
        return {
          fecha_hora: fecha,
          estado: CITA_ESTADOS.PENDIENTE,
          pacienteId: pacientes[c.paciente].id,
          medicoId: medicos[c.medico].id,
        };
      })
    );

    console.log("Datos de prueba insertados.");
    console.log("¡Base de datos inicializada/reseteada exitosamente!");
  } catch (error) {
    console.error("Error durante la inicialización de la base de datos:", error);
    throw error;
  }
};

const main = async () => {
  try {
    await inicializarBaseDeDatos();
  } catch (error) {
    console.error("Falló el script de reseteo.");
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
};

if (import.meta.url.startsWith("file://") && process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
