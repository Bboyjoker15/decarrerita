const prisma = require("../config/database");

async function findAll(filters = {}, pagination = {}) {
  return prisma.pruebaPsicologica.findMany({
    where: filters,
    skip: pagination.skip,
    take: pagination.take,
    include: { chofer: { include: { user: true } } },
    orderBy: { fecha_prueba: "desc" },
  });
}

async function countAll(filters = {}) {
  return prisma.pruebaPsicologica.count({ where: filters });
}

async function findById(id) {
  return prisma.pruebaPsicologica.findUnique({
    where: { id },
    include: { chofer: { include: { user: true } } },
  });
}

async function findByChoferId(choferId) {
  return prisma.pruebaPsicologica.findMany({ where: { chofer_id: choferId }, orderBy: { fecha_prueba: "desc" } });
}

async function create(data) {
  return prisma.pruebaPsicologica.create({ data });
}

async function update(id, data) {
  return prisma.pruebaPsicologica.update({ where: { id }, data });
}

module.exports = { findAll, countAll, findById, findByChoferId, create, update };
