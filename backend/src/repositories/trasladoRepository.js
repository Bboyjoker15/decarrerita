const prisma = require("../config/database");

/**
 * Construye el filtro de rango de fechas para Prisma.
 * Aplica gte (mayor o igual) y lte (menor o igual) sobre el campo 'fecha'.
 * @param {Object} filtrosFechas - Contiene fechaInicio y/o fechaFin
 * @returns {Object} Filtro de Prisma para incluir en where
 */
function buildFechaFilter(filtrosFechas = {}) {
  const filter = {};
  if (filtrosFechas.fechaInicio) {
    filter.gte = new Date(filtrosFechas.fechaInicio);
  }
  if (filtrosFechas.fechaFin) {
    filter.lte = new Date(filtrosFechas.fechaFin);
  }
  return Object.keys(filter).length > 0 ? { fecha: filter } : {};
}

async function findAll(filters = {}, pagination = {}, filtrosFechas = {}) {
  const where = { ...filters, ...buildFechaFilter(filtrosFechas) };
  return prisma.traslado.findMany({
    where,
    skip: pagination.skip,
    take: pagination.take,
    include: {
      cliente: { include: { user: true } },
      chofer: { include: { user: true } },
      vehiculo: true,
    },
    orderBy: { fecha: "desc" },
  });
}

async function countAll(filters = {}, filtrosFechas = {}) {
  const where = { ...filters, ...buildFechaFilter(filtrosFechas) };
  return prisma.traslado.count({ where });
}

async function findById(id) {
  return prisma.traslado.findUnique({
    where: { id },
    include: {
      cliente: { include: { user: true } },
      chofer: { include: { user: true } },
      vehiculo: true,
    },
  });
}

async function findByClienteId(clienteId, pagination = {}, filtrosFechas = {}) {
  const where = { cliente_id: clienteId, ...buildFechaFilter(filtrosFechas) };
  return prisma.traslado.findMany({
    where,
    skip: pagination.skip,
    take: pagination.take,
    include: {
      chofer: { include: { user: true } },
      vehiculo: true,
    },
    orderBy: { fecha: "desc" },
  });
}

async function countByClienteId(clienteId, filtrosFechas = {}) {
  const where = { cliente_id: clienteId, ...buildFechaFilter(filtrosFechas) };
  return prisma.traslado.count({ where });
}

async function findByChoferId(choferId, pagination = {}, filtrosFechas = {}) {
  const where = { chofer_id: choferId, ...buildFechaFilter(filtrosFechas) };
  return prisma.traslado.findMany({
    where,
    skip: pagination.skip,
    take: pagination.take,
    include: {
      cliente: { include: { user: true } },
      vehiculo: true,
    },
    orderBy: { fecha: "desc" },
  });
}

async function countByChoferId(choferId, filtrosFechas = {}) {
  const where = { chofer_id: choferId, ...buildFechaFilter(filtrosFechas) };
  return prisma.traslado.count({ where });
}

async function updateManyByChoferId(choferId, data) {
  return prisma.traslado.updateMany({ where: { chofer_id: choferId }, data });
}

async function create(data) {
  return prisma.traslado.create({
    data,
    include: {
      chofer: { include: { user: true } },
      vehiculo: true,
    },
  });
}

async function updateEstado(id, estado) {
  return prisma.traslado.update({ where: { id }, data: { estado } });
}

module.exports = { findAll, countAll, findById, findByClienteId, countByClienteId, findByChoferId, countByChoferId, updateManyByChoferId, create, updateEstado };
