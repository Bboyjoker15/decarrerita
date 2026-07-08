const { body } = require("express-validator");

const crear = [
  body("nombre").notEmpty().withMessage("El nombre del banco es requerido"),
  body("codigo").notEmpty().withMessage("El código del banco es requerido"),
];

const actualizar = [
  body("nombre").optional().notEmpty().withMessage("El nombre del banco no puede estar vacío"),
  body("codigo").optional().notEmpty().withMessage("El código del banco no puede estar vacío"),
];

module.exports = { crear, actualizar };
