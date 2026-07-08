const recargaService = require("../services/recargaService");
const clienteService = require("../services/clienteService");
const MENSAJES = require("../constants/mensajes");
const { success, error } = require("../utils/apiResponse");

async function listar(req, res, next) {
  try {
    const recargas = await recargaService.listar();
    success(res, recargas);
  } catch (err) {
    next(err);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const result = await recargaService.obtenerPorId(Number(req.params.id));
    if (result.error) return error(res, MENSAJES.RECARGA[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const cliente = await clienteService.obtenerPorUserId(req.user.id);
    if (cliente.error) return error(res, MENSAJES.CLIENTE[cliente.error.split(".")[1]], 404);

    const result = await recargaService.crear({
      cliente_id: cliente.data.id,
      banco_id: req.body.banco_id,
      referencia: req.body.referencia,
      monto: req.body.monto,
    });

    if (result.error) return error(res, MENSAJES.RECARGA[result.error.split(".")[1]], 400);
    success(res, result.data, 201);
  } catch (err) {
    next(err);
  }
}

async function misRecargas(req, res, next) {
  try {
    const cliente = await clienteService.obtenerPorUserId(req.user.id);
    if (cliente.error) return error(res, MENSAJES.CLIENTE[cliente.error.split(".")[1]], 404);
    const recargas = await recargaService.listarPorCliente(cliente.data.id);
    success(res, recargas);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, misRecargas };
