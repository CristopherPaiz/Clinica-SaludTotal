import { z } from "zod";

export const esquemaLogin = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const esquemaRegistro = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  nombre_completo: z.string().min(3, "El nombre completo es obligatorio."),
  dpi: z.string().length(13, "El DPI debe tener 13 dígitos.").regex(/^\d+$/, "El DPI solo debe contener números."),
  email: z.string().email("El formato del correo electrónico no es válido."),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos.").regex(/^\d+$/, "El teléfono solo debe contener números."),
});

export const esquemaNuevaCita = z.object({
  medicoId: z.string().min(1, "Debe seleccionar un médico."),
  fecha_hora: z.date({ required_error: "Debe seleccionar una fecha y hora." }),
});
