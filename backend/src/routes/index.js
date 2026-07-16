const { Router } = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const clienteRoutes = require("./clienteRoutes");
const choferRoutes = require("./choferRoutes");
const vehiculoRoutes = require("./vehiculoRoutes");
const bancoRoutes = require("./bancoRoutes");
const recargaRoutes = require("./recargaRoutes");
const trasladoRoutes = require("./trasladoRoutes");
const pagoRoutes = require("./pagoRoutes");
const pruebaPsicologicaRoutes = require("./pruebaPsicologicaRoutes");
const revisionVehiculoRoutes = require("./revisionVehiculoRoutes");
const reporteRoutes = require("./reporteRoutes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/clientes", clienteRoutes);
router.use("/choferes", choferRoutes);
router.use("/vehiculos", vehiculoRoutes);
router.use("/bancos", bancoRoutes);
router.use("/recargas", recargaRoutes);
router.use("/traslados", trasladoRoutes);
router.use("/pagos", pagoRoutes);
router.use("/pruebas-psicologicas", pruebaPsicologicaRoutes);
router.use("/revisiones-vehiculo", revisionVehiculoRoutes);
router.use("/reportes", reporteRoutes);

module.exports = router;
