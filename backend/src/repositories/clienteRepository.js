const prisma = require("../config/database");

async function findAll() {
  return prisma.cliente.findMany({ include: { user: true } });
}

async function findById(id) {
  return prisma.cliente.findUnique({ where: { id }, include: { user: true } });
}

async function findByUserId(userId) {
  return prisma.cliente.findUnique({ where: { user_id: userId }, include: { user: true } });
}

async function create(data) {
  return prisma.cliente.create({ data });
}

async function update(id, data) {
  return prisma.cliente.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.cliente.delete({ where: { id } });
}

module.exports = { findAll, findById, findByUserId, create, update, remove };
