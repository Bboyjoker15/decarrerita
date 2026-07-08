const vehiculoRepository = require("../repositories/vehiculoRepository");

async function listar(filters = {}, pagination = {}) {
  const [data, total] = await Promise.all([
    vehiculoRepository.findAll(filters, pagination),
    vehiculoRepository.countAll(filters),
  ]);
  return { data, total };
}

async function obtenerPorId(id) {
  const vehiculo = await vehiculoRepository.findById(id);
  if (!vehiculo) return { error: "VEHICULO.NO_ENCONTRADO" };
  return { data: vehiculo };
}

async function crear(data) {
  const creado = await vehiculoRepository.create(data);
  return { data: creado };
}

async function actualizar(id, data) {
  const vehiculo = await vehiculoRepository.findById(id);
  if (!vehiculo) return { error: "VEHICULO.NO_ENCONTRADO" };
  const actualizado = await vehiculoRepository.update(id, data);
  return { data: actualizado };
}

async function listarPorChofer(choferId) {
  const data = await vehiculoRepository.findByChoferId(choferId);
  return { data };
}

async function eliminar(id) {
  const vehiculo = await vehiculoRepository.findById(id);
  if (!vehiculo) return { error: "VEHICULO.NO_ENCONTRADO" };
  await vehiculoRepository.remove(id);
  return { data: null };
}

module.exports = { listar, obtenerPorId, listarPorChofer, crear, actualizar, eliminar };
