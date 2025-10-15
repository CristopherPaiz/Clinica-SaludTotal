import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service.js";
import * as usuarioService from "../services/usuario.service.js";
import catchAsync from "../utils/catchAsync.js";
import { createAppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

const firmarTokenYEnviarCookie = (usuario, statusCode, res) => {
  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  usuario.password_hash = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      usuario: {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol,
      },
    },
  });
};

export const iniciarSesion = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(createAppError("Por favor, proporciona usuario y contraseña.", HTTP_STATUS.BAD_REQUEST));
  }

  const usuario = await authService.buscarUsuarioPorUsername(username);

  if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
    return next(createAppError("Credenciales inválidas.", HTTP_STATUS.UNAUTHORIZED));
  }

  firmarTokenYEnviarCookie(usuario, HTTP_STATUS.OK, res);
});

export const registrarPaciente = catchAsync(async (req, res, next) => {
  const nuevoUsuario = await usuarioService.registrarNuevoPaciente(req.body);
  firmarTokenYEnviarCookie(nuevoUsuario, HTTP_STATUS.CREATED, res);
});

export const getMe = catchAsync(async (req, res, next) => {
  const { id, username, rol } = req.usuario;
  res.status(HTTP_STATUS.OK).json({
    status: "success",
    data: {
      usuario: { id, username, rol },
    },
  });
});

export const cerrarSesion = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(HTTP_STATUS.OK).json({ status: "success" });
};
