const prisma = require("../config/database");

/**
 * Construye el filtro de rango de fechas para Prisma.
 * Aplica gte (mayor o igual) y lte (menor o igual) sobre el campo 'fecha_pago'.
 * @param {Object} filtrosFechas - Contiene fechaInicio y/o fechaFin
 * @returns {Object} Filtro de Prisma para incluir en where
 */
function buildFechaFilter(filtrosFechas = {}) {
  const filter = {};
  if (filtrosFechas.fechaInicio) {
    const startStr = filtrosFechas.fechaInicio.includes("T")
      ? filtrosFechas.fechaInicio
      : `${filtrosFechas.fechaInicio}T00:00:00.000Z`;
    filter.gte = new Date(startStr);
  }
  if (filtrosFechas.fechaFin) {
    const endStr = filtrosFechas.fechaFin.includes("T")
      ? filtrosFechas.fechaFin
      : `${filtrosFechas.fechaFin}T23:59:59.999Z`;
    filter.lte = new Date(endStr);
  }
  return Object.keys(filter).length > 0 ? { fecha_pago: filter } : {};
}

async function findAll(filters = {}, pagination = {}, filtrosFechas = {}) {
  const where = { ...filters, ...buildFechaFilter(filtrosFechas) };
  return prisma.pagoChofer.findMany({
    where,
    skip: pagination.skip,
    take: pagination.take,
    include: { chofer: { include: { user: true } }, administrativo: true },
    orderBy: { fecha_pago: "desc" },
  });
}

async function countAll(filters = {}, filtrosFechas = {}) {
  const where = { ...filters, ...buildFechaFilter(filtrosFechas) };
  return prisma.pagoChofer.count({ where });
}

async function findById(id) {
  return prisma.pagoChofer.findUnique({
    where: { id },
    include: { chofer: { include: { user: true } }, administrativo: true },
  });
}

async function findByChoferId(choferId, pagination = {}, filtrosFechas = {}) {
  const where = { chofer_id: choferId, ...buildFechaFilter(filtrosFechas) };
  return prisma.pagoChofer.findMany({
    where,
    skip: pagination.skip,
    take: pagination.take,
    orderBy: { fecha_pago: "desc" },
  });
}

async function countByChoferId(choferId, filtrosFechas = {}) {
  const where = { chofer_id: choferId, ...buildFechaFilter(filtrosFechas) };
  return prisma.pagoChofer.count({ where });
}

async function create(data) {
  return prisma.pagoChofer.create({ data });
}

module.exports = { findAll, countAll, findById, findByChoferId, countByChoferId, create };
