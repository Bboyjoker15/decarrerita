const prisma = require("../config/database");

async function findAll() {
  return prisma.banco.findMany();
}

async function findById(id) {
  return prisma.banco.findUnique({ where: { id } });
}

async function create(data) {
  return prisma.banco.create({ data });
}

async function update(id, data) {
  return prisma.banco.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.banco.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
