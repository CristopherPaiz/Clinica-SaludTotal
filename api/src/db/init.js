import { fileURLToPath } from "url";
import db from "../models/index.js";
import bcrypt from "bcryptjs";
import { ROLES, CITA_ESTADOS } from "../dictionaries/index.js";

const hashPassword = (password) => bcrypt.hash(password, 10);

export const inicializarBaseDeDatos = async () => {
  try {
    console.log("Borrando y recreando todas las tablas...");
    await db.sequelize.sync({ force: true });
    console.log("Tablas creadas exitosamente.");

    const now = new Date();

    await db.Configuracion.create({
      nombre_negocio: "Clínica SaludTotal",
      servicios: "Ofrecemos servicios de Cardiología, Pediatría y Dermatología con profesionales altamente calificados.",
      horarios: "Lunes a Viernes: 8:00 AM - 6:00 PM. Sábados: 9:00 AM - 1:00 PM.",
      ubicacion: "Avenida Las Américas 18-81, Zona 14, Ciudad de Guatemala",
      mapa_coordenadas: "14.5881, -90.5133",
      duracion_cita_min: 30,
      galeria_imagenes: [
        {
          url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
          descripcion: "Equipo médico de última generación para diagnósticos precisos.",
        },
        {
          url: "https://plus.unsplash.com/premium_photo-1661608181771-15c091904235?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
          descripcion: "Atención pediátrica especializada y amigable para los más pequeños.",
        },
        {
          url: "https://images.unsplash.com/photo-1567745566980-4378a3db17fc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
          descripcion: "Consultorios cómodos y seguros para tu tranquilidad.",
        },
      ],
    });

    const usuarios = await db.Usuario.bulkCreate(
      [
        { username: "admin", password_hash: await hashPassword("admin123"), rol: ROLES.ADMIN, createdAt: now, updatedAt: now },
        { username: "cmorales", password_hash: await hashPassword("medico123"), rol: ROLES.MEDICO, createdAt: now, updatedAt: now },
        { username: "acastillo", password_hash: await hashPassword("medico123"), rol: ROLES.MEDICO, createdAt: now, updatedAt: now },
        { username: "jhernandez", password_hash: await hashPassword("user123"), rol: ROLES.PACIENTE, createdAt: now, updatedAt: now },
        { username: "mrodriguez", password_hash: await hashPassword("user123"), rol: ROLES.PACIENTE, createdAt: now, updatedAt: now },
        { username: "pgomez", password_hash: await hashPassword("user123"), rol: ROLES.PACIENTE, createdAt: now, updatedAt: now },
      ],
      { returning: true }
    );

    const medicos = await db.Medico.bulkCreate(
      [
        {
          nombre_completo: "Dr. Carlos Morales",
          colegiado: "12345",
          especialidad: "Cardiología",
          usuarioId: usuarios[1].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          nombre_completo: "Dra. Ana Sofía Castillo",
          colegiado: "54321",
          especialidad: "Pediatría",
          usuarioId: usuarios[2].id,
          createdAt: now,
          updatedAt: now,
        },
      ],
      { returning: true }
    );

    const pacientes = await db.Paciente.bulkCreate(
      [
        {
          nombre_completo: "José Hernández",
          dpi: "2580123450101",
          email: "jose.hernandez@example.com",
          telefono: "55551111",
          usuarioId: usuarios[3].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          nombre_completo: "María Rodríguez",
          dpi: "2580123450102",
          email: "maria.rodriguez@example.com",
          telefono: "55552222",
          usuarioId: usuarios[4].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          nombre_completo: "Pedro Gómez",
          dpi: "2580123450103",
          email: "pedro.gomez@example.com",
          telefono: "55553333",
          usuarioId: usuarios[5].id,
          createdAt: now,
          updatedAt: now,
        },
      ],
      { returning: true }
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const getCitaTime = (hour, minute) => new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), hour, minute, 0);

    await db.Cita.bulkCreate([
      {
        fecha_hora: getCitaTime(9, 0),
        estado: CITA_ESTADOS.CONFIRMADA,
        pacienteId: pacientes[0].id,
        medicoId: medicos[0].id,
        createdAt: now,
        updatedAt: now,
      },
      {
        fecha_hora: getCitaTime(10, 0),
        estado: CITA_ESTADOS.PENDIENTE,
        pacienteId: pacientes[1].id,
        medicoId: medicos[0].id,
        createdAt: now,
        updatedAt: now,
      },
      {
        fecha_hora: getCitaTime(11, 0),
        estado: CITA_ESTADOS.CONFIRMADA,
        pacienteId: pacientes[2].id,
        medicoId: medicos[1].id,
        createdAt: now,
        updatedAt: now,
      },
    ]);

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
