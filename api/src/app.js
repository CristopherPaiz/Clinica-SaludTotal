import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createAppError } from "./utils/appError.js";
import errorHandler from "./middleware/errorHandler.js";
import allRoutes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", allRoutes);

app.all("*", (req, res, next) => {
  next(createAppError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

app.use(errorHandler);

export default app;
