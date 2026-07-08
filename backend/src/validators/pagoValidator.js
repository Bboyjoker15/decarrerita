const { body } = require("express-validator");

const crear = [
  body("chofer_id").isInt().withMessage("El chofer es requerido"),
  body("monto").isFloat({ min: 0.01 }).withMessage("El monto debe ser mayor a cero"),
  body("referencia").notEmpty().withMessage("La referencia es requerida"),
];

module.exports = { crear };
