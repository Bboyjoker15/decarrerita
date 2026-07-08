const pagoRepository = require("../repositories/pagoRepository");
const choferRepository = require("../repositories/choferRepository");

async function listar(filters = {}, pagination = {}) {
  const [data, total] = await Promise.all([
    pagoRepository.findAll(filters, pagination),
    pagoRepository.countAll(filters),
  ]);
  return { data, total };
}

async function obtenerPorId(id) {
  const pago = await pagoRepository.findById(id);
  if (!pago) return { error: "PAGO.NO_ENCONTRADO" };
  return { data: pago };
}

async function listarPorChofer(choferId) {
  const data = await pagoRepository.findByChoferId(choferId);
  return { data };
}

async function crear({ chofer_id, administrativo_id, monto, referencia }) {
  const chofer = await choferRepository.findById(chofer_id);
  if (!chofer) return { error: "CHOFER.NO_ENCONTRADO" };

  if (monto > chofer.saldo) {
    return { error: "PAGO.MONTO_EXCEDE" };
  }

  const pago = await pagoRepository.create({ chofer_id, administrativo_id, monto, referencia });

  await choferRepository.update(chofer_id, { saldo: parseFloat((chofer.saldo - monto).toFixed(2)) });

  return { data: pago };
}

module.exports = { listar, obtenerPorId, listarPorChofer, crear };
