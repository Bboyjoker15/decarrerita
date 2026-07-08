const { body } = require("express-validator");

const actualizar = [
  body("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("apellido").optional().notEmpty().withMessage("El apellido no puede estar vacío"),
  body("telefono").optional().notEmpty().withMessage("El teléfono no puede estar vacío"),
  body("correo").optional().isEmail().withMessage("Correo inválido"),
];

module.exports = { actualizar };
