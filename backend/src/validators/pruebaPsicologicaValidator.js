const { body } = require("express-validator");

const crear = [
  body("chofer_id").isInt().withMessage("El chofer es requerido"),
  body("calificacion").isFloat({ min: 0, max: 100 }).withMessage("La calificación debe estar entre 0 y 100"),
];

const actualizar = [
  body("calificacion").optional().isFloat({ min: 0, max: 100 }).withMessage("La calificación debe estar entre 0 y 100"),
];

module.exports = { crear, actualizar };
