const pagoService = require("../services/pagoService");
const MENSAJES = require("../constants/mensajes");
const { success, error, paginated } = require("../utils/apiResponse");
const { getPagination } = require("../utils/pagination");

async function listar(req, res, next) {
  try {
    const filters = {};
    if (req.query.chofer_id) filters.chofer_id = parseInt(req.query.chofer_id);
    const filtrosFechas = {};
    if (req.query.fechaInicio) filtrosFechas.fechaInicio = req.query.fechaInicio;
    if (req.query.fechaFin) filtrosFechas.fechaFin = req.query.fechaFin;
    const { page, limit, skip } = getPagination(req.query);
    const result = await pagoService.listar(filters, { skip, take: limit }, filtrosFechas);
    paginated(res, result.data, result.total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await pagoService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.PAGO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function listarPorChofer(req, res, next) {
  try {
    const filtrosFechas = {};
    if (req.query.fechaInicio) filtrosFechas.fechaInicio = req.query.fechaInicio;
    if (req.query.fechaFin) filtrosFechas.fechaFin = req.query.fechaFin;
    const { page, limit, skip } = getPagination(req.query);
    const result = await pagoService.listarPorChofer(Number(req.params.id), { skip, take: limit }, filtrosFechas);
    paginated(res, result.data, result.total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const result = await pagoService.crear({
      chofer_id: req.body.chofer_id,
      administrativo_id: req.user.id,
      monto: req.body.monto,
      referencia: req.body.referencia,
    });

    if (result.error) {
      const key = result.error.split(".")[1];
      return error(res, MENSAJES.CHOFER[key] || MENSAJES.PAGO[key], 400);
    }

    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, listarPorChofer, crear };
