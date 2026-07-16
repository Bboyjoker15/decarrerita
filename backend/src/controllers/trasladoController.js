const trasladoService = require("../services/trasladoService");
const clienteService = require("../services/clienteService");
const choferService = require("../services/choferService");
const MENSAJES = require("../constants/mensajes");
const { success, error, paginated } = require("../utils/apiResponse");
const { getPagination } = require("../utils/pagination");

async function listar(req, res, next) {
  try {
    const filters = {};
    if (req.query.estado) filters.estado = req.query.estado;
    if (req.query.cliente_id) filters.cliente_id = parseInt(req.query.cliente_id);
    if (req.query.chofer_id) filters.chofer_id = parseInt(req.query.chofer_id);
    const filtrosFechas = {};
    if (req.query.fechaInicio) filtrosFechas.fechaInicio = req.query.fechaInicio;
    if (req.query.fechaFin) filtrosFechas.fechaFin = req.query.fechaFin;
    const { page, limit, skip } = getPagination(req.query);
    const result = await trasladoService.listar(filters, { skip, take: limit }, filtrosFechas);
    paginated(res, result.data, result.total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await trasladoService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.TRASLADO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const cliente = await clienteService.obtenerPorUserId(req.user.id);
    if (cliente.error) return error(res, MENSAJES.CLIENTE[cliente.error.split(".")[1]], 404);

    const result = await trasladoService.crear({
      cliente_id: cliente.data.id,
      origen: req.body.origen,
      destino: req.body.destino,
      distancia_km: req.body.distancia_km,
      tarifa_km: req.body.tarifa_km,
    });

    if (result.error) {
      const key = result.error.split(".")[1];
      return error(res, MENSAJES.CLIENTE[key] || MENSAJES.CHOFER[key] || MENSAJES.TRASLADO[key], 400);
    }

    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function misTraslados(req, res, next) {
  try {
    const cliente = await clienteService.obtenerPorUserId(req.user.id);
    if (cliente.error) return error(res, MENSAJES.CLIENTE[cliente.error.split(".")[1]], 404);
    const filtrosFechas = {};
    if (req.query.fechaInicio) filtrosFechas.fechaInicio = req.query.fechaInicio;
    if (req.query.fechaFin) filtrosFechas.fechaFin = req.query.fechaFin;
    const { page, limit, skip } = getPagination(req.query);
    const result = await trasladoService.listarPorCliente(cliente.data.id, { skip, take: limit }, filtrosFechas);
    paginated(res, result.data, result.total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function misTrasladosChofer(req, res, next) {
  try {
    const chofer = await choferService.obtenerPorUserId(req.user.id);
    if (chofer.error) return error(res, MENSAJES.CHOFER[chofer.error.split(".")[1]], 404);
    const filtrosFechas = {};
    if (req.query.fechaInicio) filtrosFechas.fechaInicio = req.query.fechaInicio;
    if (req.query.fechaFin) filtrosFechas.fechaFin = req.query.fechaFin;
    const { page, limit, skip } = getPagination(req.query);
    const result = await trasladoService.listarPorChofer(chofer.data.id, { skip, take: limit }, filtrosFechas);
    paginated(res, result.data, result.total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function actualizarEstado(req, res, next) {
  try {
    const chofer = await choferService.obtenerPorUserId(req.user.id);
    if (chofer.error) return error(res, MENSAJES.CHOFER[chofer.error.split(".")[1]], 404);

    const traslado = await trasladoService.obtenerPorId(Number(req.params.id));
    if (traslado.error) return error(res, MENSAJES.TRASLADO[traslado.error.split(".")[1]], 404);

    if (traslado.data.chofer_id !== chofer.data.id) {
      return error(res, MENSAJES.GENERAL.NO_AUTORIZADO, 403);
    }

    const result = await trasladoService.actualizarEstado(Number(req.params.id), req.body.estado);
    if (result.error) return error(res, MENSAJES.TRASLADO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, misTraslados, misTrasladosChofer, actualizarEstado };
