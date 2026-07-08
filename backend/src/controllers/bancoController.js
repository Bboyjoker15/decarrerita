const bancoService = require("../services/bancoService");
const MENSAJES = require("../constants/mensajes");
const { success, error, paginated } = require("../utils/apiResponse");
const { getPagination } = require("../utils/pagination");

async function listar(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const result = await bancoService.listar({}, { skip, take: limit });
    paginated(res, result.data, result.total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await bancoService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.BANCO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const result = await bancoService.crear(req.body);
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const result = await bancoService.actualizar(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.BANCO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const result = await bancoService.eliminar(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.BANCO[result.error.split(".")[1]], 404);
    success(res, { message: MENSAJES.BANCO.ELIMINADO });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
