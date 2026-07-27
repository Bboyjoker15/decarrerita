const prisma = require("../config/database");

/**
 * Calcula la suma total de ganancias de la empresa en un rango de fechas.
 * Filtra traslados con estado COMPLETADO o PAGADO (traslados finalizados).
 */
async function calcularGananciasEmpresa({ fechaInicio, fechaFin }) {
  const inicio = fechaInicio
    ? new Date(fechaInicio.includes("T") ? fechaInicio : `${fechaInicio}T00:00:00.000Z`)
    : new Date("1970-01-01T00:00:00.000Z");
  const fin = fechaFin
    ? new Date(fechaFin.includes("T") ? fechaFin : `${fechaFin}T23:59:59.999Z`)
    : new Date("2100-12-31T23:59:59.999Z");

  const resultado = await prisma.traslado.aggregate({
    _sum: { ganancia_empresa: true },
    where: {
      estado: { in: ["COMPLETADO", "PAGADO", "PENDIENTE"] },
      fecha: { gte: inicio, lte: fin },
    },
  });

  return {
    total_ganancias: resultado._sum.ganancia_empresa || 0,
    fecha_inicio: inicio,
    fecha_fin: fin,
  };
}

/**
 * Calcula el acumulado de pagos realizados a un chofer en un periodo especifico.
 */
async function calcularPagosChofer(choferId, { fechaInicio, fechaFin }) {
  const inicio = fechaInicio
    ? new Date(fechaInicio.includes("T") ? fechaInicio : `${fechaInicio}T00:00:00.000Z`)
    : new Date("1970-01-01T00:00:00.000Z");
  const fin = fechaFin
    ? new Date(fechaFin.includes("T") ? fechaFin : `${fechaFin}T23:59:59.999Z`)
    : new Date("2100-12-31T23:59:59.999Z");

  const resultado = await prisma.pagoChofer.aggregate({
    _sum: { monto: true },
    where: {
      chofer_id: choferId,
      fecha_pago: { gte: inicio, lte: fin },
    },
  });

  return {
    chofer_id: choferId,
    total_pagado: resultado._sum.monto || 0,
    fecha_inicio: inicio,
    fecha_fin: fin,
  };
}

module.exports = { calcularGananciasEmpresa, calcularPagosChofer };
