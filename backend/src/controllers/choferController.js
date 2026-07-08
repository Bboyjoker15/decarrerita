const choferService = require("../services/choferService");
const MENSAJES = require("../constants/mensajes");
const { success, error, paginated } = require("../utils/apiResponse");
const { getPagination } = require("../utils/pagination");

async function listar(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const result = await choferService.listar({}, { skip, take: limit });
    paginated(res, result.data, result.total, page, limit);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await choferService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.CHOFER[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const result = await choferService.crear(req.body);
    if (result.error) {
      const key = result.error.split(".")[1];
      return error(res, MENSAJES.AUTH[key] || MENSAJES.CHOFER[key], 400);
    }
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const result = await choferService.actualizar(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.CHOFER[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const result = await choferService.eliminar(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.CHOFER[result.error.split(".")[1]], 404);
    success(res, { message: MENSAJES.CHOFER.ELIMINADO });
  } catch (err) {
    next(err);
  }
}

async function listarContactos(req, res, next) {
  try {
    const result = await choferService.listarContactos(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.CHOFER[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function agregarContacto(req, res, next) {
  try {
    const result = await choferService.agregarContacto(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.CHOFER[result.error.split(".")[1]], 404);
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function eliminarContacto(req, res, next) {
  try {
    const result = await choferService.eliminarContacto(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.CHOFER[result.error.split(".")[1]], 404);
    success(res, { message: MENSAJES.CHOFER.CONTACTO_ELIMINADO });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar, listarContactos, agregarContacto, eliminarContacto };
