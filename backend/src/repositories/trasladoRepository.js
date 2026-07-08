const prisma = require("../config/database");

async function findAll(filters = {}, pagination = {}) {
  return prisma.traslado.findMany({
    where: filters,
    skip: pagination.skip,
    take: pagination.take,
    include: {
      cliente: { include: { user: true } },
      chofer: { include: { user: true } },
      vehiculo: true,
    },
    orderBy: { fecha: "desc" },
  });
}

async function countAll(filters = {}) {
  return prisma.traslado.count({ where: filters });
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

async function findByClienteId(clienteId, pagination = {}) {
  return prisma.traslado.findMany({
    where: { cliente_id: clienteId },
    skip: pagination.skip,
    take: pagination.take,
    orderBy: { fecha: "desc" },
  });
}

async function countByClienteId(clienteId) {
  return prisma.traslado.count({ where: { cliente_id: clienteId } });
}

async function findByChoferId(choferId, pagination = {}) {
  return prisma.traslado.findMany({
    where: { chofer_id: choferId },
    skip: pagination.skip,
    take: pagination.take,
    orderBy: { fecha: "desc" },
  });
}

async function countByChoferId(choferId) {
  return prisma.traslado.count({ where: { chofer_id: choferId } });
}

async function create(data) {
  return prisma.traslado.create({ data });
}

async function updateEstado(id, estado) {
  return prisma.traslado.update({ where: { id }, data: { estado } });
}

module.exports = { findAll, countAll, findById, findByClienteId, countByClienteId, findByChoferId, countByChoferId, create, updateEstado };
