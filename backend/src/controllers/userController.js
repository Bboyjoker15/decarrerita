const userService = require("../services/userService");
const MENSAJES = require("../constants/mensajes");
const { success, error } = require("../utils/apiResponse");

async function listar(req, res, next) {
  try {
    const users = await userService.listar();
    success(res, users);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await userService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.USUARIO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const result = await userService.actualizar(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.USUARIO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const result = await userService.eliminar(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.USUARIO[result.error.split(".")[1]], 404);
    success(res, { message: MENSAJES.USUARIO.ELIMINADO });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, actualizar, eliminar };
