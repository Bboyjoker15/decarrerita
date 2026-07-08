const pruebaPsicologicaRepository = require("../repositories/pruebaPsicologicaRepository");

const CALIFICACION_MINIMA = 73;

async function listar() {
  return pruebaPsicologicaRepository.findAll();
}

async function obtenerPorId(id) {
  const prueba = await pruebaPsicologicaRepository.findById(id);
  if (!prueba) return { error: "PRUEBA.NO_ENCONTRADA" };
  return { data: prueba };
}

async function listarPorChofer(choferId) {
  return pruebaPsicologicaRepository.findByChoferId(choferId);
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
