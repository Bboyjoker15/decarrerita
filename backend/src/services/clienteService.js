const clienteRepository = require("../repositories/clienteRepository");

async function listar() {
  return clienteRepository.findAll();
}

async function obtenerPorId(id) {
  const cliente = await clienteRepository.findById(id);
  if (!cliente) return { error: "CLIENTE.NO_ENCONTRADO" };
  return { data: cliente };
}

async function obtenerPorUserId(userId) {
  const cliente = await clienteRepository.findByUserId(userId);
  if (!cliente) return { error: "CLIENTE.NO_ENCONTRADO" };
  return { data: cliente };
}

async function actualizar(id, data) {
  const cliente = await clienteRepository.findById(id);
  if (!cliente) return { error: "CLIENTE.NO_ENCONTRADO" };
  const actualizado = await clienteRepository.update(id, data);
  return { data: actualizado };
}

async function eliminar(id) {
  const cliente = await clienteRepository.findById(id);
  if (!cliente) return { error: "CLIENTE.NO_ENCONTRADO" };
  await clienteRepository.remove(id);
  return { data: null };
}

async function consultarSaldo(clienteId) {
  const cliente = await clienteRepository.findById(clienteId);
  if (!cliente) return { error: "CLIENTE.NO_ENCONTRADO" };
  return { data: { saldo: cliente.saldo } };
}

module.exports = { listar, obtenerPorId, obtenerPorUserId, actualizar, eliminar, consultarSaldo };
