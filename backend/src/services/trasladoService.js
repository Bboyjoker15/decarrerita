const prisma = require("../config/database");
const trasladoRepository = require("../repositories/trasladoRepository");
const clienteRepository = require("../repositories/clienteRepository");
const choferRepository = require("../repositories/choferRepository");

const PORCENTAJE_EMPRESA = 0.3;
const PORCENTAJE_CHOFER = 0.7;
const NOTA_MINIMA_PRUEBA = 73;
const NOTA_MINIMA_REVISION = 65;
const DIAS_VIGENCIA = 365;

/**
 * Busca un chofer disponible aleatoriamente filtrando por:
 * - Prueba psicologica vigente (menor a 365 dias) con calificacion >= 73
 * - Revision vehiculo vigente (menor a 365 dias) con calificacion >= 65
 * - Vehiculo activo
 */
async function seleccionarChoferAleatorio() {
  const fechaLimite = new Date(Date.now() - DIAS_VIGENCIA * 24 * 60 * 60 * 1000);

  const choferes = await prisma.chofer.findMany({
    where: {
      pruebas: {
        some: {
          calificacion: { gte: NOTA_MINIMA_PRUEBA },
          fecha_prueba: { gte: fechaLimite },
        },
      },
      vehiculos: {
        some: {
          activo: true,
          revisiones: {
            some: {
              calificacion: { gte: NOTA_MINIMA_REVISION },
              fecha_revision: { gte: fechaLimite },
            },
          },
        },
      },
    },
    include: {
      user: true,
      vehiculos: {
        where: {
          activo: true,
          revisiones: {
            some: {
              calificacion: { gte: NOTA_MINIMA_REVISION },
              fecha_revision: { gte: fechaLimite },
            },
          },
        },
      },
    },
  });

  if (choferes.length === 0) return null;

  const indice = Math.floor(Math.random() * choferes.length);
  return choferes[indice];
}

async function listar(filters = {}, pagination = {}, filtrosFechas = {}) {
  const [data, total] = await Promise.all([
    trasladoRepository.findAll(filters, pagination, filtrosFechas),
    trasladoRepository.countAll(filters, filtrosFechas),
  ]);
  return { data, total };
}

async function obtenerPorId(id) {
  const traslado = await trasladoRepository.findById(id);
  if (!traslado) return { error: "TRASLADO.NO_ENCONTRADO" };
  return { data: traslado };
}

async function listarPorCliente(clienteId, pagination = {}, filtrosFechas = {}) {
  const [data, total] = await Promise.all([
    trasladoRepository.findByClienteId(clienteId, pagination, filtrosFechas),
    trasladoRepository.countByClienteId(clienteId, filtrosFechas),
  ]);
  return { data, total };
}

async function listarPorChofer(choferId, pagination = {}, filtrosFechas = {}) {
  const [data, total] = await Promise.all([
    trasladoRepository.findByChoferId(choferId, pagination, filtrosFechas),
    trasladoRepository.countByChoferId(choferId, filtrosFechas),
  ]);
  return { data, total };
}

async function crear({ cliente_id, origen, destino, distancia_km, tarifa_km }) {
  const cliente = await clienteRepository.findById(cliente_id);
  if (!cliente) return { error: "CLIENTE.NO_ENCONTRADO" };

  const monto_total = distancia_km * tarifa_km;

  if (cliente.saldo < monto_total) {
    return { error: "CLIENTE.SALDO_INSUFICIENTE" };
  }

  // Seleccion aleatoria con filtro de vigencia de pruebas y revisiones
  const chofer = await seleccionarChoferAleatorio();
  if (!chofer) return { error: "CHOFER.NO_DISPONIBLE" };

  const vehiculo = chofer.vehiculos[0];

  const ganancia_empresa = parseFloat((monto_total * PORCENTAJE_EMPRESA).toFixed(2));
  const ganancia_chofer = parseFloat((monto_total * PORCENTAJE_CHOFER).toFixed(2));

  await clienteRepository.update(cliente_id, { saldo: parseFloat((cliente.saldo - monto_total).toFixed(2)) });

  await choferRepository.update(chofer.id, { saldo: parseFloat((chofer.saldo + ganancia_chofer).toFixed(2)) });

  const traslado = await trasladoRepository.create({
    cliente_id,
    chofer_id: chofer.id,
    vehiculo_id: vehiculo.id,
    origen,
    destino,
    distancia_km,
    tarifa_km,
    monto_total,
    ganancia_empresa,
    ganancia_chofer,
    estado: "PENDIENTE",
  });

  return { data: traslado };
}

async function actualizarEstado(id, estado) {
  const traslado = await trasladoRepository.findById(id);
  if (!traslado) return { error: "TRASLADO.NO_ENCONTRADO" };
  const actualizado = await trasladoRepository.updateEstado(id, estado);
  return { data: actualizado };
}

module.exports = { listar, obtenerPorId, listarPorCliente, listarPorChofer, crear, actualizarEstado };
