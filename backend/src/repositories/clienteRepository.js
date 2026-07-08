const prisma = require("../config/database");

async function findAll(filters = {}, pagination = {}) {
  return prisma.cliente.findMany({
    where: filters,
    skip: pagination.skip,
    take: pagination.take,
    include: { user: true },
  });
}

async function countAll(filters = {}) {
  return prisma.cliente.count({ where: filters });
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

module.exports = { findAll, countAll, findById, findByUserId, create, update, remove };
