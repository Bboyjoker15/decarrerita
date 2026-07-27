const { body, param } = require("express-validator");
const ESTADOS = require("../constants/estados");

const crear = [
  body("origen").notEmpty().withMessage("El origen es requerido"),
  body("destino").notEmpty().withMessage("El destino es requerido"),
];

const actualizarEstado = [
  param("id").isInt().withMessage("ID de traslado inválido"),
  body("estado")
    .isIn(Object.values(ESTADOS))
    .withMessage(`Estado inválido. Valores: ${Object.values(ESTADOS).join(", ")}`),
];

module.exports = { crear, actualizarEstado };
