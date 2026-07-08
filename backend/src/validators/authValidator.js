const { body } = require("express-validator");
const ROLES = require("../constants/roles");

const register = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("apellido").notEmpty().withMessage("El apellido es requerido"),
  body("cedula").notEmpty().withMessage("La cédula es requerida"),
  body("telefono").notEmpty().withMessage("El teléfono es requerido"),
  body("correo").isEmail().withMessage("Correo inválido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("rol")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Rol inválido. Valores: ${Object.values(ROLES).join(", ")}`),
];

const login = [
  body("correo").isEmail().withMessage("Correo inválido"),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
];

module.exports = { register, login };
