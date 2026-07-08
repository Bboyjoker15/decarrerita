const vehiculoRepository = require("../repositories/vehiculoRepository");

async function listar() {
  return vehiculoRepository.findAll();
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

async function eliminar(id) {
  const vehiculo = await vehiculoRepository.findById(id);
  if (!vehiculo) return { error: "VEHICULO.NO_ENCONTRADO" };
  await vehiculoRepository.remove(id);
  return { data: null };
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
