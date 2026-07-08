const prisma = require("../config/database");

async function findAll(filters = {}, pagination = {}) {
  return prisma.recarga.findMany({
    where: filters,
    skip: pagination.skip,
    take: pagination.take,
    include: { cliente: { include: { user: true } }, banco: true },
  });
}

async function countAll(filters = {}) {
  return prisma.recarga.count({ where: filters });
}

async function findById(id) {
  return prisma.recarga.findUnique({
    where: { id },
    include: { cliente: { include: { user: true } }, banco: true },
  });
}

async function findByClienteId(clienteId, pagination = {}) {
  return prisma.recarga.findMany({
    where: { cliente_id: clienteId },
    skip: pagination.skip,
    take: pagination.take,
    include: { banco: true },
  });
}

async function countByClienteId(clienteId) {
  return prisma.recarga.count({ where: { cliente_id: clienteId } });
}

async function create(data) {
  return prisma.recarga.create({ data });
}

module.exports = { findAll, countAll, findById, findByClienteId, countByClienteId, create };
