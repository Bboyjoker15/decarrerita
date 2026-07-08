const { body } = require("express-validator");

const crear = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("apellido").notEmpty().withMessage("El apellido es requerido"),
  body("cedula").notEmpty().withMessage("La cédula es requerida"),
  body("telefono").notEmpty().withMessage("El teléfono es requerido"),
  body("correo").isEmail().withMessage("Correo inválido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("banco_id").isInt().withMessage("El banco es requerido"),
  body("numero_cuenta").notEmpty().withMessage("El número de cuenta es requerido"),
  body("contactos").isArray({ min: 2 }).withMessage("Debe tener al menos 2 contactos de emergencia"),
  body("contactos.*.nombre").notEmpty().withMessage("El nombre del contacto es requerido"),
  body("contactos.*.telefono").notEmpty().withMessage("El teléfono del contacto es requerido"),
  body("contactos.*.parentesco").notEmpty().withMessage("El parentesco del contacto es requerido"),
];

const actualizar = [
  body("banco_id").optional().isInt().withMessage("Banco inválido"),
  body("numero_cuenta").optional().notEmpty().withMessage("Número de cuenta inválido"),
];

module.exports = { crear, actualizar };
