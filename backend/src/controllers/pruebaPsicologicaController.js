const pruebaService = require("../services/pruebaPsicologicaService");
const MENSAJES = require("../constants/mensajes");
const { success, error } = require("../utils/apiResponse");

async function listar(req, res, next) {
  try {
    const pruebas = await pruebaService.listar();
    success(res, pruebas);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await pruebaService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.PRUEBA[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const result = await pruebaService.crear(req.body);
    if (result.error) return error(res, MENSAJES.PRUEBA[result.error.split(".")[1]], 400);
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const result = await pruebaService.actualizar(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.PRUEBA[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar };
