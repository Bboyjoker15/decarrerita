const revisionService = require("../services/revisionVehiculoService");
const MENSAJES = require("../constants/mensajes");
const { success, error } = require("../utils/apiResponse");

async function listar(req, res, next) {
  try {
    const revisiones = await revisionService.listar();
    success(res, revisiones);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await revisionService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.PRUEBA[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const result = await revisionService.crear(req.body);
    if (result.error) return error(res, MENSAJES.PRUEBA[result.error.split(".")[1]], 400);
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const result = await revisionService.actualizar(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.PRUEBA[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar };
