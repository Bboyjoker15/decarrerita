const prisma = require("../config/database");

async function findAll() {
  return prisma.recarga.findMany({ include: { cliente: { include: { user: true } }, banco: true } });
}

async function findById(id) {
  return prisma.recarga.findUnique({
    where: { id },
    include: { cliente: { include: { user: true } }, banco: true },
  });
}

async function findByClienteId(clienteId) {
  return prisma.recarga.findMany({ where: { cliente_id: clienteId }, include: { banco: true } });
}

async function create(data) {
  return prisma.recarga.create({ data });
}

module.exports = { findAll, findById, findByClienteId, create };
