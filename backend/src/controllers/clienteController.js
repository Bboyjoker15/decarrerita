const clienteService = require("../services/clienteService");
const MENSAJES = require("../constants/mensajes");
const { success, error } = require("../utils/apiResponse");

async function listar(req, res, next) {
  try {
    const clientes = await clienteService.listar();
    success(res, clientes);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await clienteService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.CLIENTE[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const result = await clienteService.actualizar(Number(req.params.id), req.body);
    if (result.error) return error(res, MENSAJES.CLIENTE[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const result = await clienteService.eliminar(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.CLIENTE[result.error.split(".")[1]], 404);
    success(res, { message: MENSAJES.CLIENTE.ELIMINADO });
  } catch (err) {
    next(err);
  }
}

async function miSaldo(req, res, next) {
  try {
    const cliente = await clienteService.obtenerPorUserId(req.user.id);
    if (cliente.error) return error(res, MENSAJES.CLIENTE[cliente.error.split(".")[1]], 404);
    const saldo = await clienteService.consultarSaldo(cliente.data.id);
    success(res, saldo.data);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, actualizar, eliminar, miSaldo };
