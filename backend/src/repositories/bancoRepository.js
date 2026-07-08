const prisma = require("../config/database");

async function findAll(filters = {}, pagination = {}) {
  return prisma.banco.findMany({ where: filters, skip: pagination.skip, take: pagination.take });
}

async function countAll(filters = {}) {
  return prisma.banco.count({ where: filters });
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

module.exports = { findAll, countAll, findById, create, update, remove };
