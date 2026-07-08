const pruebaPsicologicaRepository = require("../repositories/pruebaPsicologicaRepository");

const CALIFICACION_MINIMA = 73;

async function listar(filters = {}, pagination = {}) {
  const [data, total] = await Promise.all([
    pruebaPsicologicaRepository.findAll(filters, pagination),
    pruebaPsicologicaRepository.countAll(filters),
  ]);
  return { data, total };
}

async function obtenerPorId(id) {
  const prueba = await pruebaPsicologicaRepository.findById(id);
  if (!prueba) return { error: "PRUEBA.NO_ENCONTRADA" };
  return { data: prueba };
}

async function listarPorChofer(choferId) {
  const data = await pruebaPsicologicaRepository.findByChoferId(choferId);
  return { data };
}

async function crear({ chofer_id, calificacion }) {
  if (calificacion < CALIFICACION_MINIMA) {
    return { error: "PRUEBA.PSICOLOGICA_NO_APROBADA" };
  }
  const prueba = await pruebaPsicologicaRepository.create({ chofer_id, calificacion });
  return { data: prueba };
}

async function actualizar(id, data) {
  const prueba = await pruebaPsicologicaRepository.findById(id);
  if (!prueba) return { error: "PRUEBA.NO_ENCONTRADA" };
  if (data.calificacion && data.calificacion < CALIFICACION_MINIMA) {
    return { error: "PRUEBA.PSICOLOGICA_NO_APROBADA" };
  }
  const actualizado = await pruebaPsicologicaRepository.update(id, data);
  return { data: actualizado };
}

module.exports = { listar, obtenerPorId, listarPorChofer, crear, actualizar };
