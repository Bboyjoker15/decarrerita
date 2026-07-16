const reporteService = require("../services/reporteService");
const { success } = require("../utils/apiResponse");

async function gananciasEmpresa(req, res, next) {
  try {
    const filtros = {};
    if (req.query.fechaInicio) filtros.fechaInicio = req.query.fechaInicio;
    if (req.query.fechaFin) filtros.fechaFin = req.query.fechaFin;

    const resultado = await reporteService.calcularGananciasEmpresa(filtros);
    success(res, resultado);
  } catch (err) {
    next(err);
  }
}

async function pagosChofer(req, res, next) {
  try {
    const choferId = Number(req.params.id);
    const filtros = {};
    if (req.query.fechaInicio) filtros.fechaInicio = req.query.fechaInicio;
    if (req.query.fechaFin) filtros.fechaFin = req.query.fechaFin;

    const resultado = await reporteService.calcularPagosChofer(choferId, filtros);
    success(res, resultado);
  } catch (err) {
    next(err);
  }
}

module.exports = { gananciasEmpresa, pagosChofer };