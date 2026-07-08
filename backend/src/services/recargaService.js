const recargaRepository = require("../repositories/recargaRepository");
const clienteRepository = require("../repositories/clienteRepository");

async function listar(filters = {}, pagination = {}) {
  const [data, total] = await Promise.all([
    recargaRepository.findAll(filters, pagination),
    recargaRepository.countAll(filters),
  ]);
  return { data, total };
}

async function obtenerPorId(id) {
  const recarga = await recargaRepository.findById(id);
  if (!recarga) return { error: "RECARGA.NO_ENCONTRADA" };
  return { data: recarga };
}

async function listarPorCliente(clienteId, pagination = {}) {
  const [data, total] = await Promise.all([
    recargaRepository.findByClienteId(clienteId, pagination),
    recargaRepository.countByClienteId(clienteId),
  ]);
  return { data, total };
}

async function crear({ cliente_id, banco_id, referencia, monto }) {
  if (monto <= 0) return { error: "RECARGA.MONTO_INVALIDO" };

  const cliente = await clienteRepository.findById(cliente_id);
  if (!cliente) return { error: "CLIENTE.NO_ENCONTRADO" };

  const recarga = await recargaRepository.create({ cliente_id, banco_id, referencia, monto });

  await clienteRepository.update(cliente_id, { saldo: cliente.saldo + monto });

  return { data: recarga };
}

module.exports = { listar, obtenerPorId, listarPorCliente, crear };
