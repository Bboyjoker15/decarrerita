const prisma = require("../config/database");

async function findAll(filters = {}, pagination = {}) {
  return prisma.vehiculo.findMany({
    where: filters,
    skip: pagination.skip,
    take: pagination.take,
    include: { chofer: { include: { user: true } } },
  });
}

async function countAll(filters = {}) {
  return prisma.vehiculo.count({ where: filters });
}

async function findById(id) {
  return prisma.vehiculo.findUnique({
    where: { id },
    include: { chofer: { include: { user: true } }, revisiones: true },
  });
}

async function findByChoferId(choferId) {
  return prisma.vehiculo.findMany({ where: { chofer_id: choferId } });
}

async function create(data) {
  return prisma.vehiculo.create({ data });
}

async function update(id, data) {
  return prisma.vehiculo.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.vehiculo.delete({ where: { id } });
}

module.exports = { findAll, countAll, findById, findByChoferId, create, update, remove };
