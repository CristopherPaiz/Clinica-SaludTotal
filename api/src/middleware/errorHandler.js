import { HTTP_STATUS } from "../dictionaries/index.js";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  if (err.name === "SequelizeUniqueConstraintError") {
    const message = `Valor duplicado para el campo: ${err.errors[0].path}.`;
    err.statusCode = HTTP_STATUS.BAD_REQUEST;
    err.message = message;
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
