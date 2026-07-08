const trasladoRepository = require("../repositories/trasladoRepository");
const clienteRepository = require("../repositories/clienteRepository");
const choferRepository = require("../repositories/choferRepository");
const { randomChoferActivo } = require("../utils/randomSelector");

const PORCENTAJE_EMPRESA = 0.3;
const PORCENTAJE_CHOFER = 0.7;

async function listar(filters = {}) {
  return trasladoRepository.findAll(filters);
}

async function obtenerPorId(id) {
  const traslado = await trasladoRepository.findById(id);
  if (!traslado) return { error: "TRASLADO.NO_ENCONTRADO" };
  return { data: traslado };
}

async function listarPorCliente(clienteId) {
  return trasladoRepository.findByClienteId(clienteId);
}

async function listarPorChofer(choferId) {
  return trasladoRepository.findByChoferId(choferId);
}

async function crear({ cliente_id, origen, destino, distancia_km, tarifa_km }) {
  const cliente = await clienteRepository.findById(cliente_id);
  if (!cliente) return { error: "CLIENTE.NO_ENCONTRADO" };

  const monto_total = distancia_km * tarifa_km;

  if (cliente.saldo < monto_total) {
    return { error: "CLIENTE.SALDO_INSUFICIENTE" };
  }

  const chofer = await randomChoferActivo();
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
