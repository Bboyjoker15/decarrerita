const trasladoService = require("../services/trasladoService");
const clienteService = require("../services/clienteService");
const choferService = require("../services/choferService");
const MENSAJES = require("../constants/mensajes");
const { success, error } = require("../utils/apiResponse");

async function listar(req, res, next) {
  try {
    const traslados = await trasladoService.listar();
    success(res, traslados);
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
    const traslados = await trasladoService.listarPorCliente(cliente.data.id);
    success(res, traslados);
  } catch (err) {
    next(err);
  }
}

async function misTrasladosChofer(req, res, next) {
  try {
    const chofer = await choferService.obtenerPorUserId(req.user.id);
    if (chofer.error) return error(res, MENSAJES.CHOFER[chofer.error.split(".")[1]], 404);
    const traslados = await trasladoService.listarPorChofer(chofer.data.id);
    success(res, traslados);
  } catch (err) {
    next(err);
  }
}

async function actualizarEstado(req, res, next) {
  try {
    const result = await trasladoService.actualizarEstado(Number(req.params.id), req.body.estado);
    if (result.error) return error(res, MENSAJES.TRASLADO[result.error.split(".")[1]], 404);
    success(res, result.data);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerPorId, crear, misTraslados, misTrasladosChofer, actualizarEstado };
