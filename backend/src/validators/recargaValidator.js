const { body } = require("express-validator");

const crear = [
  body("banco_id").isInt().withMessage("El banco es requerido"),
  body("referencia").notEmpty().withMessage("La referencia es requerida"),
  body("monto").isFloat({ min: 0.01 }).withMessage("El monto debe ser mayor a cero"),
];

module.exports = { crear };
