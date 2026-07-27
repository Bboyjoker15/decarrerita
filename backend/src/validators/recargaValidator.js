const { body } = require("express-validator");

const crear = [
  body("fecha_deposito")
    .optional()
    .isISO8601().withMessage("La fecha de depósito debe ser una fecha válida (YYYY-MM-DD)"),
  body("banco_id")
    .notEmpty().withMessage("El banco es obligatorio")
    .isInt().withMessage("El banco debe ser un ID válido"),
  body("referencia")
    .notEmpty().withMessage("El número de referencia es obligatorio")
    .isString().withMessage("La referencia debe ser texto"),
  body("monto")
    .notEmpty().withMessage("El monto es obligatorio")
    .isFloat({ min: 0.01 }).withMessage("El monto debe ser mayor a 0"),
];

module.exports = { crear };
