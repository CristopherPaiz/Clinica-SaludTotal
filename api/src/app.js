import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { createAppError } from "./utils/appError.js";
import errorHandler from "./middleware/errorHandler.js";
import allRoutes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://clinica-saludtotal-production.up.railway.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", allRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.all("*", (req, res, next) => {
  next(createAppError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

app.use(errorHandler);

export default app;
