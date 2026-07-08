const { body } = require("express-validator");

const actualizar = [
  body("saldo").optional().isFloat({ min: 0 }).withMessage("El saldo debe ser un número positivo"),
];

module.exports = { actualizar };
