import "dotenv/config";
import app from "./app.js";
import db from "./models/index.js";
import { inicializarBaseDeDatos } from "./db/init.js";

const PORT = process.env.API_PORT || 3001;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");

    try {
      await db.sequelize.query('SELECT 1 FROM "Usuarios" LIMIT 1;');
      console.log("La base de datos ya está inicializada. Omitiendo la creación de datos.");
    } catch (error) {
      console.log("La base de datos parece estar vacía. Inicializando...");
      await inicializarBaseDeDatos();
    }

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar o inicializar la base de datos:", error);
    process.exit(1);
  }
};

startServer();
