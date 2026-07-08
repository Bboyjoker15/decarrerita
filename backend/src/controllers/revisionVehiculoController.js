const revisionService = require("../services/revisionVehiculoService");
const MENSAJES = require("../constants/mensajes");
const { success, error, paginated } = require("../utils/apiResponse");
const { getPagination } = require("../utils/pagination");

async function listarPorVehiculo(req, res, next) {
  try {
    const result = await revisionService.listarPorVehiculo(Number(req.params.id));
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const result = await revisionService.listar({}, { skip, take: limit });
    paginated(res, result.data, result.total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await revisionService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.REVISION[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const result = await revisionService.crear(req.body);
    if (result.error) return error(res, MENSAJES.REVISION[result.error.split(".")[1]], 400);
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const result = await revisionService.actualizar(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.REVISION[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, listarPorVehiculo, obtenerPorId, crear, actualizar };
