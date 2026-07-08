const prisma = require("../config/database");

async function findAll(filters = {}, pagination = {}) {
  return prisma.revisionVehiculo.findMany({
    where: filters,
    skip: pagination.skip,
    take: pagination.take,
    include: { vehiculo: { include: { chofer: { include: { user: true } } } } },
    orderBy: { fecha_revision: "desc" },
  });
}

async function countAll(filters = {}) {
  return prisma.revisionVehiculo.count({ where: filters });
}

async function findById(id) {
  return prisma.revisionVehiculo.findUnique({
    where: { id },
    include: { vehiculo: { include: { chofer: { include: { user: true } } } } },
  });
}

async function findByVehiculoId(vehiculoId) {
  return prisma.revisionVehiculo.findMany({ where: { vehiculo_id: vehiculoId }, orderBy: { fecha_revision: "desc" } });
}

async function create(data) {
  return prisma.revisionVehiculo.create({ data });
}

async function update(id, data) {
  return prisma.revisionVehiculo.update({ where: { id }, data });
}

module.exports = { findAll, countAll, findById, findByVehiculoId, create, update };
