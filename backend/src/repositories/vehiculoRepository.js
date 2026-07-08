const prisma = require("../config/database");

async function findAll() {
  return prisma.vehiculo.findMany({ include: { chofer: { include: { user: true } } } });
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

module.exports = { findAll, findById, findByChoferId, create, update, remove };
