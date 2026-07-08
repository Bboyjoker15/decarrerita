const prisma = require("../config/database");

async function findAll() {
  return prisma.pagoChofer.findMany({
    include: { chofer: { include: { user: true } }, administrativo: true },
    orderBy: { fecha_pago: "desc" },
  });
}

async function findById(id) {
  return prisma.pagoChofer.findUnique({
    where: { id },
    include: { chofer: { include: { user: true } }, administrativo: true },
  });
}

async function findByChoferId(choferId) {
  return prisma.pagoChofer.findMany({ where: { chofer_id: choferId }, orderBy: { fecha_pago: "desc" } });
}

async function create(data) {
  return prisma.pagoChofer.create({ data });
}

module.exports = { findAll, findById, findByChoferId, create };
