import jwt from "jsonwebtoken";
import { createAppError } from "../utils/appError.js";
import db from "../models/index.js";
import { ROLES_PERMISOS, TIPOS_PERMISO } from "../utils/permissions.js";
import catchAsync from "../utils/catchAsync.js";
import { HTTP_STATUS } from "../dictionaries/index.js";

const { Usuario } = db;

export const isAuth = (permisoId, tipoPermisoRequerido = TIPOS_PERMISO.LECTURA) => {
  return catchAsync(async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(createAppError("No estás autenticado. Por favor, inicia sesión.", HTTP_STATUS.UNAUTHORIZED));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioActual = await Usuario.findByPk(decoded.id);

    if (!usuarioActual) {
      return next(createAppError("El usuario de este token ya no existe.", HTTP_STATUS.UNAUTHORIZED));
    }

    req.usuario = usuarioActual;

    if (permisoId) {
      const permisosDelRol = ROLES_PERMISOS[usuarioActual.rol];
      const nivelPermisoUsuario = permisosDelRol ? permisosDelRol[permisoId] || 0 : 0;

      if (nivelPermisoUsuario < tipoPermisoRequerido) {
        return next(createAppError("No tienes permiso para realizar esta acción.", HTTP_STATUS.FORBIDDEN));
      }
    }

    next();
  });
};
