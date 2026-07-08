const prisma = require("../config/database");

async function findAll(filters = {}) {
  return prisma.traslado.findMany({
    where: filters,
    include: {
      cliente: { include: { user: true } },
      chofer: { include: { user: true } },
      vehiculo: true,
    },
    orderBy: { fecha: "desc" },
  });
}

async function findById(id) {
  return prisma.traslado.findUnique({
    where: { id },
    include: {
      cliente: { include: { user: true } },
      chofer: { include: { user: true } },
      vehiculo: true,
    },
  });
}

async function findByClienteId(clienteId) {
  return prisma.traslado.findMany({ where: { cliente_id: clienteId }, orderBy: { fecha: "desc" } });
}

async function findByChoferId(choferId) {
  return prisma.traslado.findMany({ where: { chofer_id: choferId }, orderBy: { fecha: "desc" } });
}

async function create(data) {
  return prisma.traslado.create({ data });
}

async function updateEstado(id, estado) {
  return prisma.traslado.update({ where: { id }, data: { estado } });
}

module.exports = { findAll, findById, findByClienteId, findByChoferId, create, updateEstado };
