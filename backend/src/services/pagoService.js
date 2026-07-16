const prisma = require("../config/database");
const pagoRepository = require("../repositories/pagoRepository");
const choferRepository = require("../repositories/choferRepository");

async function listar(filters = {}, pagination = {}, filtrosFechas = {}) {
  const [data, total] = await Promise.all([
    pagoRepository.findAll(filters, pagination, filtrosFechas),
    pagoRepository.countAll(filters, filtrosFechas),
  ]);
  return { data, total };
}

async function obtenerPorId(id) {
  const pago = await pagoRepository.findById(id);
  if (!pago) return { error: "PAGO.NO_ENCONTRADO" };
  return { data: pago };
}

async function listarPorChofer(choferId, pagination = {}, filtrosFechas = {}) {
  const [data, total] = await Promise.all([
    pagoRepository.findByChoferId(choferId, pagination, filtrosFechas),
    pagoRepository.countByChoferId(choferId, filtrosFechas),
  ]);
  return { data, total };
}

async function crear({ chofer_id, administrativo_id, monto, referencia }) {
  const chofer = await choferRepository.findById(chofer_id);
  if (!chofer) return { error: "CHOFER.NO_ENCONTRADO" };

  if (monto > chofer.saldo) {
    return { error: "PAGO.MONTO_EXCEDE" };
  }

  // Transaccion atomica: registra el pago, descuenta saldo y actualiza traslados pendientes
  const pago = await prisma.$transaction(async (tx) => {
    const nuevoPago = await tx.pagoChofer.create({
      data: { chofer_id, administrativo_id, monto, referencia },
    });

    // Descuenta el monto del saldo actual del chofer
    await tx.chofer.update({
      where: { id: chofer_id },
      data: { saldo: parseFloat((chofer.saldo - monto).toFixed(2)) },
    });

    // Cierre contable: marca como PAGADO todos los traslados del chofer pendientes de liquidar
    await tx.traslado.updateMany({
      where: { chofer_id, estado_pago: "PENDIENTE" },
      data: { estado_pago: "PAGADO" },
    });

    return nuevoPago;
  });

  return { data: pago };
}

module.exports = { listar, obtenerPorId, listarPorChofer, crear };
