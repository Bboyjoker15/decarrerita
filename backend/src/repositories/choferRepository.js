const prisma = require("../config/database");

async function findAll(filters = {}, pagination = {}) {
  return prisma.chofer.findMany({
    where: filters,
    skip: pagination.skip,
    take: pagination.take,
    include: { user: true, banco: true, vehiculos: true, contactos: true },
  });
}

async function countAll(filters = {}) {
  return prisma.chofer.count({ where: filters });
}

async function findById(id) {
  return prisma.chofer.findUnique({
    where: { id },
    include: { user: true, banco: true, vehiculos: true, contactos: true, pruebas: true },
  });
}

async function findByUserId(userId) {
  return prisma.chofer.findUnique({ where: { user_id: userId } });
}

async function create(data) {
  return prisma.chofer.create({ data });
}

async function update(id, data) {
  return prisma.chofer.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.chofer.delete({ where: { id } });
}

async function findContactosByChoferId(choferId) {
  return prisma.contactoEmergencia.findMany({ where: { chofer_id: choferId } });
}

async function findContactoById(id) {
  return prisma.contactoEmergencia.findUnique({ where: { id } });
}

async function createContacto(data) {
  return prisma.contactoEmergencia.create({ data });
}

async function deleteContacto(id) {
  return prisma.contactoEmergencia.delete({ where: { id } });
}

module.exports = { findAll, countAll, findById, findByUserId, create, update, remove, findContactosByChoferId, findContactoById, createContacto, deleteContacto };
