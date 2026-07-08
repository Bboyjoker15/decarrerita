const vehiculoService = require("../services/vehiculoService");
const MENSAJES = require("../constants/mensajes");
const { success, error } = require("../utils/apiResponse");

async function listar(req, res, next) {
  try {
    const vehiculos = await vehiculoService.listar();
    success(res, vehiculos);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await vehiculoService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.VEHICULO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const result = await vehiculoService.crear(req.body);
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const result = await vehiculoService.actualizar(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.VEHICULO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const result = await vehiculoService.eliminar(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.VEHICULO[result.error.split(".")[1]], 404);
    success(res, { message: MENSAJES.VEHICULO.ELIMINADO });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
