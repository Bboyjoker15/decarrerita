const { body } = require("express-validator");

const crear = [
  body("chofer_id").isInt().withMessage("El chofer es requerido"),
  body("marca").notEmpty().withMessage("La marca es requerida"),
  body("modelo").notEmpty().withMessage("El modelo es requerido"),
  body("placa").notEmpty().withMessage("La placa es requerida"),
  body("anio").isInt({ min: 2000, max: 2030 }).withMessage("Año inválido (2000-2030)"),
  body("color").notEmpty().withMessage("El color es requerido"),
];

const actualizar = [
  body("marca").optional().notEmpty().withMessage("La marca no puede estar vacía"),
  body("modelo").optional().notEmpty().withMessage("El modelo no puede estar vacío"),
  body("placa").optional().notEmpty().withMessage("La placa no puede estar vacía"),
  body("anio").optional().isInt({ min: 2000, max: 2030 }).withMessage("Año inválido (2000-2030)"),
  body("color").optional().notEmpty().withMessage("El color no puede estar vacío"),
  body("activo").optional().isBoolean().withMessage("Activo debe ser booleano"),
];

module.exports = { crear, actualizar };
