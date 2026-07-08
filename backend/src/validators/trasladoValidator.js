const { body, param } = require("express-validator");
const ESTADOS = require("../constants/estados");

const crear = [
  body("origen").notEmpty().withMessage("El origen es requerido"),
  body("destino").notEmpty().withMessage("El destino es requerido"),
  body("distancia_km").isFloat({ min: 0.1 }).withMessage("La distancia debe ser mayor a 0"),
  body("tarifa_km").isFloat({ min: 0.01 }).withMessage("La tarifa debe ser mayor a 0"),
];

const actualizarEstado = [
  param("id").isInt().withMessage("ID de traslado inválido"),
  body("estado")
    .isIn(Object.values(ESTADOS))
    .withMessage(`Estado inválido. Valores: ${Object.values(ESTADOS).join(", ")}`),
];

module.exports = { crear, actualizarEstado };
