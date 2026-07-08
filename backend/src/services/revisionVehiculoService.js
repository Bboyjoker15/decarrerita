const revisionVehiculoRepository = require("../repositories/revisionVehiculoRepository");

const CALIFICACION_MINIMA = 65;

async function listar() {
  return revisionVehiculoRepository.findAll();
}

async function obtenerPorId(id) {
  const revision = await revisionVehiculoRepository.findById(id);
  if (!revision) return { error: "REVISION.NO_ENCONTRADA" };
  return { data: revision };
}

async function listarPorVehiculo(vehiculoId) {
  return revisionVehiculoRepository.findByVehiculoId(vehiculoId);
}

async function crear({ vehiculo_id, calificacion }) {
  if (calificacion < CALIFICACION_MINIMA) {
    return { error: "PRUEBA.REVISION_NO_APROBADA" };
  }
  const revision = await revisionVehiculoRepository.create({ vehiculo_id, calificacion });
  return { data: revision };
}

async function actualizar(id, data) {
  const revision = await revisionVehiculoRepository.findById(id);
  if (!revision) return { error: "REVISION.NO_ENCONTRADA" };
  if (data.calificacion && data.calificacion < CALIFICACION_MINIMA) {
    return { error: "PRUEBA.REVISION_NO_APROBADA" };
  }
  const actualizado = await revisionVehiculoRepository.update(id, data);
  return { data: actualizado };
}

module.exports = { listar, obtenerPorId, listarPorVehiculo, crear, actualizar };
