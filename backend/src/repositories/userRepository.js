const prisma = require("../config/database");

async function findAll(filters = {}) {
  return prisma.user.findMany({ where: filters });
}

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function findByCorreo(correo) {
  return prisma.user.findUnique({ where: { correo } });
}

async function findByCedula(cedula) {
  return prisma.user.findUnique({ where: { cedula } });
}

async function create(data) {
  return prisma.user.create({ data });
}

async function update(id, data) {
  return prisma.user.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.user.delete({ where: { id } });
}

module.exports = { findAll, findById, findByCorreo, findByCedula, create, update, remove };
